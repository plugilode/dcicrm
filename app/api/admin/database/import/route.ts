import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { Pool } from 'pg';
import { cookies } from 'next/headers';
import { writeFile } from 'fs/promises';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';
import { v4 as uuidv4 } from 'uuid';

// Function to get auth token from cookies
const getAuthToken = (request: Request) => {
  const cookieHeader = request.headers.get('cookie') || '';
  const cookies = Object.fromEntries(
    cookieHeader.split('; ').map(cookie => {
      const [name, value] = cookie.split('=');
      return [name, value];
    })
  );
  
  return cookies['auth_token'];
};

// Function to verify admin status
async function verifyAdmin(authToken: string | undefined) {
  if (!authToken) {
    return false;
  }

  const adminCheckResult = await query(
    'SELECT role FROM users WHERE id = $1 AND is_active = true',
    [authToken]
  );

  return adminCheckResult && 
         adminCheckResult.rows.length > 0 && 
         adminCheckResult.rows[0].role === 'admin';
}

export async function POST(request: Request) {
  try {
    // Verify the user is authenticated and admin
    const authToken = getAuthToken(request);
    const isAdmin = await verifyAdmin(authToken);
    
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin permissions required' },
        { status: 403 }
      );
    }
    
    // Check if the request is multipart/form-data
    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.includes('multipart/form-data')) {
      return NextResponse.json(
        { error: 'Invalid request format. Expected multipart/form-data' },
        { status: 400 }
      );
    }

    // Create a new database connection for transaction
    // Using the same connection from the pool for multiple queries in a transaction
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    });
    
    const client = await pool.connect();
    
    try {
      // Parse the form data
      const formData = await request.formData();
      const sqlFile = formData.get('sqlFile') as File;
      
      if (!sqlFile || !(sqlFile instanceof File)) {
        return NextResponse.json(
          { error: 'SQL file is required' },
          { status: 400 }
        );
      }

      // Check file type
      if (!sqlFile.name.endsWith('.sql')) {
        return NextResponse.json(
          { error: 'Only .sql files are accepted' },
          { status: 400 }
        );
      }

      // Check file size (limit to 10MB)
      if (sqlFile.size > 10 * 1024 * 1024) {
        return NextResponse.json(
          { error: 'File size exceeds limit (10MB)' },
          { status: 400 }
        );
      }

      // Read the file content
      const sqlContent = await sqlFile.text();
      
      // Parse the SQL into individual statements
      const statements = parseSqlStatements(sqlContent);
      
      // Start a transaction
      await client.query('BEGIN');
      
      // Execute each statement in the transaction
      for (const statement of statements) {
        if (statement.trim()) {
          // Skip comments and empty lines
          if (!statement.trim().startsWith('--') && statement.trim().length > 0) {
            await client.query(statement);
          }
        }
      }
      
      // Commit the transaction
      await client.query('COMMIT');
      
      return NextResponse.json({
        message: 'Database import successful',
        statementsExecuted: statements.filter(s => s.trim() && !s.trim().startsWith('--')).length
      });
    } catch (error: any) {
      // Rollback on error
      await client.query('ROLLBACK');
      
      console.error('Error importing database:', error);
      return NextResponse.json(
        { 
          error: 'Failed to import database',
          detail: error.message
        },
        { status: 500 }
      );
    } finally {
      client.release();
      await pool.end();
    }
  } catch (error: any) {
    console.error('Error importing database:', error);
    return NextResponse.json(
      { error: 'Failed to process import request' },
      { status: 500 }
    );
  }
}

// Helper function to parse SQL content into individual statements
function parseSqlStatements(sql: string): string[] {
  // Split on semicolons, but account for quoted strings containing semicolons
  const statements: string[] = [];
  let currentStatement = '';
  let inQuote = false;
  let quoteChar = '';
  
  for (let i = 0; i < sql.length; i++) {
    const char = sql[i];
    const nextChar = i < sql.length - 1 ? sql[i + 1] : '';
    
    // Handle quotes
    if ((char === "'" || char === '"') && (i === 0 || sql[i - 1] !== '\\')) {
      if (!inQuote) {
        inQuote = true;
        quoteChar = char;
      } else if (char === quoteChar) {
        inQuote = false;
      }
    }
    
    // Handle statement termination
    if (char === ';' && !inQuote) {
      statements.push(currentStatement + ';');
      currentStatement = '';
    } else {
      currentStatement += char;
    }
  }
  
  // Add the last statement if there is one
  if (currentStatement.trim()) {
    statements.push(currentStatement);
  }
  
  return statements;
}

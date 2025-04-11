import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { exec } from 'child_process';
import { writeFile } from 'fs/promises';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';

const execPromise = promisify(exec);

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

export async function GET(request: Request) {
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

    // Rather than using pg_dump (which requires exec and system access), we'll create a SQL export manually
    // First, get all table names
    const tablesResult = await query(`
      SELECT 
        table_name 
      FROM 
        information_schema.tables 
      WHERE 
        table_schema = 'public' 
        AND table_type = 'BASE TABLE'
      ORDER BY 
        table_name;
    `);

    if (!tablesResult || tablesResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'No tables found to export' },
        { status: 404 }
      );
    }

    // Start building the SQL export
    let sqlExport = `-- Database export created on ${new Date().toISOString()}\n\n`;
    
    // For each table, get the schema and data
    for (const tableRow of tablesResult.rows) {
      const tableName = tableRow.table_name;

      // Get table schema (columns and types)
      const schemaResult = await query(`
        SELECT 
          column_name, 
          data_type, 
          column_default, 
          is_nullable
        FROM 
          information_schema.columns
        WHERE 
          table_schema = 'public' 
          AND table_name = $1
        ORDER BY 
          ordinal_position;
      `, [tableName]);

      if (!schemaResult || schemaResult.rows.length === 0) {
        continue;
      }

      // Create CREATE TABLE statement
      sqlExport += `-- Table: ${tableName}\n`;
      sqlExport += `DROP TABLE IF EXISTS "${tableName}" CASCADE;\n`;
      sqlExport += `CREATE TABLE "${tableName}" (\n`;
      
      const columnDefs = schemaResult.rows.map((column: any) => {
        let columnDef = `  "${column.column_name}" ${column.data_type}`;
        if (column.column_default) {
          columnDef += ` DEFAULT ${column.column_default}`;
        }
        if (column.is_nullable === 'NO') {
          columnDef += ' NOT NULL';
        }
        return columnDef;
      });

      // Get primary key constraints
      const pkResult = await query(`
        SELECT 
          tc.constraint_name, 
          kcu.column_name
        FROM 
          information_schema.table_constraints tc
          JOIN information_schema.key_column_usage kcu
            ON tc.constraint_name = kcu.constraint_name
            AND tc.table_schema = kcu.table_schema
        WHERE 
          tc.constraint_type = 'PRIMARY KEY' 
          AND tc.table_schema = 'public'
          AND tc.table_name = $1
        ORDER BY 
          kcu.ordinal_position;
      `, [tableName]);

      if (pkResult && pkResult.rows.length > 0) {
        const pkColumns = pkResult.rows.map(row => `"${row.column_name}"`).join(', ');
        columnDefs.push(`  PRIMARY KEY (${pkColumns})`);
      }

      sqlExport += columnDefs.join(',\n');
      sqlExport += '\n);\n\n';

      // Get table data
      const dataResult = await query(`SELECT * FROM "${tableName}" LIMIT 1000;`);
      
      if (dataResult && dataResult.rows.length > 0) {
        sqlExport += `-- Data for table: ${tableName}\n`;
        
        dataResult.rows.forEach((row: any) => {
          const columns = Object.keys(row).map(key => `"${key}"`).join(', ');
          const values = Object.values(row).map((value: any) => {
            if (value === null) return 'NULL';
            if (typeof value === 'string') return `'${value.replace(/'/g, "''")}'`;
            if (typeof value === 'object' && value instanceof Date) return `'${value.toISOString()}'`;
            return value;
          }).join(', ');
          
          sqlExport += `INSERT INTO "${tableName}" (${columns}) VALUES (${values});\n`;
        });
        sqlExport += '\n';
      }
    }

    // Return the SQL as a downloadable file
    const response = new NextResponse(sqlExport);
    response.headers.set('Content-Type', 'application/sql');
    response.headers.set('Content-Disposition', `attachment; filename="database_export_${new Date().toISOString().split('T')[0]}.sql"`);
    
    return response;
  } catch (error) {
    console.error('Error exporting database:', error);
    return NextResponse.json(
      { error: 'Failed to export database' },
      { status: 500 }
    );
  }
}

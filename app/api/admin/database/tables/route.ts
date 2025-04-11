import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

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

// GET endpoint to list tables with their stats
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
    
    // Query to get all table names from the database
    const tablesQuery = `
      SELECT 
        table_name as name
      FROM 
        information_schema.tables 
      WHERE 
        table_schema = 'public' 
        AND table_type = 'BASE TABLE'
      ORDER BY 
        table_name;
    `;
    
    const tablesResult = await query(tablesQuery);
    
    // If no tables found, return empty array
    if (!tablesResult || tablesResult.rows.length === 0) {
      return NextResponse.json([]);
    }
    
    // For each table, get row count and size
    const tables = [];
    for (const tableRow of tablesResult.rows) {
      const tableName = tableRow.name;
      
      // Query row count
      const rowCountQuery = `SELECT COUNT(*) as count FROM "${tableName}"`;
      const rowCountResult = await query(rowCountQuery);
      const rowCount = parseInt(rowCountResult.rows[0].count);
      
      // Query table size
      const sizeQuery = `
        SELECT 
          pg_total_relation_size('"${tableName}"') as size
      `;
      const sizeResult = await query(sizeQuery);
      const sizeInBytes = parseInt(sizeResult.rows[0].size);
      const sizeInMb = sizeInBytes / (1024 * 1024);
      
      tables.push({
        name: tableName,
        rowCount,
        sizeInMb
      });
    }
    
    return NextResponse.json(tables);
  } catch (error) {
    console.error('Error fetching database tables:', error);
    return NextResponse.json(
      { error: 'Failed to fetch database tables' },
      { status: 500 }
    );
  }
}

// DELETE endpoint to drop a specific table
export async function DELETE(request: Request) {
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
    
    // Get table name from the URL
    const urlParts = request.url.split('/');
    const tableName = urlParts[urlParts.length - 1];
    
    if (!tableName) {
      return NextResponse.json(
        { error: 'Table name is required' },
        { status: 400 }
      );
    }
    
    // Verify that the table exists
    const tableCheckQuery = `
      SELECT 1 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = $1
    `;
    
    const tableCheckResult = await query(tableCheckQuery, [tableName]);
    
    if (!tableCheckResult || tableCheckResult.rows.length === 0) {
      return NextResponse.json(
        { error: `Table "${tableName}" does not exist` },
        { status: 404 }
      );
    }
    
    // Drop the table
    await query(`DROP TABLE IF EXISTS "${tableName}" CASCADE`);
    
    return NextResponse.json(
      { message: `Table "${tableName}" dropped successfully` }
    );
  } catch (error) {
    console.error(`Error dropping table:`, error);
    return NextResponse.json(
      { error: 'Failed to drop table' },
      { status: 500 }
    );
  }
}

mimport { NextResponse } from 'next/server';
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

// POST endpoint for executing SQL queries
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
    
    // Parse the request body
    const body = await request.json();
    
    if (!body.query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }
    
    // Some basic safety checks for potentially dangerous queries
    const sqlQuery = body.query;
    const isReadOnly = isReadOnlyQuery(sqlQuery);
    
    // Optional: Restrict certain types of operations for safety
    // This is a simple implementation; a more robust system would use proper SQL parsing
    if (!isReadOnly) {
      // Check for dangerous operations
      if (
        sqlQuery.toLowerCase().includes('drop database') ||
        sqlQuery.toLowerCase().includes('truncate schema') ||
        sqlQuery.toLowerCase().includes('drop schema public')
      ) {
        return NextResponse.json(
          { 
            error: 'This operation is not allowed for safety reasons' 
          },
          { status: 403 }
        );
      }
    }
    
    // Execute the query
    const result = await query(sqlQuery);
    
    // Return the query result
    return NextResponse.json({
      rows: result.rows,
      rowCount: result.rowCount,
      command: result.command,
    });
  } catch (error: any) {
    console.error('Error executing SQL query:', error);
    
    // Return a properly formatted error response
    return NextResponse.json(
      { 
        error: error.message || 'Failed to execute SQL query',
        detail: error.detail,
        hint: error.hint,
        code: error.code
      },
      { status: 500 }
    );
  }
}

// Helper function to determine if a query is read-only
function isReadOnlyQuery(sql: string): boolean {
  // Convert to lowercase for case-insensitive matching
  const sqlLower = sql.toLowerCase().trim();
  
  // Check if query starts with SELECT, EXPLAIN, or SHOW
  return (
    sqlLower.startsWith('select') ||
    sqlLower.startsWith('explain') ||
    sqlLower.startsWith('show')
  );
}

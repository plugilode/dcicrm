import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: Request) {
  try {
    // Get the auth token from cookies using headers
    const cookieHeader = request.headers.get('cookie') || '';
    const cookies = Object.fromEntries(
      cookieHeader.split('; ').map(cookie => {
        const [name, value] = cookie.split('=');
        return [name, value];
      })
    );
    
    const authToken = cookies['auth_token'];

    if (!authToken) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Verify the user is an admin
    const adminCheckResult = await query(
      'SELECT role FROM users WHERE id = $1 AND is_active = true',
      [authToken]
    );

    if (!adminCheckResult || adminCheckResult.rows.length === 0 || adminCheckResult.rows[0].role !== 'admin') {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    // Get total user count
    const totalUsersResult = await query(
      'SELECT COUNT(*) as count FROM users'
    );
    
    // Get active user count
    const activeUsersResult = await query(
      'SELECT COUNT(*) as count FROM users WHERE is_active = true'
    );
    
    // Get pending requests count
    const pendingRequestsResult = await query(
      'SELECT COUNT(*) as count FROM access_requests WHERE status = $1',
      ['pending']
    );
    
    // Get database size (this is a simplified simulation)
    // In a real environment, you would use a more accurate method to get DB size
    const dbSizeResult = await query(
      `SELECT pg_database_size(current_database()) as size`
    );
    
    const dbSizeBytes = dbSizeResult.rows[0].size;
    const dbSizeMb = Math.round(dbSizeBytes / (1024 * 1024));
    
    return NextResponse.json({
      totalUsers: parseInt(totalUsersResult.rows[0].count),
      activeUsers: parseInt(activeUsersResult.rows[0].count),
      pendingRequests: parseInt(pendingRequestsResult.rows[0].count),
      dbSize: `${dbSizeMb} MB`
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin stats' },
      { status: 500 }
    );
  }
}

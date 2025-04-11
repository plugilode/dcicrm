import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { cookies } from 'next/headers';

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
        { isAdmin: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Query the database to check if the user is an admin
    const result = await query(
      'SELECT role FROM users WHERE id = $1 AND is_active = true',
      [authToken]
    );

    if (!result || result.rows.length === 0) {
      return NextResponse.json(
        { isAdmin: false, error: 'User not found' },
        { status: 404 }
      );
    }

    const user = result.rows[0];
    const isAdmin = user.role === 'admin';

    if (!isAdmin) {
      return NextResponse.json(
        { isAdmin: false, error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    return NextResponse.json({ isAdmin: true });
  } catch (error) {
    console.error('Admin auth error:', error);
    return NextResponse.json(
      { isAdmin: false, error: 'Server error' },
      { status: 500 }
    );
  }
}

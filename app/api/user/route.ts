import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { query } from '@/config.js';

export async function GET(req: Request) {
  try {
    // Use await with cookies() since it returns a promise
    const authToken = (await cookies()).get('auth_token');

    if (!authToken) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Get user data
    const userResult = await query(
      'SELECT id, email, first_name, last_name, role FROM users WHERE id = $1 AND is_active = true',
      [authToken.value]
    );

    if (!userResult.rows.length) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const user = userResult.rows[0];

    // Get user statistics
    const statsResult = await query(`
      SELECT 
        (SELECT COUNT(*) FROM companies) as companies,
        (SELECT COUNT(*) FROM company_contacts) as contacts
    `);

    const stats = statsResult.rows[0];

    // Fetch additional stats before returning
    const dealsResult = await query(`
      SELECT COUNT(*) AS count FROM deals WHERE status = 'active'
    `);
    const meetingsResult = await query(`
      SELECT COUNT(*) AS count FROM meetings WHERE date > NOW()
    `);

    return NextResponse.json({
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      role: user.role,
      stats: {
        companies: parseInt(stats.companies) || 0,
        contacts: parseInt(stats.contacts) || 0,
        activeDeals: dealsResult.rows[0].count || 0,
        upcomingMeetings: meetingsResult.rows[0].count || 0
      }
    });

  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user data' },
      { status: 500 }
    );
  }
}

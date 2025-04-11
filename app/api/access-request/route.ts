import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { email, firstName, lastName, organization, message } = await req.json();

    // Check if request already exists
    const existingRequest = await pool.query(
      'SELECT * FROM access_requests WHERE email = $1 AND status = $2',
      [email, 'pending']
    );

    if (existingRequest.rows.length > 0) {
      return NextResponse.json(
        { error: 'A pending request already exists for this email' },
        { status: 400 }
      );
    }

    // Insert new request
    await pool.query(
      `INSERT INTO access_requests (email, first_name, last_name, organization, message)
       VALUES ($1, $2, $3, $4, $5)`,
      [email, firstName, lastName, organization, message]
    );

    // Send notification to admin (you can implement email notification here)

    return NextResponse.json({ message: 'Request submitted successfully' });
  } catch (error) {
    console.error('Access request error:', error);
    return NextResponse.json(
      { error: 'Failed to submit request' },
      { status: 500 }
    );
  }
}
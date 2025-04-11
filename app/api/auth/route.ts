import { NextResponse } from 'next/server';
import { query } from '@/config.js';
import bcrypt from 'bcrypt';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const result = await query(
      'SELECT * FROM users WHERE email = $1 AND is_active = true',
      [email]
    ).catch((err: Error) => {
      console.error('Database query error:', err);
      throw new Error('Database connection failed');
    });

    if (!result || result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const user = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Update last login timestamp
    await query(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
      [user.id]
    ).catch((err: Error) => {
      console.error('Failed to update last login:', err);
      // Non-critical error, don't throw
    });

    // Don't send sensitive information back to the client
    const { password_hash, ...userWithoutPassword } = user;

    // Create the response with the auth token cookie
    const response = NextResponse.json({
      user: userWithoutPassword,
      message: 'Login successful'
    });

    // Set HttpOnly cookie for security
    response.cookies.set({
      name: 'auth_token',
      value: user.id,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });

    return response;
  } catch (error: any) {
    console.error('Authentication error:', error);
    return NextResponse.json(
      { error: error.message || 'Authentication failed' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const cookieStore = cookies();
  cookieStore.delete('auth_token');
  
  return NextResponse.json(
    { message: "Logged out successfully" },
    { status: 200 }
  );
}
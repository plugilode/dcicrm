import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { currentPassword, newPassword } = await req.json()

    // Verify current password
    const user = await query(
      'SELECT * FROM users WHERE id = $1 AND password_hash = crypt($2, password_hash)',
      [session.user.id, currentPassword]
    )

    if (!user.rows.length) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 })
    }

    // Update password
    await query(
      'UPDATE users SET password_hash = crypt($1, gen_salt(\'bf\')) WHERE id = $2',
      [newPassword, session.user.id]
    )

    return NextResponse.json({ message: 'Password updated successfully' })
  } catch (error) {
    console.error('Password change error:', error)
    return NextResponse.json({ error: 'Failed to change password' }, { status: 500 })
  }
}

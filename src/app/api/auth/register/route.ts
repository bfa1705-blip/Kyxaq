import { NextResponse } from 'next/server';
import { readDB, writeDB, getNextId } from '@/lib/db';
import { createToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password required' }, { status: 400 });
    }

    const db = readDB();
    
    if (db.users.find(u => u.username === username)) {
      return NextResponse.json({ error: 'Username already exists' }, { status: 400 });
    }

    const newUser = {
      id: getNextId(db.users),
      username,
      password // In a real app, hash the password!
    };

    db.users.push(newUser);
    writeDB(db);

    const token = await createToken({ id: newUser.id, username: newUser.username });
    
    const cookieStore = await cookies();
    cookieStore.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

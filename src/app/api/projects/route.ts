import { NextResponse } from 'next/server';
import { readDB, writeDB, getNextId } from '@/lib/db';
import { getUser } from '@/lib/auth';

export async function GET() {
  const user = await getUser() as any;
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = readDB();
  const project = db.projects.find(p => p.user_id === user.id);
  return NextResponse.json({ project });
}

export async function POST(req: Request) {
  const user = await getUser() as any;
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { name } = await req.json();
  if (!name) return NextResponse.json({ error: 'Project name required' }, { status: 400 });

  try {
    const db = readDB();
    
    if (db.projects.find(p => p.user_id === user.id)) {
      return NextResponse.json({ error: 'You already have a project' }, { status: 400 });
    }

    const newProject = {
      id: getNextId(db.projects),
      name,
      user_id: user.id
    };

    db.projects.push(newProject);
    writeDB(db);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

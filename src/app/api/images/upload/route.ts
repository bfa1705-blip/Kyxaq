import { NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';
import { getUser } from '@/lib/auth';
import axios from 'axios';

export async function POST(req: Request) {
  const user = await getUser() as any;
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = readDB();
  const project = db.projects.find(p => p.user_id === user.id);
  if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 });

  const formData = await req.formData();
  const file = formData.get('file') as File;
  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

  const apiKey = process.env.FIVEMANAGE_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'FiveManage API Key missing in .env' }, { status: 500 });
  }

  try {
    const apiFormData = new FormData();
    apiFormData.append('file', file);
    
    const response = await axios.post('https://api.fivemanage.com/api/v3/file', apiFormData, {
      headers: {
        'Authorization': apiKey,
      }
    });

    if (response.data.status === 'ok') {
      const { id, url } = response.data.data;
      
      db.images.unshift({
        id,
        url,
        project_id: project.id,
        filename: file.name,
        created_at: new Date().toISOString()
      });
      writeDB(db);
      
      return NextResponse.json({ success: true, url });
    }

    return NextResponse.json({ error: 'Failed to upload to FiveManage' }, { status: 500 });
  } catch (error: any) {
    console.error('Upload error:', error.response?.data || error.message);
    return NextResponse.json({ error: 'Internal server error during upload' }, { status: 500 });
  }
}

export async function GET() {
  const user = await getUser() as any;
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = readDB();
  const project = db.projects.find(p => p.user_id === user.id);
  if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 });

  const images = db.images.filter(img => img.project_id === project.id);
  return NextResponse.json({ images });
}

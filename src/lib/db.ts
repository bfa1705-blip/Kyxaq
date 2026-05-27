import fs from 'fs';
import path from 'path';

const DB_PATH = path.resolve(process.cwd(), 'database.json');

interface User {
  id: number;
  username: string;
  password: string;
}

interface Project {
  id: number;
  name: string;
  user_id: number;
}

interface Image {
  id: string;
  url: string;
  project_id: number;
  filename: string;
  created_at: string;
}

interface DB {
  users: User[];
  projects: Project[];
  images: Image[];
}

const initialData: DB = {
  users: [],
  projects: [],
  images: [],
};

export function readDB(): DB {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2));
    return initialData;
  }
  const data = fs.readFileSync(DB_PATH, 'utf-8');
  try {
    return JSON.parse(data);
  } catch (e) {
    return initialData;
  }
}

export function writeDB(data: DB) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// Helper to get next ID
export function getNextId(collection: { id: number }[]): number {
  return collection.length > 0 ? Math.max(...collection.map(i => i.id)) + 1 : 1;
}

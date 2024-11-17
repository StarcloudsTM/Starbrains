import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

// Use `const` instead of `let` because `repos` is not reassigned
const repos: {
  id: string;
  name: string;
  description: string;
  isPublic: boolean;
  files: string[];
  createdAt: string;
}[] = []; // Replace `any` with a defined type

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const isPublic = formData.get('isPublic') === 'true';
  const files = formData.getAll('files') as File[];

  if (!name) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  }

  const id = Date.now().toString();
  const uploadDir = path.join(process.cwd(), 'uploads', id);

  try {
    await Promise.all(
      files.map(async (file) => {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filePath = path.join(uploadDir, file.name);
        await writeFile(filePath, buffer);
      })
    );

    const newRepo = {
      id,
      name,
      description,
      isPublic,
      files: files.map((file) => file.name),
      createdAt: new Date().toISOString(),
    };

    repos.push(newRepo);

    return NextResponse.json(newRepo, { status: 201 });
  } catch (error) {
    console.error('Error creating repository:', error);
    return NextResponse.json({ error: 'Failed to create repository' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json(repos);
}

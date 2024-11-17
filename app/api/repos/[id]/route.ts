import { NextRequest, NextResponse } from 'next/server';

// Use a more specific type for repos
interface Repo {
  id: string;
  name: string;
  description: string;
  // Add other relevant fields
}

const repos: Repo[] = []; // Initialize with some data if needed

export async function GET(
  _: NextRequest, // Use underscore to indicate unused parameter
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const repo = repos.find((r) => r.id === id);

  if (!repo) {
    return NextResponse.json({ error: 'Repository not found' }, { status: 404 });
  }

  return NextResponse.json(repo);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newRepo: Repo = {
      id: Date.now().toString(), // Generate a unique ID
      name: body.name,
      description: body.description,
      // Add other fields as necessary
    };

    repos.push(newRepo);

    return NextResponse.json(newRepo, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
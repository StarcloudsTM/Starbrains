import { NextRequest, NextResponse } from 'next/server';

// Use `const` instead of `let` since `repos` is not reassigned.
const repos: { id: string; [key: string]: unknown }[] = []; // Replace `any` with a specific type

export async function GET(
  _: NextRequest, // Rename `req` to `_` to indicate it's unused
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const repo = repos.find((r) => r.id === id);

  if (!repo) {
    return NextResponse.json({ error: 'Repository not found' }, { status: 404 });
  }

  return NextResponse.json(repo);
}

// Keep the existing POST method here
export async function POST(req: NextRequest) {
  // Add your POST logic here
}

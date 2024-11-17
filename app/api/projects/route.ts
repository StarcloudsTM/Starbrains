import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import clientPromise from '@/lib/mongodb';


export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("starbrains");
    const projects = await db.collection("projects").find({}).toArray();
    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { message: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, description, url } = await req.json();

    if (!name || !description || !url) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("starbrains");

    // Check if a project with the same name already exists
    const existingProject = await db.collection("projects").findOne({ name });
    if (existingProject) {
      return NextResponse.json(
        { message: "A project with this name already exists" },
        { status: 400 }
      );
    }

    const userProjects = await db.collection("projects").find({ userId }).toArray();
    if (userProjects.length >= 5) {
      return NextResponse.json(
        { message: "Maximum number of projects reached" },
        { status: 400 }
      );
    }

    const newProject = {
      name,
      description,
      url,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("projects").insertOne(newProject);
    const insertedProject = { ...newProject, _id: result.insertedId };

    return NextResponse.json(insertedProject, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { message: "Failed to create project" },
      { status: 500 }
    );
  }
}
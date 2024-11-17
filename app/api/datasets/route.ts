import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import clientPromise from '@/lib/mongodb';
import { storage } from '@/lib/firebase';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("starbrains");
    const datasets = await db.collection("datasets").find({}).toArray();
    return NextResponse.json(datasets);
  } catch (error) {
    console.error("Error fetching datasets:", error);
    return NextResponse.json(
      { message: "Failed to fetch datasets" },
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
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const file = formData.get("file") as File;

    if (!name || !description || !file) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json({ message: "File size exceeds 50MB limit" }, { status: 400 });
    }

    if (!file.name.endsWith(".csv")) {
      return NextResponse.json({ message: "Only CSV files are allowed" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("starbrains");

    // Check if a dataset with the same name already exists
    const existingDataset = await db.collection("datasets").findOne({ name });
    if (existingDataset) {
      return NextResponse.json(
        { message: "A dataset with this name already exists" },
        { status: 400 }
      );
    }

    const userDatasets = await db.collection("datasets").find({ userId }).toArray();
    if (userDatasets.length >= 3) {
      return NextResponse.json(
        { message: "Maximum number of datasets reached" },
        { status: 400 }
      );
    }

    // Upload file to Firebase Storage
    const bucket = storage.bucket();
    const fileBuffer = await file.arrayBuffer();
    const fileRef = bucket.file(`datasets/${userId}/${file.name}`);

    await fileRef.save(Buffer.from(fileBuffer), {
      metadata: {
        contentType: file.type,
      },
    });

    const [url] = await fileRef.getSignedUrl({
      action: "read",
      expires: "03-01-2500", // Set a far future expiration date
    });

    const newDataset = {
      name,
      description,
      url,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("datasets").insertOne(newDataset);
    const insertedDataset = { ...newDataset, _id: result.insertedId };

    return NextResponse.json(insertedDataset, { status: 201 });
  } catch (error) {
    console.error("Error creating dataset:", error);
    return NextResponse.json(
      { message: "Failed to create dataset" },
      { status: 500 }
    );
  }
}
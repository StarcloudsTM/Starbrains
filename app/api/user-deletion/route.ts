import {  NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import clientPromise from '@/lib/mongodb';

export async function POST() { // Removed 'req' parameter
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const client = await clientPromise;
    const db = client.db('starbrains');

    // Mark the user as deleted
    await db.collection('users').updateOne(
      { userId: userId },
      { $set: { deletedAt: new Date() } },
      { upsert: true }
    );

    // Schedule data deletion after 3 days
    setTimeout(async () => {
      try {
        await db.collection('datasets').deleteMany({ userId });
        await db.collection('projects').deleteMany({ userId });
        await db.collection('users').deleteOne({ userId: userId });
        console.log(`User ${userId} data deleted successfully after 3 days.`);
      } catch (error) {
        console.error(`Error deleting user ${userId} data:`, error);
      }
    }, 3 * 24 * 60 * 60 * 1000); // 3 days in milliseconds

    return NextResponse.json({ message: 'Account marked for deletion. Data will be removed in 3 days.' });
  } catch (error) {
    console.error('Error marking account for deletion:', error);
    return NextResponse.json({ message: 'Failed to process account deletion' }, { status: 500 });
  }
}

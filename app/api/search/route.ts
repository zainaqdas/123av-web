import { NextResponse } from 'next/server';
import { searchVideos } from '@/lib/api';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  if (!q) {
    return NextResponse.json(
      { status: 400, error: 'Missing query parameter "q"' },
      { status: 400 }
    );
  }

  try {
    const result = await searchVideos(q);
    return NextResponse.json({ status: 200, result });
  } catch (error) {
    return NextResponse.json(
      { status: 500, error: 'Search failed' },
      { status: 500 }
    );
  }
}

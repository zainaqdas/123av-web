import { NextResponse } from 'next/server';
import { getGenres } from '@/lib/api';

export async function GET() {
  try {
    const genres = await getGenres();
    return NextResponse.json({ status: 200, result: genres });
  } catch {
    return NextResponse.json({ status: 500, error: 'Failed to fetch genres' }, { status: 500 });
  }
}

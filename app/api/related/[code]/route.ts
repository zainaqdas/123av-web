import { NextResponse } from 'next/server';
import { getRelatedVideos } from '@/lib/api';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  try {
    const related = await getRelatedVideos(code);
    return NextResponse.json({ status: 200, result: related });
  } catch {
    return NextResponse.json({ status: 500, error: 'Failed to fetch related' }, { status: 500 });
  }
}

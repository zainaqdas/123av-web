import { NextResponse } from 'next/server';
import { getVideo } from '@/lib/api';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  try {
    const video = await getVideo(code);
    return NextResponse.json({ status: 200, result: video });
  } catch {
    return NextResponse.json({ status: 404, error: 'Video not found' }, { status: 404 });
  }
}

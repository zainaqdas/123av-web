import { NextResponse } from 'next/server';
import { browseSection, browseGenre } from '@/lib/api';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const section = searchParams.get('section');
  const page = parseInt(searchParams.get('page') || '1', 10);

  try {
    let result;
    if (section && !['new', 'trending', 'recent', 'uncensored', 'featured'].includes(section)) {
      result = await browseGenre(section, page);
    } else {
      result = await browseSection(section, page);
    }
    return NextResponse.json({ status: 200, result });
  } catch (error) {
    return NextResponse.json(
      { status: 500, error: 'Failed to fetch browse results' },
      { status: 500 }
    );
  }
}

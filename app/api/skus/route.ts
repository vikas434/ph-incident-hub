import { NextResponse } from 'next/server';
import { realSKUs } from '@/lib/realData';

export async function GET() {
  try {
    return NextResponse.json({ skus: realSKUs });
  } catch (error) {
    console.error('Error fetching SKUs:', error);
    return NextResponse.json({ error: 'Failed to load SKUs' }, { status: 500 });
  }
}


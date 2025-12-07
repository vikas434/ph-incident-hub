import { NextResponse } from 'next/server';
import { getSKUByProductID } from '@/lib/realData';

export async function GET(
  request: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const sku = getSKUByProductID(params.productId);
    if (!sku) {
      return NextResponse.json({ error: 'SKU not found' }, { status: 404 });
    }
    return NextResponse.json({ sku });
  } catch (error) {
    console.error('Error fetching SKU:', error);
    return NextResponse.json({ error: 'Failed to load SKU' }, { status: 500 });
  }
}


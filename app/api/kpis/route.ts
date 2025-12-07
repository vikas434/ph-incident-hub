import { NextResponse } from 'next/server';
import { aggregateKPIs } from '@/lib/realData';

export async function GET() {
  try {
    return NextResponse.json({ kpis: aggregateKPIs });
  } catch (error) {
    console.error('Error fetching KPIs:', error);
    return NextResponse.json({ error: 'Failed to load KPIs' }, { status: 500 });
  }
}


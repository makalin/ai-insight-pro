import { NextRequest, NextResponse } from 'next/server';
import { generateReport } from '@/lib/pdf';
import { AnalysisResult } from '@/lib/analysis';
import { MetadataResult } from '@/lib/metadata';

export const runtime = 'nodejs';
export const maxDuration = 30;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { analysisResult, metadata, hashes, fileName } = body as {
      analysisResult: AnalysisResult;
      metadata: MetadataResult;
      hashes?: any;
      fileName?: string;
    };

    if (!analysisResult || !metadata) {
      return NextResponse.json(
        { error: 'Missing analysisResult or metadata' },
        { status: 400 }
      );
    }

    // Generate PDF report
    const pdfBytes = await generateReport(analysisResult, metadata, undefined, hashes, fileName);

    // Return PDF as response
    return new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="ai-insight-report-${Date.now()}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Report generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate report', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}


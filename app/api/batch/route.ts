import { NextRequest, NextResponse } from 'next/server';
import { analyzeImage } from '@/lib/analysis';
import { extractMetadata } from '@/lib/metadata';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }

    if (files.length > 10) {
      return NextResponse.json(
        { error: 'Maximum 10 files allowed per batch' },
        { status: 400 }
      );
    }

    // Validate all files
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { error: `Invalid file type: ${file.name}. Allowed: JPEG, PNG, WEBP, HEIC` },
          { status: 400 }
        );
      }
      if (file.size > maxSize) {
        return NextResponse.json(
          { error: `File too large: ${file.name}. Maximum 10MB` },
          { status: 400 }
        );
      }
    }

    // Process all files in parallel
    const results = await Promise.all(
      files.map(async (file) => {
        try {
          const [analysisResult, metadata] = await Promise.all([
            analyzeImage(file),
            extractMetadata(file),
          ]);

          return {
            fileName: file.name,
            fileSize: file.size,
            success: true,
            analysis: analysisResult,
            metadata,
          };
        } catch (error) {
          return {
            fileName: file.name,
            fileSize: file.size,
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
          };
        }
      })
    );

    return NextResponse.json(
      {
        total: files.length,
        successful: results.filter((r) => r.success).length,
        failed: results.filter((r) => !r.success).length,
        results,
      },
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Batch processing error:', error);
    return NextResponse.json(
      { error: 'Failed to process batch', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}


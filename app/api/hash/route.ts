import { NextRequest, NextResponse } from 'next/server';
import CryptoJS from 'crypto-js';

export const runtime = 'nodejs';
export const maxDuration = 30;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed: JPEG, PNG, WEBP, HEIC' },
        { status: 400 }
      );
    }

    // Read file as buffer
    const arrayBuffer = await file.arrayBuffer();
    const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);

    // Calculate MD5 and SHA256 (perceptual hash requires browser APIs)
    const md5 = CryptoJS.MD5(wordArray).toString(CryptoJS.enc.Hex);
    const sha256 = CryptoJS.SHA256(wordArray).toString(CryptoJS.enc.Hex);

    return NextResponse.json(
      {
        md5,
        sha256,
        // Perceptual hash must be calculated client-side
      },
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Hash calculation error:', error);
    return NextResponse.json(
      { error: 'Failed to calculate hashes', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}


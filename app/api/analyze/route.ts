import { NextRequest, NextResponse } from 'next/server';
import { analyzeImage } from '@/lib/analysis';
import { analyzeImageWithSightengine } from '@/lib/sightengine-integration';

export const runtime = 'nodejs';
export const maxDuration = 30;

interface ApiSettings {
  apiProvider?: 'mock' | 'sightengine' | 'huggingface' | 'hiveai';
  sightengineApiUser?: string;
  sightengineApiSecret?: string;
  huggingfaceApiKey?: string;
  huggingfaceModel?: string;
  hiveaiApiKey?: string;
}

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

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit' },
        { status: 400 }
      );
    }

    // Get API settings from form data or use defaults
    let apiSettings: ApiSettings = {
      apiProvider: 'mock',
    };

    try {
      const settingsStr = formData.get('settings') as string | null;
      if (settingsStr) {
        apiSettings = JSON.parse(settingsStr) as ApiSettings;
      }
    } catch (error) {
      // If no settings, use default mock
      console.log('No API settings provided, using mock');
    }

    // Analyze the image based on API provider
    let result;

    if (apiSettings.apiProvider === 'sightengine') {
      const apiUser = apiSettings.sightengineApiUser || process.env.SIGHTENGINE_API_USER;
      const apiSecret = apiSettings.sightengineApiSecret || process.env.SIGHTENGINE_API_SECRET;

      if (apiUser && apiSecret) {
        try {
          result = await analyzeImageWithSightengine(file, apiUser, apiSecret);
        } catch (error) {
          console.error('Sightengine API error:', error);
          // Fallback to mock on error
          result = await analyzeImage(file);
        }
      } else {
        // Fallback to mock if credentials not provided
        result = await analyzeImage(file);
      }
    } else {
      // Use mock analysis (default)
      result = await analyzeImage(file);
    }

    return NextResponse.json(result, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze image', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}


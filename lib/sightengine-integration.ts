/**
 * Sightengine API Integration
 * 
 * To use real AI detection, integrate with Sightengine:
 * 1. Sign up at https://sightengine.com
 * 2. Get your API credentials
 * 3. Set environment variables: SIGHTENGINE_API_USER and SIGHTENGINE_API_SECRET
 * 4. Uncomment and use the function below
 */

import { AnalysisResult } from './analysis';

/**
 * Analyze image using Sightengine API
 * This provides real AI detection including Wan model detection
 */
export async function analyzeImageWithSightengine(
  file: File,
  apiUser: string,
  apiSecret: string
): Promise<AnalysisResult> {
  // Convert File to Buffer for Node.js environment
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  
  const formData = new FormData();
  const blob = new Blob([buffer], { type: file.type });
  formData.append('media', blob, file.name);

  try {
    // Sightengine API with query parameters
    const apiUrl = new URL('https://api.sightengine.com/1.0/check.json');
    apiUrl.searchParams.append('api_user', apiUser);
    apiUrl.searchParams.append('api_secret', apiSecret);
    apiUrl.searchParams.append('models', 'genai,deepfake,face-attributes');

    const response = await fetch(apiUrl.toString(), {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Sightengine API error: ${response.statusText}`);
    }

    const data = await response.json();

    // Transform Sightengine response to our AnalysisResult format
    return transformSightengineResponse(data);
  } catch (error) {
    console.error('Sightengine API error:', error);
    throw error;
  }
}

/**
 * Transform Sightengine API response to AnalysisResult format
 */
function transformSightengineResponse(data: any): AnalysisResult {
  const result: AnalysisResult = {
    overall: 0,
    categories: {
      genai: 0,
      faceManipulation: 0,
      bodyManipulation: 0,
      deepfake: 0,
      inpainting: 0,
      styleTransfer: 0,
    },
    diffusion: {},
    gan: {},
    llm: {},
    manipulation: {},
    other: {},
  };

  // Extract GenAI score
  if (data.genai) {
    result.categories.genai = Math.round(data.genai.score * 100);
    result.overall = result.categories.genai;

    // Extract diffusion models
    if (data.genai.diffusion) {
      // Wan model
      if (data.genai.diffusion.wan !== undefined) {
        result.diffusion['Wan'] = Math.round(data.genai.diffusion.wan * 100);
      }
      // Other diffusion models
      if (data.genai.diffusion.stable_diffusion !== undefined) {
        result.diffusion['Stable Diffusion'] = Math.round(
          data.genai.diffusion.stable_diffusion * 100
        );
      }
      if (data.genai.diffusion.midjourney !== undefined) {
        result.diffusion['MidJourney'] = Math.round(
          data.genai.diffusion.midjourney * 100
        );
      }
      if (data.genai.diffusion.dall_e !== undefined) {
        result.diffusion['DALL-E'] = Math.round(
          data.genai.diffusion.dall_e * 100
        );
      }
      if (data.genai.diffusion.flux !== undefined) {
        result.diffusion['Flux'] = Math.round(
          data.genai.diffusion.flux * 100
        );
      }
      if (data.genai.diffusion.firefly !== undefined) {
        result.diffusion['Firefly'] = Math.round(
          data.genai.diffusion.firefly * 100
        );
      }
      if (data.genai.diffusion.imagen !== undefined) {
        result.diffusion['Imagen'] = Math.round(
          data.genai.diffusion.imagen * 100
        );
      }
      if (data.genai.diffusion.reve !== undefined) {
        result.diffusion['Reve'] = Math.round(
          data.genai.diffusion.reve * 100
        );
      }
      if (data.genai.diffusion.qwen !== undefined) {
        result.diffusion['Qwen'] = Math.round(
          data.genai.diffusion.qwen * 100
        );
      }
      if (data.genai.diffusion.ideogram !== undefined) {
        result.diffusion['Ideogram'] = Math.round(
          data.genai.diffusion.ideogram * 100
        );
      }
      if (data.genai.diffusion.recraft !== undefined) {
        result.diffusion['Recraft'] = Math.round(
          data.genai.diffusion.recraft * 100
        );
      }
    }

    // Extract GAN models
    if (data.genai.gan) {
      if (data.genai.gan.stylegan !== undefined) {
        result.gan['StyleGAN'] = Math.round(data.genai.gan.stylegan * 100);
      }
    }
  }

  // Extract deepfake/face manipulation
  if (data.deepfake) {
    result.categories.deepfake = Math.round(data.deepfake.score * 100);
    result.categories.faceManipulation = result.categories.deepfake;
    result.manipulation['Deepfake'] = result.categories.deepfake;
  }

  // Extract face manipulation
  if (data.face_attributes) {
    if (data.face_attributes.manipulation !== undefined) {
      const manipulationScore = Math.round(
        data.face_attributes.manipulation * 100
      );
      result.categories.faceManipulation = Math.max(
        result.categories.faceManipulation,
        manipulationScore
      );
    }
  }

  // Update overall score
  result.overall = Math.max(
    result.categories.genai,
    result.categories.faceManipulation,
    result.categories.deepfake
  );

  return result;
}

/**
 * Example usage in API route:
 * 
 * import { analyzeImageWithSightengine } from '@/lib/sightengine-integration';
 * 
 * const result = await analyzeImageWithSightengine(
 *   file,
 *   process.env.SIGHTENGINE_API_USER!,
 *   process.env.SIGHTENGINE_API_SECRET!
 * );
 */


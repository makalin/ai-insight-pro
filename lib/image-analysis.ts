/**
 * Analyze image characteristics to help determine AI generation likelihood
 * This is a simplified heuristic - in production, use actual ML models
 */

export interface ImageCharacteristics {
  hasFaces: boolean;
  hasText: boolean;
  colorComplexity: number;
  edgeDensity: number;
  compressionLevel: number;
  width?: number;
  height?: number;
}

export async function analyzeImageCharacteristics(
  file: File
): Promise<ImageCharacteristics> {
  // Check if we're in a browser environment
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    // Server-side: return default values
    return {
      hasFaces: false,
      hasText: false,
      colorComplexity: 0.5,
      edgeDensity: 0.5,
      compressionLevel: 0.5,
      width: 1920,
      height: 1080,
    };
  }

  return new Promise((resolve, reject) => {
    try {
      const img = new Image();
      img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve({
          hasFaces: false,
          hasText: false,
          colorComplexity: 0.5,
          edgeDensity: 0.5,
          compressionLevel: 0.5,
        });
        return;
      }

      canvas.width = Math.min(img.width, 200);
      canvas.height = Math.min(img.height, 200);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;

      // Calculate color complexity (variance in colors)
      const colors = new Set<string>();
      let edgeCount = 0;
      let totalPixels = 0;

      for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        const color = `${r},${g},${b}`;
        colors.add(color);
        totalPixels++;

        // Simple edge detection (check if neighboring pixels differ significantly)
        if (i > 0 && i < pixels.length - 4) {
          const prevR = pixels[i - 4];
          const prevG = pixels[i - 3];
          const prevB = pixels[i - 2];
          const diff =
            Math.abs(r - prevR) + Math.abs(g - prevG) + Math.abs(b - prevB);
          if (diff > 30) {
            edgeCount++;
          }
        }
      }

      const colorComplexity = colors.size / totalPixels;
      const edgeDensity = edgeCount / totalPixels;
      const compressionLevel = file.size / (img.width * img.height);

      // Simple face detection heuristic (check for skin-tone like colors)
      let skinTonePixels = 0;
      for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        // Skin tone range heuristic
        if (r > 95 && r < 240 && g > 40 && g < 210 && b > 20 && b < 200) {
          if (r > g && g > b && r - b > 15) {
            skinTonePixels++;
          }
        }
      }

      const hasFaces = skinTonePixels / totalPixels > 0.1;

      resolve({
        hasFaces,
        hasText: false, // Would need OCR for real text detection
        colorComplexity: Math.min(1, colorComplexity),
        edgeDensity: Math.min(1, edgeDensity),
        compressionLevel: Math.min(1, compressionLevel),
        width: img.width,
        height: img.height,
      });
    };
      img.onerror = () => {
        resolve({
          hasFaces: false,
          hasText: false,
          colorComplexity: 0.5,
          edgeDensity: 0.5,
          compressionLevel: 0.5,
          width: 1920,
          height: 1080,
        });
      };
      img.src = URL.createObjectURL(file);
    } catch (error) {
      reject(error);
    }
  });
}


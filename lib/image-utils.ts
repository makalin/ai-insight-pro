export interface ImageStats {
  width: number;
  height: number;
  aspectRatio: number;
  fileSize: number;
  format: string;
  colorDepth?: number;
  dominantColors?: string[];
}

/**
 * Get image statistics
 */
export async function getImageStats(file: File): Promise<ImageStats> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const stats: ImageStats = {
        width: img.width,
        height: img.height,
        aspectRatio: img.width / img.height,
        fileSize: file.size,
        format: file.type,
      };

      // Get color depth from canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        stats.colorDepth = imageData.data.length / (img.width * img.height);
      }

      resolve(stats);
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Optimize image before upload (resize if too large)
 */
export async function optimizeImage(
  file: File,
  maxWidth: number = 2048,
  maxHeight: number = 2048,
  quality: number = 0.9
): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      let { width, height } = img;

      // Calculate new dimensions
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = width * ratio;
        height = height * ratio;
      }

      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Failed to create blob'));
            return;
          }
          const optimizedFile = new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now(),
          });
          resolve(optimizedFile);
        },
        file.type,
        quality
      );
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Detect compression artifacts (simplified)
 */
export async function detectCompressionArtifacts(file: File): Promise<{
  hasArtifacts: boolean;
  confidence: number;
  details: string[];
}> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, img.width, img.height);
      const pixels = imageData.data;

      const details: string[] = [];
      let artifactScore = 0;

      // Check for block artifacts (JPEG compression)
      const blockSize = 8;
      for (let y = 0; y < img.height - blockSize; y += blockSize) {
        for (let x = 0; x < img.width - blockSize; x += blockSize) {
          // Simple edge detection at block boundaries
          const edgeVariance = calculateEdgeVariance(
            pixels,
            x,
            y,
            blockSize,
            img.width
          );
          if (edgeVariance > 0.3) {
            artifactScore += 0.1;
          }
        }
      }

      if (artifactScore > 0.5) {
        details.push('Block artifacts detected (possible JPEG compression)');
      }

      // Check file size vs dimensions (low quality compression)
      const pixelsCount = img.width * img.height;
      const bytesPerPixel = file.size / pixelsCount;
      if (bytesPerPixel < 0.5) {
        details.push('Low bytes-per-pixel ratio (possible heavy compression)');
        artifactScore += 0.3;
      }

      resolve({
        hasArtifacts: artifactScore > 0.3,
        confidence: Math.min(100, artifactScore * 100),
        details,
      });
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

function calculateEdgeVariance(
  pixels: Uint8ClampedArray,
  x: number,
  y: number,
  blockSize: number,
  width: number
): number {
  let variance = 0;
  let count = 0;

  // Check horizontal edge
  for (let i = 0; i < blockSize; i++) {
    const idx1 = (y * width + x + i) * 4;
    const idx2 = ((y + blockSize) * width + x + i) * 4;

    if (idx1 < pixels.length && idx2 < pixels.length) {
      const diff =
        Math.abs(pixels[idx1] - pixels[idx2]) +
        Math.abs(pixels[idx1 + 1] - pixels[idx2 + 1]) +
        Math.abs(pixels[idx1 + 2] - pixels[idx2 + 2]);
      variance += diff / 3;
      count++;
    }
  }

  return count > 0 ? variance / count / 255 : 0;
}

/**
 * Extract dominant colors from image
 */
export async function extractDominantColors(
  file: File,
  count: number = 5
): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      // Resize for faster processing
      const maxSize = 200;
      let { width, height } = img;
      if (width > maxSize || height > maxSize) {
        const ratio = Math.min(maxSize / width, maxSize / height);
        width = width * ratio;
        height = height * ratio;
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      const imageData = ctx.getImageData(0, 0, width, height);
      const pixels = imageData.data;

      // Count color frequencies
      const colorMap = new Map<string, number>();

      for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];

        // Quantize colors to reduce variations
        const qr = Math.floor(r / 32) * 32;
        const qg = Math.floor(g / 32) * 32;
        const qb = Math.floor(b / 32) * 32;

        const key = `${qr},${qg},${qb}`;
        colorMap.set(key, (colorMap.get(key) || 0) + 1);
      }

      // Sort by frequency and get top colors
      const sortedColors = Array.from(colorMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, count)
        .map(([color]) => {
          const [r, g, b] = color.split(',').map(Number);
          return `#${[r, g, b]
            .map((c) => c.toString(16).padStart(2, '0'))
            .join('')}`;
        });

      resolve(sortedColors);
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}


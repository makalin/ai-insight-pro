import CryptoJS from 'crypto-js';

export interface ImageHashes {
  md5: string;
  sha256: string;
  perceptual?: string;
}

/**
 * Calculate MD5 hash of a file
 */
export async function calculateMD5(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
        const hash = CryptoJS.MD5(wordArray);
        resolve(hash.toString(CryptoJS.enc.Hex));
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Calculate SHA256 hash of a file
 */
export async function calculateSHA256(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
        const hash = CryptoJS.SHA256(wordArray);
        resolve(hash.toString(CryptoJS.enc.Hex));
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Calculate perceptual hash (simplified version using image data)
 */
export async function calculatePerceptualHash(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Canvas context not available'));
      return;
    }

    img.onload = () => {
      try {
        // Resize to 8x8 for hash calculation
        canvas.width = 8;
        canvas.height = 8;
        ctx.drawImage(img, 0, 0, 8, 8);

        const imageData = ctx.getImageData(0, 0, 8, 8);
        const pixels = imageData.data;

        // Convert to grayscale and calculate average
        let sum = 0;
        const grayscale: number[] = [];

        for (let i = 0; i < pixels.length; i += 4) {
          const gray = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
          grayscale.push(gray);
          sum += gray;
        }

        const average = sum / grayscale.length;

        // Generate hash bits
        let hash = '';
        for (const gray of grayscale) {
          hash += gray > average ? '1' : '0';
        }

        // Convert binary to hex
        let hexHash = '';
        for (let i = 0; i < hash.length; i += 4) {
          const nibble = hash.substr(i, 4);
          hexHash += parseInt(nibble, 2).toString(16);
        }

        resolve(hexHash);
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Calculate all hashes for an image
 */
export async function calculateAllHashes(file: File): Promise<ImageHashes> {
  const [md5, sha256, perceptual] = await Promise.all([
    calculateMD5(file),
    calculateSHA256(file),
    calculatePerceptualHash(file).catch(() => undefined),
  ]);

  return {
    md5,
    sha256,
    perceptual,
  };
}


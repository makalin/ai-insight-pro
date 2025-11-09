'use client';

import { useState, useEffect, useRef } from 'react';
import { Palette, BarChart3 } from 'lucide-react';
import { extractDominantColors } from '@/lib/image-utils';

interface ColorHistogramProps {
  file: File;
  imageSrc: string;
}

export default function ColorHistogram({ file, imageSrc }: ColorHistogramProps) {
  const [colors, setColors] = useState<string[]>([]);
  const [histogram, setHistogram] = useState<{ r: number[]; g: number[]; b: number[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const loadHistogram = async () => {
      try {
        // Extract dominant colors
        const dominantColors = await extractDominantColors(file, 10);
        setColors(dominantColors);

        // Calculate RGB histogram
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) return;

          canvas.width = Math.min(img.width, 200);
          canvas.height = Math.min(img.height, 200);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const pixels = imageData.data;

          const rHist = new Array(256).fill(0);
          const gHist = new Array(256).fill(0);
          const bHist = new Array(256).fill(0);

          for (let i = 0; i < pixels.length; i += 4) {
            rHist[pixels[i]]++;
            gHist[pixels[i + 1]]++;
            bHist[pixels[i + 2]]++;
          }

          // Normalize
          const max = Math.max(...rHist, ...gHist, ...bHist);
          setHistogram({
            r: rHist.map((v) => (v / max) * 100),
            g: gHist.map((v) => (v / max) * 100),
            b: bHist.map((v) => (v / max) * 100),
          });
        };
        img.src = imageSrc;
      } catch (error) {
        console.error('Failed to load color histogram:', error);
      } finally {
        setLoading(false);
      }
    };

    loadHistogram();
  }, [file, imageSrc]);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex items-center gap-2 mb-4">
          <Palette className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Color Analysis
          </h3>
        </div>
        <p className="text-gray-500 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-4">
        <Palette className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          Color Analysis
        </h3>
      </div>

      {/* Dominant Colors */}
      {colors.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Dominant Colors
          </h4>
          <div className="flex flex-wrap gap-2">
            {colors.map((color, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-2 rounded border border-gray-200 dark:border-gray-700"
              >
                <div
                  className="w-12 h-12 rounded border border-gray-300 dark:border-gray-600"
                  style={{ backgroundColor: color }}
                />
                <span className="text-xs font-mono text-gray-600 dark:text-gray-400">
                  {color}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RGB Histogram */}
      {histogram && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            RGB Histogram
          </h4>
          <div className="space-y-3">
            {/* Red Channel */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 bg-red-500 rounded"></div>
                <span className="text-xs text-gray-600 dark:text-gray-400">Red Channel</span>
              </div>
              <div className="h-24 bg-gray-100 dark:bg-gray-700 rounded overflow-hidden flex items-end gap-px">
                {histogram.r
                  .filter((_, index) => index % 4 === 0) // Sample every 4th value for better visualization
                  .map((value, index) => (
                    <div
                      key={index}
                      className="bg-red-500 flex-1 min-w-[1px]"
                      style={{ height: `${value}%` }}
                      title={`Value: ${Math.round(value)}%`}
                    />
                  ))}
              </div>
            </div>

            {/* Green Channel */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span className="text-xs text-gray-600 dark:text-gray-400">Green Channel</span>
              </div>
              <div className="h-24 bg-gray-100 dark:bg-gray-700 rounded overflow-hidden flex items-end gap-px">
                {histogram.g
                  .filter((_, index) => index % 4 === 0)
                  .map((value, index) => (
                    <div
                      key={index}
                      className="bg-green-500 flex-1 min-w-[1px]"
                      style={{ height: `${value}%` }}
                      title={`Value: ${Math.round(value)}%`}
                    />
                  ))}
              </div>
            </div>

            {/* Blue Channel */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span className="text-xs text-gray-600 dark:text-gray-400">Blue Channel</span>
              </div>
              <div className="h-24 bg-gray-100 dark:bg-gray-700 rounded overflow-hidden flex items-end gap-px">
                {histogram.b
                  .filter((_, index) => index % 4 === 0)
                  .map((value, index) => (
                    <div
                      key={index}
                      className="bg-blue-500 flex-1 min-w-[1px]"
                      style={{ height: `${value}%` }}
                      title={`Value: ${Math.round(value)}%`}
                    />
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


'use client';

import { useState } from 'react';
import { Compare, X, ZoomIn, ZoomOut } from 'lucide-react';

interface ImageComparisonProps {
  image1: string;
  image2: string;
  label1?: string;
  label2?: string;
  onClose: () => void;
}

export default function ImageComparison({
  image1,
  image2,
  label1 = 'Image 1',
  label2 = 'Image 2',
  onClose,
}: ImageComparisonProps) {
  const [zoom, setZoom] = useState(1);
  const [sliderPosition, setSliderPosition] = useState(50);

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.25, 3));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.25, 0.5));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <Compare className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Image Comparison</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleZoomOut}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors"
              title="Zoom out"
            >
              <ZoomOut className="w-5 h-5" />
            </button>
            <span className="text-sm text-gray-600 dark:text-gray-300">{Math.round(zoom * 100)}%</span>
            <button
              onClick={handleZoomIn}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors"
              title="Zoom in"
            >
              <ZoomIn className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors ml-4"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Comparison View */}
        <div className="flex-1 overflow-auto p-6">
          <div className="relative w-full" style={{ height: '600px' }}>
            <div className="absolute inset-0 flex">
              {/* Image 1 */}
              <div
                className="relative overflow-hidden"
                style={{
                  width: `${sliderPosition}%`,
                  height: '100%',
                }}
              >
                <img
                  src={image1}
                  alt={label1}
                  className="w-full h-full object-contain"
                  style={{ transform: `scale(${zoom})` }}
                />
                <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                  {label1}
                </div>
              </div>

              {/* Slider */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-blue-600 cursor-col-resize z-10"
                style={{ left: `${sliderPosition}%` }}
                onMouseDown={(e) => {
                  const container = e.currentTarget.parentElement;
                  if (!container) return;

                  const handleMouseMove = (e: MouseEvent) => {
                    const rect = container.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
                    setSliderPosition(percentage);
                  };

                  const handleMouseUp = () => {
                    document.removeEventListener('mousemove', handleMouseMove);
                    document.removeEventListener('mouseup', handleMouseUp);
                  };

                  document.addEventListener('mousemove', handleMouseMove);
                  document.addEventListener('mouseup', handleMouseUp);
                }}
              >
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>

              {/* Image 2 */}
              <div
                className="relative overflow-hidden"
                style={{
                  width: `${100 - sliderPosition}%`,
                  height: '100%',
                }}
              >
                <img
                  src={image2}
                  alt={label2}
                  className="w-full h-full object-contain"
                  style={{ transform: `scale(${zoom})` }}
                />
                <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                  {label2}
                </div>
              </div>
            </div>
          </div>

          {/* Slider Control */}
          <div className="mt-4">
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPosition}
              onChange={(e) => setSliderPosition(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}


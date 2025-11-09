'use client';

import { useState, useEffect } from 'react';
import { BarChart3, Info, FileImage } from 'lucide-react';
import { getImageStats } from '@/lib/image-utils';

interface ImageStatisticsProps {
  file: File;
  imageSrc: string;
}

export default function ImageStatistics({ file, imageSrc }: ImageStatisticsProps) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const imageStats = await getImageStats(file);
        setStats(imageStats);
      } catch (error) {
        console.error('Failed to load image statistics:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [file]);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Image Statistics
          </h3>
        </div>
        <p className="text-gray-500 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          Image Statistics
        </h3>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Dimensions
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {stats.width} × {stats.height} px
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Aspect Ratio
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {stats.aspectRatio.toFixed(2)}:1
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            File Size
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {formatBytes(stats.fileSize)}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Format
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 uppercase">
            {stats.format.split('/')[1] || stats.format}
          </p>
        </div>
        {stats.colorDepth && (
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Color Depth
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {stats.colorDepth.toFixed(2)} bytes/pixel
            </p>
          </div>
        )}
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Total Pixels
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {(stats.width * stats.height).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}


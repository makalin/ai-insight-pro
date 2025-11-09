'use client';

import { useState, useEffect } from 'react';
import { Gauge, AlertCircle, CheckCircle } from 'lucide-react';
import { detectCompressionArtifacts } from '@/lib/image-utils';

interface ImageQualityMetricsProps {
  file: File;
  imageSrc: string;
}

export default function ImageQualityMetrics({
  file,
  imageSrc,
}: ImageQualityMetricsProps) {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        const artifacts = await detectCompressionArtifacts(file);
        
        // Calculate additional quality metrics
        const img = new Image();
        img.onload = () => {
          const pixels = img.width * img.height;
          const bytesPerPixel = file.size / pixels;
          const compressionRatio = (file.size / (img.width * img.height * 3)) * 100;

          setMetrics({
            artifacts,
            bytesPerPixel,
            compressionRatio,
            resolution: img.width * img.height,
            fileSize: file.size,
          });
          setLoading(false);
        };
        img.onerror = () => setLoading(false);
        img.src = imageSrc;
      } catch (error) {
        console.error('Failed to load quality metrics:', error);
        setLoading(false);
      }
    };

    loadMetrics();
  }, [file, imageSrc]);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex items-center gap-2 mb-4">
          <Gauge className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Quality Metrics
          </h3>
        </div>
        <p className="text-gray-500 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  if (!metrics) return null;

  const getQualityScore = () => {
    let score = 100;
    if (metrics.artifacts.hasArtifacts) score -= 20;
    if (metrics.bytesPerPixel < 0.5) score -= 15;
    if (metrics.compressionRatio > 50) score -= 10;
    return Math.max(0, Math.min(100, score));
  };

  const qualityScore = getQualityScore();
  const qualityLevel =
    qualityScore >= 80
      ? { label: 'Excellent', color: 'text-green-600', icon: CheckCircle }
      : qualityScore >= 60
      ? { label: 'Good', color: 'text-blue-600', icon: CheckCircle }
      : qualityScore >= 40
      ? { label: 'Fair', color: 'text-yellow-600', icon: AlertCircle }
      : { label: 'Poor', color: 'text-red-600', icon: AlertCircle };

  const QualityIcon = qualityLevel.icon;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-4">
        <Gauge className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          Quality Metrics
        </h3>
      </div>

      {/* Overall Quality Score */}
      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <QualityIcon className={`w-5 h-5 ${qualityLevel.color}`} />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Overall Quality
            </span>
          </div>
          <span className={`text-2xl font-bold ${qualityLevel.color}`}>
            {qualityScore}
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${
              qualityScore >= 80
                ? 'bg-green-500'
                : qualityScore >= 60
                ? 'bg-blue-500'
                : qualityScore >= 40
                ? 'bg-yellow-500'
                : 'bg-red-500'
            }`}
            style={{ width: `${qualityScore}%` }}
          />
        </div>
        <p className={`text-sm mt-2 ${qualityLevel.color}`}>
          {qualityLevel.label}
        </p>
      </div>

      {/* Detailed Metrics */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Compression Artifacts
          </span>
          <span
            className={`text-sm font-medium ${
              metrics.artifacts.hasArtifacts
                ? 'text-yellow-600'
                : 'text-green-600'
            }`}
          >
            {metrics.artifacts.hasArtifacts ? 'Detected' : 'None'}
          </span>
        </div>

        {metrics.artifacts.details.length > 0 && (
          <div className="pl-4 border-l-2 border-yellow-500">
            {metrics.artifacts.details.map((detail: string, index: number) => (
              <p key={index} className="text-xs text-gray-600 dark:text-gray-400">
                • {detail}
              </p>
            ))}
          </div>
        )}

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Bytes per Pixel
          </span>
          <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
            {metrics.bytesPerPixel.toFixed(3)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Compression Ratio
          </span>
          <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
            {metrics.compressionRatio.toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
}


'use client';

import { TechnicalDetails } from '@/lib/analysis';
import { Info, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface TechnicalDetailsProps {
  technicalDetails: TechnicalDetails;
  detailLevel: 'basic' | 'intermediate' | 'advanced';
}

export default function TechnicalDetailsView({
  technicalDetails,
  detailLevel,
}: TechnicalDetailsProps) {
  const {
    imageDimensions,
    fileSize,
    colorDepth,
    compressionRatio,
    entropy,
    edgeDensity,
    colorComplexity,
    hasFaces,
    faceCount,
    hasText,
    textRegions,
    noiseLevel,
    sharpness,
    artifacts,
    metadataAnomalies,
    processingHistory,
  } = technicalDetails;

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const getQualityIndicator = (value: number, threshold: number) => {
    if (value >= threshold) {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    } else if (value >= threshold * 0.7) {
      return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    }
    return <XCircle className="w-4 h-4 text-red-500" />;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-6">
        <Info className="w-6 h-6 text-blue-600" />
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">
          Technical Analysis Details
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
            Image Properties
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Dimensions</span>
              <span className="text-sm font-medium text-gray-800 dark:text-white">
                {imageDimensions.width} × {imageDimensions.height} px
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">File Size</span>
              <span className="text-sm font-medium text-gray-800 dark:text-white">
                {formatFileSize(fileSize)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Color Depth</span>
              <span className="text-sm font-medium text-gray-800 dark:text-white">
                {colorDepth} bits
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Compression Ratio</span>
              <span className="text-sm font-medium text-gray-800 dark:text-white">
                {compressionRatio.toFixed(2)}:1
              </span>
            </div>
          </div>
        </div>

        {/* Quality Metrics */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
            Quality Metrics
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Sharpness</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-800 dark:text-white">
                  {sharpness.toFixed(2)}
                </span>
                {getQualityIndicator(sharpness, 0.7)}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Noise Level</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-800 dark:text-white">
                  {noiseLevel.toFixed(2)}
                </span>
                {getQualityIndicator(1 - noiseLevel, 0.7)}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Entropy</span>
              <span className="text-sm font-medium text-gray-800 dark:text-white">
                {entropy.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Edge Density</span>
              <span className="text-sm font-medium text-gray-800 dark:text-white">
                {(edgeDensity * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        {/* Content Analysis */}
        {(detailLevel === 'intermediate' || detailLevel === 'advanced') && (
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
              Content Analysis
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Faces Detected</span>
                <div className="flex items-center gap-2">
                  {hasFaces ? (
                    <>
                      <span className="text-sm font-medium text-gray-800 dark:text-white">
                        {faceCount || 'Yes'}
                      </span>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </>
                  ) : (
                    <>
                      <span className="text-sm font-medium text-gray-800 dark:text-white">No</span>
                      <XCircle className="w-4 h-4 text-gray-400" />
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Text Detected</span>
                <div className="flex items-center gap-2">
                  {hasText ? (
                    <>
                      <span className="text-sm font-medium text-gray-800 dark:text-white">
                        {textRegions || 'Yes'} region(s)
                      </span>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </>
                  ) : (
                    <>
                      <span className="text-sm font-medium text-gray-800 dark:text-white">No</span>
                      <XCircle className="w-4 h-4 text-gray-400" />
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Color Complexity</span>
                <span className="text-sm font-medium text-gray-800 dark:text-white">
                  {(colorComplexity * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Artifacts */}
        {detailLevel === 'advanced' && (
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
              Compression Artifacts
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Compression</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-800 dark:text-white">
                    {(artifacts.compression * 100).toFixed(1)}%
                  </span>
                  {getQualityIndicator(1 - artifacts.compression, 0.8)}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Quantization</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-800 dark:text-white">
                    {(artifacts.quantization * 100).toFixed(1)}%
                  </span>
                  {getQualityIndicator(1 - artifacts.quantization, 0.8)}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Blocking</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-800 dark:text-white">
                    {(artifacts.blocking * 100).toFixed(1)}%
                  </span>
                  {getQualityIndicator(1 - artifacts.blocking, 0.8)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Metadata Anomalies */}
        {detailLevel === 'advanced' && metadataAnomalies.length > 0 && (
          <div className="space-y-4 md:col-span-2">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
              Metadata Anomalies
            </h4>
            <div className="space-y-2">
              {metadataAnomalies.map((anomaly, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg"
                >
                  <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{anomaly}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Processing History */}
        {detailLevel === 'advanced' && processingHistory.length > 0 && (
          <div className="space-y-4 md:col-span-2">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
              Processing History
            </h4>
            <div className="space-y-2">
              {processingHistory.map((step, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 w-6">
                    {index + 1}.
                  </span>
                  <span className="text-sm text-gray-700 dark:text-gray-300">{step}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


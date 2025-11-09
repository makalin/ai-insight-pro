'use client';

import { AnalysisResult } from '@/lib/analysis';
import ProgressBar from './ProgressBar';
import { AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';

interface ReportCardProps {
  analysisResult: AnalysisResult;
}

export default function ReportCard({ analysisResult }: ReportCardProps) {
  const { overall, categories, diffusion, gan, llm, manipulation, other } = analysisResult;

  const getScoreColor = (score: number) => {
    if (score > 70) return 'text-red-600';
    if (score > 40) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score > 70) return 'bg-red-500';
    if (score > 40) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getScoreIcon = (score: number) => {
    if (score > 70) return <AlertCircle className="w-6 h-6" />;
    if (score > 40) return <AlertTriangle className="w-6 h-6" />;
    return <CheckCircle className="w-6 h-6" />;
  };

  const getScoreLabel = (score: number) => {
    if (score > 70) return 'High AI Likelihood';
    if (score > 40) return 'Moderate AI Likelihood';
    return 'Low AI Likelihood';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">
        AI Detection Summary
      </h3>

      {/* Overall Score */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Overall AI Likelihood
          </span>
          <div className={`flex items-center gap-2 ${getScoreColor(overall)}`}>
            {getScoreIcon(overall)}
            <span className="text-2xl font-bold">{overall}%</span>
          </div>
        </div>
        <ProgressBar
          progress={overall}
          color={getScoreBgColor(overall)}
        />
        <p className={`text-sm mt-2 ${getScoreColor(overall)}`}>
          {getScoreLabel(overall)}
        </p>
      </div>

      {/* Categories */}
      <div className="space-y-4 mb-6">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Generative AI
            </span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {categories.genai.toFixed(1)}%
            </span>
          </div>
          <ProgressBar progress={categories.genai} color="bg-blue-500" />
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Face Manipulation
            </span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {categories.faceManipulation.toFixed(1)}%
            </span>
          </div>
          <ProgressBar progress={categories.faceManipulation} color="bg-purple-500" />
        </div>

        {categories.bodyManipulation > 0 && (
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Body Manipulation
              </span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {categories.bodyManipulation.toFixed(1)}%
              </span>
            </div>
            <ProgressBar progress={categories.bodyManipulation} color="bg-pink-500" />
          </div>
        )}

        {categories.deepfake > 0 && (
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Deepfake
              </span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {categories.deepfake.toFixed(1)}%
              </span>
            </div>
            <ProgressBar progress={categories.deepfake} color="bg-red-600" />
          </div>
        )}

        {categories.inpainting > 0 && (
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Inpainting
              </span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {categories.inpainting.toFixed(1)}%
              </span>
            </div>
            <ProgressBar progress={categories.inpainting} color="bg-orange-500" />
          </div>
        )}

        {categories.styleTransfer > 0 && (
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Style Transfer
              </span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {categories.styleTransfer.toFixed(1)}%
              </span>
            </div>
            <ProgressBar progress={categories.styleTransfer} color="bg-indigo-500" />
          </div>
        )}
      </div>

      {/* Diffusion Models */}
      {Object.keys(diffusion).length > 0 && (
        <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Diffusion Models:
            </h4>
            <div className="space-y-2">
              {Object.entries(diffusion)
                .filter(([, value]) => value > 0)
                .sort(([, a], [, b]) => b - a)
                .map(([model, probability]) => (
                  <div key={model} className="flex items-center gap-2">
                    <span className="text-xs text-gray-600 dark:text-gray-400 flex-1">{model}</span>
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      {probability.toFixed(1)}%
                    </span>
                  </div>
                ))}
          </div>
        </div>
      )}

      {/* GAN Models */}
      {Object.keys(gan).length > 0 &&
        Object.entries(gan).some(([, value]) => value > 0) && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              GAN Models:
            </h4>
            <div className="space-y-2">
              {Object.entries(gan)
                .filter(([, value]) => value > 0)
                .sort(([, a], [, b]) => b - a)
                .map(([model, probability]) => (
                  <div key={model} className="flex items-center gap-2">
                    <span className="text-xs text-gray-600 dark:text-gray-400 flex-1">
                      {model}
                    </span>
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      {probability.toFixed(1)}%
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}

      {/* LLM Models */}
      {llm && Object.keys(llm).length > 0 &&
        Object.entries(llm).some(([, value]) => value > 0) && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              LLM-based Generation:
            </h4>
            <div className="space-y-2">
              {Object.entries(llm)
                .filter(([, value]) => value > 0)
                .sort(([, a], [, b]) => b - a)
                .map(([model, probability]) => (
                  <div key={model} className="flex items-center gap-2">
                    <span className="text-xs text-gray-600 dark:text-gray-400 flex-1">
                      {model}
                    </span>
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      {probability.toFixed(1)}%
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}

      {/* Manipulation Types */}
      {manipulation && Object.keys(manipulation).length > 0 &&
        Object.entries(manipulation).some(([, value]) => value > 0) && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Manipulation Types:
            </h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {Object.entries(manipulation)
                .filter(([, value]) => value > 0)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 10)
                .map(([type, probability]) => (
                  <div key={type} className="flex items-center gap-2">
                    <span className="text-xs text-gray-600 dark:text-gray-400 flex-1">
                      {type}
                    </span>
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      {probability.toFixed(1)}%
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}

      {/* Other Detections */}
      {Object.keys(other).length > 0 &&
        Object.entries(other).some(([, value]) => value > 0) && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Other Detections:
            </h4>
            <div className="space-y-2">
              {Object.entries(other)
                .filter(([, value]) => value > 0)
                .sort(([, a], [, b]) => b - a)
                .map(([detection, probability]) => (
                  <div key={detection} className="flex items-center gap-2">
                    <span className="text-xs text-gray-600 dark:text-gray-400 flex-1">
                      {detection}
                    </span>
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      {probability.toFixed(1)}%
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}
    </div>
  );
}


'use client';

import { Loader2 } from 'lucide-react';

interface LoadingProgressProps {
  progress: number;
  currentStep: string;
  steps: string[];
}

export default function LoadingProgress({
  progress,
  currentStep,
  steps,
}: LoadingProgressProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
      <div className="flex items-center gap-3 mb-4">
        <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Analyzing Image...
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {currentStep}
          </p>
        </div>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {Math.round(progress)}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-4">
        <div
          className="bg-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>

      {/* Steps */}
      <div className="space-y-2">
        {steps.map((step, index) => {
          const stepProgress = (index + 1) * (100 / steps.length);
          const isActive = progress >= stepProgress;
          const isCurrent = currentStep === step;

          return (
            <div
              key={index}
              className={`flex items-center gap-3 text-sm transition-colors ${
                isActive
                  ? 'text-gray-800 dark:text-gray-200'
                  : 'text-gray-400 dark:text-gray-500'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-600 text-gray-400 dark:text-gray-500'
                }`}
              >
                {isActive ? (
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <span className="text-xs">{index + 1}</span>
                )}
              </div>
              <span
                className={`${
                  isCurrent ? 'font-semibold' : ''
                }`}
              >
                {step}
              </span>
              {isCurrent && (
                <Loader2 className="w-4 h-4 text-blue-600 animate-spin ml-auto" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}


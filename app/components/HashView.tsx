'use client';

import { ImageHashes } from '@/lib/hash';
import { Hash, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface HashViewProps {
  hashes: ImageHashes;
}

export default function HashView({ hashes }: HashViewProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
        <Hash className="w-5 h-5" />
        Image Hashes
      </h3>
      <div className="space-y-4">
        {hashes.md5 && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">MD5</label>
              <button
                onClick={() => copyToClipboard(hashes.md5!, 'md5')}
                className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                title="Copy to clipboard"
              >
                {copied === 'md5' ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
            <p className="text-xs font-mono text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-2 rounded break-all">
              {hashes.md5}
            </p>
          </div>
        )}

        {hashes.sha256 && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">SHA256</label>
              <button
                onClick={() => copyToClipboard(hashes.sha256!, 'sha256')}
                className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                title="Copy to clipboard"
              >
                {copied === 'sha256' ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
            <p className="text-xs font-mono text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-2 rounded break-all">
              {hashes.sha256}
            </p>
          </div>
        )}

        {hashes.perceptual && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Perceptual Hash
              </label>
              <button
                onClick={() => copyToClipboard(hashes.perceptual!, 'perceptual')}
                className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                title="Copy to clipboard"
              >
                {copied === 'perceptual' ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
            <p className="text-xs font-mono text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-2 rounded break-all">
              {hashes.perceptual}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}


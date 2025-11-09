'use client';

import { MetadataResult } from '@/lib/metadata';
import { Camera, Calendar, MapPin, Ruler, Info } from 'lucide-react';

interface MetadataViewProps {
  metadata: MetadataResult;
}

export default function MetadataView({ metadata }: MetadataViewProps) {
  const hasMetadata = Object.keys(metadata).length > 0;

  if (!hasMetadata) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
          <Info className="w-5 h-5" />
          Image Metadata
        </h3>
        <p className="text-gray-500 dark:text-gray-400">No metadata found in this image.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
        <Info className="w-5 h-5" />
        Image Metadata
      </h3>
      <div className="space-y-3">
        {metadata.make || metadata.model ? (
          <div className="flex items-start gap-3">
            <Camera className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Camera</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {[metadata.make, metadata.model].filter(Boolean).join(' ')}
              </p>
            </div>
          </div>
        ) : null}

        {metadata.date ? (
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-700">Date</p>
              <p className="text-sm text-gray-600">
                {new Date(metadata.date).toLocaleString()}
              </p>
            </div>
          </div>
        ) : null}

        {metadata.gps ? (
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-700">GPS Location</p>
              <p className="text-sm text-gray-600">{metadata.gps}</p>
            </div>
          </div>
        ) : null}

        {metadata.width && metadata.height ? (
          <div className="flex items-start gap-3">
            <Ruler className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-700">Dimensions</p>
              <p className="text-sm text-gray-600">
                {metadata.width} × {metadata.height} pixels
              </p>
            </div>
          </div>
        ) : null}

        {metadata.software ? (
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-700">Software</p>
              <p className="text-sm text-gray-600">{metadata.software}</p>
            </div>
          </div>
        ) : null}

        {metadata.artist ? (
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-700">Artist</p>
              <p className="text-sm text-gray-600">{metadata.artist}</p>
            </div>
          </div>
        ) : null}

        {metadata.copyright ? (
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-700">Copyright</p>
              <p className="text-sm text-gray-600">{metadata.copyright}</p>
            </div>
          </div>
        ) : null}

        {metadata.iso ? (
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-700">ISO</p>
              <p className="text-sm text-gray-600">{metadata.iso}</p>
            </div>
          </div>
        ) : null}

        {metadata.fNumber ? (
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-700">Aperture</p>
              <p className="text-sm text-gray-600">f/{metadata.fNumber}</p>
            </div>
          </div>
        ) : null}

        {metadata.exposureTime ? (
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-700">Exposure Time</p>
              <p className="text-sm text-gray-600">
                1/{Math.round(1 / metadata.exposureTime)}s
              </p>
            </div>
          </div>
        ) : null}

        {metadata.focalLength ? (
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-700">Focal Length</p>
              <p className="text-sm text-gray-600">
                {metadata.focalLength}mm
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}


import exifr from 'exifr';

export interface MetadataResult {
  make?: string;
  model?: string;
  date?: string;
  gps?: string;
  width?: number;
  height?: number;
  orientation?: number;
  software?: string;
  artist?: string;
  copyright?: string;
  [key: string]: any;
}

/**
 * Extracts EXIF metadata from an image file
 */
export async function extractMetadata(file: File): Promise<MetadataResult> {
  try {
    const data = await exifr.parse(file, {
      pick: [
        'Make',
        'Model',
        'DateTimeOriginal',
        'GPSLatitude',
        'GPSLongitude',
        'ImageWidth',
        'ImageHeight',
        'Orientation',
        'Software',
        'Artist',
        'Copyright',
        'ExifVersion',
        'ISO',
        'FNumber',
        'ExposureTime',
        'FocalLength',
      ],
    });

    const result: MetadataResult = {
      make: data?.Make || undefined,
      model: data?.Model || undefined,
      date: data?.DateTimeOriginal
        ? new Date(data.DateTimeOriginal).toISOString()
        : undefined,
      width: data?.ImageWidth,
      height: data?.ImageHeight,
      orientation: data?.Orientation,
      software: data?.Software || undefined,
      artist: data?.Artist || undefined,
      copyright: data?.Copyright || undefined,
    };

    // Format GPS coordinates
    if (data?.GPSLatitude && data?.GPSLongitude) {
      result.gps = `${data.GPSLatitude.toFixed(6)}, ${data.GPSLongitude.toFixed(6)}`;
    }

    // Add additional EXIF data
    if (data?.ISO) result.iso = data.ISO;
    if (data?.FNumber) result.fNumber = data.FNumber;
    if (data?.ExposureTime) result.exposureTime = data.ExposureTime;
    if (data?.FocalLength) result.focalLength = data.FocalLength;

    return result;
  } catch (error) {
    console.error('Error extracting metadata:', error);
    return {};
  }
}


import Papa from 'papaparse';
import { AnalysisResult } from './analysis';
import { MetadataResult } from './metadata';
import { ImageHashes } from './hash';
import { AnalysisHistoryItem } from './history';

/**
 * Export analysis result as JSON
 */
export function exportAsJSON(
  analysisResult: AnalysisResult,
  metadata: MetadataResult,
  hashes?: ImageHashes,
  fileName?: string
): void {
  const data = {
    timestamp: new Date().toISOString(),
    analysis: analysisResult,
    metadata,
    hashes,
  };

  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName || `ai-insight-analysis-${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

/**
 * Export analysis result as CSV
 */
export function exportAsCSV(
  analysisResult: AnalysisResult,
  metadata: MetadataResult,
  fileName?: string
): void {
  const data = [
    {
      'Overall AI Likelihood': analysisResult.overall,
      'GenAI Score': analysisResult.categories.genai,
      'Face Manipulation Score': analysisResult.categories.faceManipulation,
      'Camera Make': metadata.make || '',
      'Camera Model': metadata.model || '',
      'Date': metadata.date || '',
      'GPS': metadata.gps || '',
      'Dimensions': metadata.width && metadata.height ? `${metadata.width}x${metadata.height}` : '',
      'Timestamp': new Date().toISOString(),
    },
  ];

  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName || `ai-insight-analysis-${Date.now()}.csv`;
  document.body.appendChild(a);
  a.click();
  URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

/**
 * Export history as CSV
 */
export function exportHistoryAsCSV(history: AnalysisHistoryItem[]): void {
  const data = history.map((item) => ({
    'ID': item.id,
    'Timestamp': new Date(item.timestamp).toISOString(),
    'File Name': item.fileName,
    'File Size (bytes)': item.fileSize,
    'Overall AI Likelihood': item.analysisResult.overall,
    'GenAI Score': item.analysisResult.categories.genai,
    'Face Manipulation Score': item.analysisResult.categories.faceManipulation,
    'Camera Make': item.metadata.make || '',
    'Camera Model': item.metadata.model || '',
    'Date': item.metadata.date || '',
    'GPS': item.metadata.gps || '',
    'MD5 Hash': item.hashes?.md5 || '',
    'SHA256 Hash': item.hashes?.sha256 || '',
    'Notes': item.notes || '',
  }));

  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ai-insight-history-${Date.now()}.csv`;
  document.body.appendChild(a);
  a.click();
  URL.revokeObjectURL(url);
  document.body.removeChild(a);
}


import { AnalysisResult } from './analysis';
import { MetadataResult } from './metadata';
import { ImageHashes } from './hash';

export interface AnalysisHistoryItem {
  id: string;
  timestamp: number;
  fileName: string;
  fileSize: number;
  preview?: string;
  analysisResult: AnalysisResult;
  metadata: MetadataResult;
  hashes?: ImageHashes;
  notes?: string;
}

const STORAGE_KEY = 'ai-insight-pro-history';
const MAX_HISTORY_ITEMS = 100;

/**
 * Save analysis to history
 */
export function saveToHistory(item: Omit<AnalysisHistoryItem, 'id' | 'timestamp'>): string {
  const history = getHistory();
  const id = `analysis-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  const historyItem: AnalysisHistoryItem = {
    ...item,
    id,
    timestamp: Date.now(),
  };

  history.unshift(historyItem);

  // Keep only last MAX_HISTORY_ITEMS
  if (history.length > MAX_HISTORY_ITEMS) {
    history.splice(MAX_HISTORY_ITEMS);
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Failed to save to history:', error);
  }

  return id;
}

/**
 * Get all history items
 */
export function getHistory(): AnalysisHistoryItem[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to read history:', error);
    return [];
  }
}

/**
 * Get history item by ID
 */
export function getHistoryItem(id: string): AnalysisHistoryItem | null {
  const history = getHistory();
  return history.find((item) => item.id === id) || null;
}

/**
 * Delete history item
 */
export function deleteHistoryItem(id: string): boolean {
  const history = getHistory();
  const filtered = history.filter((item) => item.id !== id);
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Failed to delete history item:', error);
    return false;
  }
}

/**
 * Clear all history
 */
export function clearHistory(): boolean {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Failed to clear history:', error);
    return false;
  }
}

/**
 * Update history item notes
 */
export function updateHistoryNotes(id: string, notes: string): boolean {
  const history = getHistory();
  const item = history.find((item) => item.id === id);
  
  if (!item) return false;
  
  item.notes = notes;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    return true;
  } catch (error) {
    console.error('Failed to update history notes:', error);
    return false;
  }
}

/**
 * Export history as JSON
 */
export function exportHistoryAsJSON(): string {
  const history = getHistory();
  return JSON.stringify(history, null, 2);
}


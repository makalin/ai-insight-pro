'use client';

import { useState, useEffect } from 'react';
import { History, X, Trash2, FileText, Download, Search, Calendar } from 'lucide-react';
import { getHistory, deleteHistoryItem, clearHistory, exportHistoryAsCSV } from '@/lib/history';
import { AnalysisHistoryItem } from '@/lib/history';
import { format } from 'date-fns';

interface HistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectItem: (item: AnalysisHistoryItem) => void;
}

export default function HistoryPanel({ isOpen, onClose, onSelectItem }: HistoryPanelProps) {
  const [history, setHistory] = useState<AnalysisHistoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredHistory, setFilteredHistory] = useState<AnalysisHistoryItem[]>([]);

  useEffect(() => {
    if (isOpen) {
      loadHistory();
    }
  }, [isOpen]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = history.filter(
        (item) =>
          item.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.notes?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredHistory(filtered);
    } else {
      setFilteredHistory(history);
    }
  }, [searchTerm, history]);

  const loadHistory = () => {
    const items = getHistory();
    setHistory(items);
    setFilteredHistory(items);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this analysis?')) {
      deleteHistoryItem(id);
      loadHistory();
    }
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear all history? This cannot be undone.')) {
      clearHistory();
      loadHistory();
    }
  };

  const handleExport = () => {
    exportHistoryAsCSV(history);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <History className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Analysis History</h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">({history.length} items)</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors"
              title="Export to CSV"
            >
              <Download className="w-5 h-5" />
            </button>
            <button
              onClick={handleClearAll}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-red-600 transition-colors"
              title="Clear all"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by filename or notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg">No history found</p>
              <p className="text-sm mt-2">
                {searchTerm ? 'Try a different search term' : 'Start analyzing images to build your history'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredHistory.map((item) => (
                <div
                  key={item.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer bg-white dark:bg-gray-700"
                  onClick={() => {
                    onSelectItem(item);
                    onClose();
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-800 dark:text-white">{item.fileName}</h3>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {(item.fileSize / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300 mb-2">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {format(new Date(item.timestamp), 'MMM dd, yyyy HH:mm')}
                        </div>
                        <div>
                          Overall: <span className="font-semibold">{item.analysisResult.overall}%</span>
                        </div>
                      </div>
                      {item.notes && (
                        <p className="text-sm text-gray-500 italic mt-1">{item.notes}</p>
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item.id);
                      }}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Upload,
  FileImage,
  Loader2,
  Download,
  X,
  History,
  Settings,
  FileJson,
  FileSpreadsheet,
  Hash as HashIcon,
  Layers,
  Maximize2,
  Search,
  BarChart3,
  Palette,
  Gauge,
} from 'lucide-react';
import ReportCard from './components/ReportCard';
import ChartView from './components/ChartView';
import MetadataView from './components/MetadataView';
import HashView from './components/HashView';
import HistoryPanel from './components/HistoryPanel';
import SettingsPanel from './components/SettingsPanel';
import BatchProcessor from './components/BatchProcessor';
import ImageComparison from './components/ImageComparison';
import LoadingProgress from './components/LoadingProgress';
import ImageInspector from './components/ImageInspector';
import ImageStatistics from './components/ImageStatistics';
import ColorHistogram from './components/ColorHistogram';
import ImageQualityMetrics from './components/ImageQualityMetrics';
import TechnicalDetailsView from './components/TechnicalDetails';
import { AnalysisResult } from '@/lib/analysis';
import { MetadataResult } from '@/lib/metadata';
import { ImageHashes } from '@/lib/hash';
import { saveToHistory, getHistory } from '@/lib/history';
import { exportAsJSON, exportAsCSV } from '@/lib/export';
import { optimizeImage } from '@/lib/image-utils';
import { calculateAllHashes } from '@/lib/hash';

interface AppSettings {
  autoOptimize: boolean;
  maxImageSize: number;
  defaultQuality: number;
  enableHistory: boolean;
  enableHashes: boolean;
  apiProvider?: 'mock' | 'sightengine' | 'huggingface' | 'hiveai';
  sightengineApiUser?: string;
  sightengineApiSecret?: string;
  huggingfaceApiKey?: string;
  huggingfaceModel?: string;
  hiveaiApiKey?: string;
  showTechnicalDetails?: boolean;
  technicalDetailLevel?: 'basic' | 'intermediate' | 'advanced';
}

const DEFAULT_SETTINGS: AppSettings = {
  autoOptimize: true,
  maxImageSize: 2048,
  defaultQuality: 0.9,
  enableHistory: true,
  enableHashes: true,
};

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStep, setLoadingStep] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [metadata, setMetadata] = useState<MetadataResult | null>(null);
  const [hashes, setHashes] = useState<ImageHashes | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [showHistory, setShowHistory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showBatch, setShowBatch] = useState(false);
  const [comparisonImage, setComparisonImage] = useState<string | null>(null);
  const [showInspector, setShowInspector] = useState(false);
  const [showInspectionTools, setShowInspectionTools] = useState(false);
  const [historyCount, setHistoryCount] = useState(0);
  const [mounted, setMounted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
    loadSettings();
    // Load history count on client side only
    try {
      const history = getHistory();
      setHistoryCount(history.length);
    } catch (error) {
      console.error('Failed to load history count:', error);
    }
  }, []);

  const loadSettings = () => {
    try {
      const stored = localStorage.getItem('ai-insight-pro-settings');
      if (stored) {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(stored) });
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const handleFileSelect = async (selectedFile: File) => {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];
    if (!allowedTypes.includes(selectedFile.type)) {
      setError('Invalid file type. Please upload JPEG, PNG, WEBP, or HEIC.');
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (selectedFile.size > maxSize) {
      setError('File size exceeds 10MB limit.');
      return;
    }

    let processedFile = selectedFile;

    // Auto-optimize if enabled
    if (settings.autoOptimize) {
      try {
        processedFile = await optimizeImage(
          selectedFile,
          settings.maxImageSize,
          settings.maxImageSize,
          settings.defaultQuality
        );
      } catch (error) {
        console.error('Optimization failed:', error);
        // Continue with original file
      }
    }

    setFile(processedFile);
    setError(null);
    setAnalysisResult(null);
    setMetadata(null);
    setHashes(null);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(processedFile);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setLoadingProgress(0);
    setLoadingStep('Initializing analysis...');

    const steps = [
      'Uploading image...',
      'Analyzing AI patterns...',
      'Extracting metadata...',
      settings.enableHashes ? 'Calculating hashes...' : null,
      'Generating report...',
    ].filter(Boolean) as string[];

    try {
      // Step 1: Upload and analyze
      setLoadingProgress(10);
      setLoadingStep('Uploading image...');
      
      const analyzeFormData = new FormData();
      analyzeFormData.append('file', file);
      
      // Add API settings if configured
      const apiSettings = {
        apiProvider: settings.apiProvider || 'mock',
        sightengineApiUser: settings.sightengineApiUser || '',
        sightengineApiSecret: settings.sightengineApiSecret || '',
        huggingfaceApiKey: settings.huggingfaceApiKey || '',
        huggingfaceModel: settings.huggingfaceModel || '',
        hiveaiApiKey: settings.hiveaiApiKey || '',
      };
      analyzeFormData.append('settings', JSON.stringify(apiSettings));

      setLoadingProgress(20);
      setLoadingStep('Analyzing AI patterns...');

      const analyzeResponse = await fetch('/api/analyze', {
        method: 'POST',
        body: analyzeFormData,
      });

      if (!analyzeResponse.ok) {
        const errorData = await analyzeResponse.json();
        throw new Error(errorData.error || 'Failed to analyze image');
      }

      const analyzeResult: AnalysisResult = await analyzeResponse.json();
      setAnalysisResult(analyzeResult);
      setLoadingProgress(50);

      // Step 2: Extract metadata
      setLoadingStep('Extracting metadata...');
      const metadataFormData = new FormData();
      metadataFormData.append('file', file);

      const metadataResponse = await fetch('/api/metadata', {
        method: 'POST',
        body: metadataFormData,
      });

      let metadataResult: MetadataResult = {};
      if (metadataResponse.ok) {
        metadataResult = await metadataResponse.json();
        setMetadata(metadataResult);
      }
      setLoadingProgress(70);

      // Step 3: Calculate hashes if enabled
      let calculatedHashes: ImageHashes | null = null;
      if (settings.enableHashes) {
        setLoadingStep('Calculating hashes...');
        try {
          calculatedHashes = await calculateAllHashes(file);
          setHashes(calculatedHashes);
        } catch (error) {
          console.error('Hash calculation failed:', error);
        }
      }
      setLoadingProgress(85);

      // Step 4: Save to history if enabled
      if (settings.enableHistory && analyzeResult && metadataResult) {
        setLoadingStep('Saving to history...');
        const previewData = preview || '';
        saveToHistory({
          fileName: file.name,
          fileSize: file.size,
          preview: previewData.length > 10000 ? undefined : previewData, // Limit preview size
          analysisResult: analyzeResult,
          metadata: metadataResult,
          hashes: calculatedHashes || undefined,
        });
        // Update history count
        try {
          const history = getHistory();
          setHistoryCount(history.length);
        } catch (error) {
          console.error('Failed to update history count:', error);
        }
      }

      setLoadingProgress(100);
      setLoadingStep('Analysis complete!');
      
      // Small delay to show completion
      await new Promise((resolve) => setTimeout(resolve, 300));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during analysis');
    } finally {
      setLoading(false);
      setLoadingProgress(0);
      setLoadingStep('');
    }
  };

  const handleDownloadReport = async () => {
    if (!analysisResult || !metadata) return;

    try {
      const response = await fetch('/api/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          analysisResult,
          metadata,
          hashes,
          fileName: file?.name,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate report');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ai-insight-report-${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to download report');
    }
  };

  const handleExportJSON = () => {
    if (!analysisResult || !metadata) return;
    exportAsJSON(analysisResult, metadata, hashes || undefined, file?.name);
  };

  const handleExportCSV = () => {
    if (!analysisResult || !metadata) return;
    exportAsCSV(analysisResult, metadata, file?.name);
  };

  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setAnalysisResult(null);
    setMetadata(null);
    setHashes(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleGoHome = () => {
    handleReset();
    setShowBatch(false);
    setShowHistory(false);
    setShowSettings(false);
    setComparisonImage(null);
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectFromHistory = (item: any) => {
    setAnalysisResult(item.analysisResult);
    setMetadata(item.metadata);
    setHashes(item.hashes || null);
    setPreview(item.preview || null);
    setFile(null); // We don't have the original file
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div 
            className="text-center flex-1 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={handleGoHome}
            title="Click to return to home"
          >
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">🧠 AI Insight Pro</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Professional AI-Image Authenticity Analyzer
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowBatch(!showBatch)}
              className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              title="Batch Processing"
            >
              <Layers className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
            <button
              onClick={() => setShowHistory(true)}
              className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow relative"
              title="History"
            >
              <History className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              {mounted && historyCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {historyCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setShowSettings(true)}
              className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              title="Settings"
            >
              <Settings className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        </div>

        {/* Batch Processor */}
        {showBatch && (
          <div className="mb-8">
            <BatchProcessor />
          </div>
        )}

        {/* Loading Progress */}
        {loading && (
          <LoadingProgress
            progress={loadingProgress}
            currentStep={loadingStep}
            steps={[
              'Uploading image...',
              'Analyzing AI patterns...',
              'Extracting metadata...',
              ...(settings.enableHashes ? ['Calculating hashes...'] : []),
              'Generating report...',
            ]}
          />
        )}

        {/* Upload Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          {!preview ? (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-12 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                Drag and drop an image here, or click to select
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Supports JPEG, PNG, WEBP, HEIC (Max 10MB)
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/heic"
                onChange={handleFileInputChange}
                className="hidden"
              />
            </div>
          ) : (
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <FileImage className="w-6 h-6 text-blue-500" />
                  <div>
                    <p className="font-medium text-gray-800 dark:text-gray-200">{file?.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {(file?.size || 0) / 1024 / 1024} MB
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {preview && (
                    <>
                      <button
                        onClick={() => setShowInspector(true)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Inspect image (zoom & pan)"
                      >
                        <Search className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setShowInspectionTools(!showInspectionTools)}
                        className={`p-2 transition-colors ${
                          showInspectionTools
                            ? 'text-purple-600 hover:text-purple-700'
                            : 'text-gray-400 hover:text-purple-600'
                        }`}
                        title="Inspection tools"
                      >
                        <BarChart3 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setComparisonImage(preview)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        title="View fullscreen"
                      >
                        <Maximize2 className="w-5 h-5" />
                      </button>
                    </>
                  )}
                  <button
                    onClick={handleReset}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="relative rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-auto max-h-96 object-contain mx-auto"
                />
              </div>
              <div className="mt-4 flex gap-3 flex-wrap">
                <button
                  onClick={handleAnalyze}
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[150px]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    'Analyze Image'
                  )}
                </button>
                {analysisResult && metadata && (
                  <>
                    <button
                      onClick={handleDownloadReport}
                      className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
                    >
                      <Download className="w-5 h-5" />
                      PDF Report
                    </button>
                    <button
                      onClick={handleExportJSON}
                      className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center gap-2"
                      title="Export as JSON"
                    >
                      <FileJson className="w-5 h-5" />
                      JSON
                    </button>
                    <button
                      onClick={handleExportCSV}
                      className="bg-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors flex items-center gap-2"
                      title="Export as CSV"
                    >
                      <FileSpreadsheet className="w-5 h-5" />
                      CSV
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Inspection Tools */}
        {showInspectionTools && preview && file && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Search className="w-6 h-6 text-blue-600" />
                Inspection Tools
              </h2>
              <button
                onClick={() => setShowInspectionTools(false)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ImageStatistics file={file} imageSrc={preview} />
              <ImageQualityMetrics file={file} imageSrc={preview} />
              <ColorHistogram file={file} imageSrc={preview} />
            </div>
          </div>
        )}

        {/* Results Section */}
        {analysisResult && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <ReportCard analysisResult={analysisResult} />
            {metadata && <MetadataView metadata={metadata} />}
            {hashes && <HashView hashes={hashes} />}
          </div>
        )}

        {/* Charts Section */}
        {analysisResult && (
          <div className="mb-8">
            <ChartView analysisResult={analysisResult} />
          </div>
        )}

        {/* Technical Details Section */}
        {analysisResult?.technicalDetails && settings.showTechnicalDetails !== false && (
          <div className="mb-8">
            <TechnicalDetailsView
              technicalDetails={analysisResult.technicalDetails}
              detailLevel={settings.technicalDetailLevel || 'intermediate'}
            />
          </div>
        )}

        {/* Modals */}
        <HistoryPanel
          isOpen={showHistory}
          onClose={() => {
            setShowHistory(false);
            // Update history count when panel closes
            try {
              const history = getHistory();
              setHistoryCount(history.length);
            } catch (error) {
              console.error('Failed to update history count:', error);
            }
          }}
          onSelectItem={handleSelectFromHistory}
        />
        <SettingsPanel
          isOpen={showSettings}
          onClose={() => {
            setShowSettings(false);
            loadSettings();
          }}
        />
        {comparisonImage && (
          <ImageComparison
            image1={comparisonImage}
            image2={comparisonImage}
            label1="Image"
            label2="Comparison"
            onClose={() => setComparisonImage(null)}
          />
        )}
        {showInspector && preview && (
          <ImageInspector
            imageSrc={preview}
            fileName={file?.name}
            onClose={() => setShowInspector(false)}
          />
        )}

        {/* Footer */}
        <footer className="text-center text-gray-600 dark:text-gray-400 text-sm mt-12">
          <p>
            Created by{' '}
            <a
              href="https://github.com/makalin"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Mehmet T. Akalın
            </a>{' '}
            — 2025
          </p>
          <p className="mt-2">🌐 &quot;Detecting reality, one pixel at a time.&quot;</p>
        </footer>
      </div>
    </main>
  );
}

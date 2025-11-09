'use client';

import { useState, useEffect } from 'react';
import { Settings, X, Save, RotateCcw } from 'lucide-react';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AppSettings {
  autoOptimize: boolean;
  maxImageSize: number;
  defaultQuality: number;
  enableHistory: boolean;
  enableHashes: boolean;
  theme: 'light' | 'dark' | 'auto';
  // API Settings
  apiProvider: 'mock' | 'sightengine' | 'huggingface' | 'hiveai';
  sightengineApiUser: string;
  sightengineApiSecret: string;
  huggingfaceApiKey: string;
  huggingfaceModel: string;
  hiveaiApiKey: string;
  // Technical Details
  showTechnicalDetails: boolean;
  technicalDetailLevel: 'basic' | 'intermediate' | 'advanced';
}

const DEFAULT_SETTINGS: AppSettings = {
  autoOptimize: true,
  maxImageSize: 2048,
  defaultQuality: 0.9,
  enableHistory: true,
  enableHashes: true,
  theme: 'light',
  apiProvider: 'mock',
  sightengineApiUser: '',
  sightengineApiSecret: '',
  huggingfaceApiKey: '',
  huggingfaceModel: 'vikhyatk/moondream2',
  hiveaiApiKey: '',
  showTechnicalDetails: true,
  technicalDetailLevel: 'intermediate',
};

export default function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadSettings();
    }
  }, [isOpen]);

  const loadSettings = () => {
    try {
      const stored = localStorage.getItem('ai-insight-pro-settings');
      if (stored) {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(stored) });
      } else {
        setSettings(DEFAULT_SETTINGS);
      }
      setHasChanges(false);
    } catch (error) {
      console.error('Failed to load settings:', error);
      setSettings(DEFAULT_SETTINGS);
    }
  };

  const saveSettings = () => {
    try {
      localStorage.setItem('ai-insight-pro-settings', JSON.stringify(settings));
      setHasChanges(false);
      
      // Apply theme immediately
      const html = document.documentElement;
      if (settings.theme === 'dark') {
        html.classList.add('dark');
      } else if (settings.theme === 'light') {
        html.classList.remove('dark');
      } else if (settings.theme === 'auto') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
          html.classList.add('dark');
        } else {
          html.classList.remove('dark');
        }
      }
      
      // Dispatch event to notify other components
      window.dispatchEvent(new Event('theme-changed'));
      
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings');
    }
  };

  const resetSettings = () => {
    if (confirm('Reset all settings to default?')) {
      setSettings(DEFAULT_SETTINGS);
      setHasChanges(true);
    }
  };

  const updateSetting = <K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <Settings className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Image Optimization */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Image Optimization
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Auto-optimize images
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Automatically resize large images before upload
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.autoOptimize}
                  onChange={(e) => updateSetting('autoOptimize', e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                  Maximum image size: {settings.maxImageSize}px
                </label>
                <input
                  type="range"
                  min="1024"
                  max="4096"
                  step="256"
                  value={settings.maxImageSize}
                  onChange={(e) =>
                    updateSetting('maxImageSize', parseInt(e.target.value))
                  }
                  disabled={!settings.autoOptimize}
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                  Default quality: {Math.round(settings.defaultQuality * 100)}%
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="1"
                  step="0.05"
                  value={settings.defaultQuality}
                  onChange={(e) =>
                    updateSetting('defaultQuality', parseFloat(e.target.value))
                  }
                  disabled={!settings.autoOptimize}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Features</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Enable analysis history
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Save analysis results to browser history
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.enableHistory}
                  onChange={(e) => updateSetting('enableHistory', e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Calculate image hashes
                  </label>
                  <p className="text-xs text-gray-500">
                    Generate MD5, SHA256, and perceptual hashes
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.enableHashes}
                  onChange={(e) => updateSetting('enableHashes', e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* API Configuration */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              API Configuration
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                  AI Detection Provider
                </label>
                <select
                  value={settings.apiProvider}
                  onChange={(e) =>
                    updateSetting('apiProvider', e.target.value as AppSettings['apiProvider'])
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="mock">Mock (Demo Mode)</option>
                  <option value="sightengine">Sightengine</option>
                  <option value="huggingface">Hugging Face</option>
                  <option value="hiveai">HiveAI</option>
                </select>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Select the AI detection API provider
                </p>
              </div>

              {/* Sightengine Settings */}
              {settings.apiProvider === 'sightengine' && (
                <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h4 className="text-sm font-semibold text-gray-800 dark:text-white">
                    Sightengine API
                  </h4>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">
                      API User
                    </label>
                    <input
                      type="text"
                      value={settings.sightengineApiUser}
                      onChange={(e) => updateSetting('sightengineApiUser', e.target.value)}
                      placeholder="Your Sightengine API User"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-600 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">
                      API Secret
                    </label>
                    <input
                      type="password"
                      value={settings.sightengineApiSecret}
                      onChange={(e) => updateSetting('sightengineApiSecret', e.target.value)}
                      placeholder="Your Sightengine API Secret"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-600 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Get your credentials at{' '}
                      <a
                        href="https://sightengine.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        sightengine.com
                      </a>
                    </p>
                  </div>
                </div>
              )}

              {/* Hugging Face Settings */}
              {settings.apiProvider === 'huggingface' && (
                <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h4 className="text-sm font-semibold text-gray-800 dark:text-white">
                    Hugging Face API
                  </h4>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">
                      API Key
                    </label>
                    <input
                      type="password"
                      value={settings.huggingfaceApiKey}
                      onChange={(e) => updateSetting('huggingfaceApiKey', e.target.value)}
                      placeholder="Your Hugging Face API Key"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-600 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">
                      Model Name
                    </label>
                    <input
                      type="text"
                      value={settings.huggingfaceModel}
                      onChange={(e) => updateSetting('huggingfaceModel', e.target.value)}
                      placeholder="vikhyatk/moondream2"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-600 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Get your API key at{' '}
                      <a
                        href="https://huggingface.co/settings/tokens"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        huggingface.co
                      </a>
                    </p>
                  </div>
                </div>
              )}

              {/* HiveAI Settings */}
              {settings.apiProvider === 'hiveai' && (
                <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h4 className="text-sm font-semibold text-gray-800 dark:text-white">
                    HiveAI API
                  </h4>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">
                      API Key
                    </label>
                    <input
                      type="password"
                      value={settings.hiveaiApiKey}
                      onChange={(e) => updateSetting('hiveaiApiKey', e.target.value)}
                      placeholder="Your HiveAI API Key"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-600 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Get your API key at{' '}
                      <a
                        href="https://thehive.ai"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        thehive.ai
                      </a>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Technical Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Technical Details
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Show Technical Details
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Display advanced technical analysis information
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.showTechnicalDetails}
                  onChange={(e) => updateSetting('showTechnicalDetails', e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
              </div>

              {settings.showTechnicalDetails && (
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                    Detail Level
                  </label>
                  <select
                    value={settings.technicalDetailLevel}
                    onChange={(e) =>
                      updateSetting('technicalDetailLevel', e.target.value as AppSettings['technicalDetailLevel'])
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="basic">Basic</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Appearance */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Appearance</h3>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                Theme
              </label>
              <select
                value={settings.theme}
                onChange={(e) =>
                  updateSetting('theme', e.target.value as 'light' | 'dark' | 'auto')
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="auto">Auto (System)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t">
            <button
              onClick={resetSettings}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reset to Default
            </button>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                Cancel
              </button>
            <button
              onClick={saveSettings}
              disabled={!hasChanges}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


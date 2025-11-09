'use client';

import {
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';
import { AnalysisResult } from '@/lib/analysis';

interface ChartViewProps {
  analysisResult: AnalysisResult;
}

export default function ChartView({ analysisResult }: ChartViewProps) {
  // Prepare data for bar chart (diffusion models)
  const diffusionData = Object.entries(analysisResult.diffusion)
    .filter(([, value]) => value > 0)
    .map(([name, value]) => ({
      name: name.length > 15 ? name.substring(0, 15) + '...' : name,
      value: Math.round(value),
      fullName: name,
    }))
    .sort((a, b) => b.value - a.value);

  // Prepare data for radar chart
  const radarData = [
    {
      category: 'Overall',
      value: analysisResult.overall,
      fullMark: 100,
    },
    {
      category: 'GenAI',
      value: analysisResult.categories.genai,
      fullMark: 100,
    },
    {
      category: 'Face Manip',
      value: analysisResult.categories.faceManipulation,
      fullMark: 100,
    },
    {
      category: 'Body Manip',
      value: analysisResult.categories.bodyManipulation || 0,
      fullMark: 100,
    },
    {
      category: 'Deepfake',
      value: analysisResult.categories.deepfake || 0,
      fullMark: 100,
    },
    {
      category: 'Inpainting',
      value: analysisResult.categories.inpainting || 0,
      fullMark: 100,
    },
    {
      category: 'Style Transfer',
      value: analysisResult.categories.styleTransfer || 0,
      fullMark: 100,
    },
  ];

  // Prepare GAN data
  const ganData = Object.entries(analysisResult.gan)
    .filter(([, value]) => value > 0)
    .map(([name, value]) => ({
      name: name.length > 15 ? name.substring(0, 15) + '...' : name,
      value: Math.round(value),
      fullName: name,
    }));

  // Prepare LLM data
  const llmData = analysisResult.llm
    ? Object.entries(analysisResult.llm)
        .filter(([, value]) => value > 0)
        .map(([name, value]) => ({
          name: name.length > 15 ? name.substring(0, 15) + '...' : name,
          value: Math.round(value),
          fullName: name,
        }))
    : [];

  // Prepare Manipulation data
  const manipulationData = analysisResult.manipulation
    ? Object.entries(analysisResult.manipulation)
        .filter(([, value]) => value > 0)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10) // Top 10 manipulations
        .map(([name, value]) => ({
          name: name.length > 20 ? name.substring(0, 20) + '...' : name,
          value: Math.round(value),
          fullName: name,
        }))
    : [];

  return (
    <div className="space-y-8">
      {/* Radar Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
          Overall Analysis
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="category" />
            <PolarRadiusAxis angle={90} domain={[0, 100]} />
            <Radar
              name="Score"
              dataKey="value"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.6}
            />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Diffusion Models Bar Chart */}
      {diffusionData.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
            Diffusion Models Detected
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={diffusionData}>
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip
                formatter={(value: number, name: string, props: any) => [
                  `${value}%`,
                  props.payload.fullName,
                ]}
              />
              <Legend />
              <Bar dataKey="value" fill="#3b82f6" name="Probability (%)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* GAN Models Bar Chart */}
      {ganData.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
            GAN Models Detected
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ganData}>
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip
                formatter={(value: number, name: string, props: any) => [
                  `${value}%`,
                  props.payload.fullName,
                ]}
              />
              <Legend />
              <Bar dataKey="value" fill="#10b981" name="Probability (%)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* LLM Models Bar Chart */}
      {llmData.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
            LLM-based Generation Detected
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={llmData}>
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip
                formatter={(value: number, name: string, props: any) => [
                  `${value}%`,
                  props.payload.fullName,
                ]}
              />
              <Legend />
              <Bar dataKey="value" fill="#8b5cf6" name="Probability (%)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Manipulation Types Bar Chart */}
      {manipulationData.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
            Manipulation Types Detected
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={manipulationData} layout="vertical">
              <XAxis type="number" domain={[0, 100]} />
              <YAxis dataKey="name" type="category" width={150} />
              <Tooltip
                formatter={(value: number, name: string, props: any) => [
                  `${value}%`,
                  props.payload.fullName,
                ]}
              />
              <Legend />
              <Bar dataKey="value" fill="#f59e0b" name="Probability (%)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}


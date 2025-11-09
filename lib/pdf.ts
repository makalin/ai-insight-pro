import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { AnalysisResult } from './analysis';
import { MetadataResult } from './metadata';
import { ImageHashes } from './hash';

/**
 * Generates a PDF authenticity report
 */
export async function generateReport(
  analysisResult: AnalysisResult,
  metadata: MetadataResult,
  imageDataUrl?: string,
  hashes?: ImageHashes,
  fileName?: string
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4 size
  const { width, height } = page.getSize();

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  let yPosition = height - 50;

  // Header
  page.drawText('AI Insight Pro', {
    x: 50,
    y: yPosition,
    size: 24,
    font: fontBold,
    color: rgb(0.2, 0.4, 1),
  });

  page.drawText('Authenticity Analysis Report', {
    x: 50,
    y: yPosition - 30,
    size: 14,
    font: fontOblique,
    color: rgb(0.3, 0.3, 0.3),
  });

  yPosition -= 80;

  // Overall Score
  const scoreColor =
    analysisResult.overall > 70
      ? rgb(1, 0.2, 0.2)
      : analysisResult.overall > 40
      ? rgb(1, 0.6, 0.2)
      : rgb(0.2, 0.8, 0.2);

  page.drawText('Overall AI Likelihood Score:', {
    x: 50,
    y: yPosition,
    size: 14,
    font: fontBold,
  });

  page.drawText(`${analysisResult.overall}%`, {
    x: 250,
    y: yPosition,
    size: 20,
    font: fontBold,
    color: scoreColor,
  });

  yPosition -= 50;

  // Categories
  page.drawText('Category Breakdown:', {
    x: 50,
    y: yPosition,
    size: 12,
    font: fontBold,
  });

  yPosition -= 25;

  page.drawText(`• Generative AI: ${analysisResult.categories.genai}%`, {
    x: 70,
    y: yPosition,
    size: 10,
    font: font,
  });

  yPosition -= 20;

  page.drawText(
    `• Face Manipulation: ${analysisResult.categories.faceManipulation}%`,
    {
      x: 70,
      y: yPosition,
      size: 10,
      font: font,
    }
  );

  yPosition -= 18;

  if (analysisResult.categories.bodyManipulation > 0) {
    page.drawText(
      `• Body Manipulation: ${analysisResult.categories.bodyManipulation}%`,
      {
        x: 70,
        y: yPosition,
        size: 10,
        font: font,
      }
    );
    yPosition -= 18;
  }

  if (analysisResult.categories.deepfake > 0) {
    page.drawText(
      `• Deepfake: ${analysisResult.categories.deepfake}%`,
      {
        x: 70,
        y: yPosition,
        size: 10,
        font: font,
      }
    );
    yPosition -= 18;
  }

  if (analysisResult.categories.inpainting > 0) {
    page.drawText(
      `• Inpainting: ${analysisResult.categories.inpainting}%`,
      {
        x: 70,
        y: yPosition,
        size: 10,
        font: font,
      }
    );
    yPosition -= 18;
  }

  if (analysisResult.categories.styleTransfer > 0) {
    page.drawText(
      `• Style Transfer: ${analysisResult.categories.styleTransfer}%`,
      {
        x: 70,
        y: yPosition,
        size: 10,
        font: font,
      }
    );
    yPosition -= 18;
  }

  yPosition -= 20;

  // Diffusion Models
  if (Object.keys(analysisResult.diffusion).length > 0) {
    page.drawText('Diffusion Models Detected:', {
      x: 50,
      y: yPosition,
      size: 12,
      font: fontBold,
    });

    yPosition -= 20;

    for (const [model, probability] of Object.entries(
      analysisResult.diffusion
    )) {
      if (probability > 0) {
        page.drawText(`• ${model}: ${probability}%`, {
          x: 70,
          y: yPosition,
          size: 10,
          font: font,
        });
        yPosition -= 18;
      }
    }

    yPosition -= 20;
  }

  // GAN Models
  if (Object.keys(analysisResult.gan).length > 0) {
    const ganEntries = Object.entries(analysisResult.gan).filter(
      ([, prob]) => prob > 0
    );
    if (ganEntries.length > 0) {
      page.drawText('GAN Models Detected:', {
        x: 50,
        y: yPosition,
        size: 12,
        font: fontBold,
      });

      yPosition -= 20;

      for (const [model, probability] of ganEntries) {
        page.drawText(`• ${model}: ${probability}%`, {
          x: 70,
          y: yPosition,
          size: 10,
          font: font,
        });
        yPosition -= 18;
      }

      yPosition -= 20;
    }
  }

  // LLM Models
  if (analysisResult.llm && Object.keys(analysisResult.llm).length > 0) {
    const llmEntries = Object.entries(analysisResult.llm).filter(
      ([, prob]) => prob > 0
    );
    if (llmEntries.length > 0) {
      page.drawText('LLM-based Generation Detected:', {
        x: 50,
        y: yPosition,
        size: 12,
        font: fontBold,
      });

      yPosition -= 20;

      for (const [model, probability] of llmEntries) {
        page.drawText(`• ${model}: ${probability}%`, {
          x: 70,
          y: yPosition,
          size: 10,
          font: font,
        });
        yPosition -= 18;
      }

      yPosition -= 20;
    }
  }

  // Manipulation Types
  if (analysisResult.manipulation && Object.keys(analysisResult.manipulation).length > 0) {
    const manipulationEntries = Object.entries(analysisResult.manipulation)
      .filter(([, prob]) => prob > 0)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10);
    
    if (manipulationEntries.length > 0) {
      page.drawText('Manipulation Types Detected:', {
        x: 50,
        y: yPosition,
        size: 12,
        font: fontBold,
      });

      yPosition -= 20;

      for (const [type, probability] of manipulationEntries) {
        page.drawText(`• ${type}: ${probability}%`, {
          x: 70,
          y: yPosition,
          size: 10,
          font: font,
        });
        yPosition -= 18;
      }

      yPosition -= 20;
    }
  }

  // Metadata Section
  yPosition -= 20;
  page.drawText('Image Metadata:', {
    x: 50,
    y: yPosition,
    size: 12,
    font: fontBold,
  });

  yPosition -= 20;

  if (metadata.make || metadata.model) {
    page.drawText(
      `Camera: ${metadata.make || ''} ${metadata.model || ''}`.trim(),
      {
        x: 70,
        y: yPosition,
        size: 10,
        font: font,
      }
    );
    yPosition -= 18;
  }

  if (metadata.date) {
    page.drawText(`Date: ${new Date(metadata.date).toLocaleString()}`, {
      x: 70,
      y: yPosition,
      size: 10,
      font: font,
    });
    yPosition -= 18;
  }

  if (metadata.gps) {
    page.drawText(`GPS: ${metadata.gps}`, {
      x: 70,
      y: yPosition,
      size: 10,
      font: font,
    });
    yPosition -= 18;
  }

  if (metadata.width && metadata.height) {
    page.drawText(`Dimensions: ${metadata.width} × ${metadata.height}`, {
      x: 70,
      y: yPosition,
      size: 10,
      font: font,
    });
    yPosition -= 18;
  }

  // Hashes Section
  if (hashes) {
    yPosition -= 20;
    page.drawText('Image Hashes:', {
      x: 50,
      y: yPosition,
      size: 12,
      font: fontBold,
    });

    yPosition -= 20;

    if (hashes.md5) {
      page.drawText(`MD5: ${hashes.md5}`, {
        x: 70,
        y: yPosition,
        size: 9,
        font: font,
        color: rgb(0.4, 0.4, 0.4),
      });
      yPosition -= 16;
    }

    if (hashes.sha256) {
      page.drawText(`SHA256: ${hashes.sha256}`, {
        x: 70,
        y: yPosition,
        size: 9,
        font: font,
        color: rgb(0.4, 0.4, 0.4),
      });
      yPosition -= 16;
    }

    if (hashes.perceptual) {
      page.drawText(`Perceptual Hash: ${hashes.perceptual}`, {
        x: 70,
        y: yPosition,
        size: 9,
        font: font,
        color: rgb(0.4, 0.4, 0.4),
      });
      yPosition -= 16;
    }
  }

  // File Name
  if (fileName) {
    yPosition -= 10;
    page.drawText(`File: ${fileName}`, {
      x: 50,
      y: yPosition,
      size: 9,
      font: font,
      color: rgb(0.5, 0.5, 0.5),
    });
  }

  // Footer
  const footerY = 50;
  page.drawText(
    `Generated: ${new Date().toLocaleString()}`,
    {
      x: 50,
      y: footerY,
      size: 8,
      font: font,
      color: rgb(0.5, 0.5, 0.5),
    }
  );

  page.drawText(
    'AI Insight Pro - Professional AI-Image Authenticity Analyzer',
    {
      x: 300,
      y: footerY,
      size: 8,
      font: font,
      color: rgb(0.5, 0.5, 0.5),
    }
  );

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}


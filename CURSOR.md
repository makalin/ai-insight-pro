## ⚙️ **App Overview — “AI Insight Pro”**

### 🔍 Core Features

1. **Photo Upload & Preview**

   * Drag-and-drop or click to upload.
   * Supports JPEG, PNG, WEBP, HEIC.
   * Instant preview.

2. **AI Detection Engine**

   * Uses multiple models (mock or real API options):

     * ✅ `Diffusion` (Stable Diffusion, Midjourney, DALL-E, Firefly, etc.)
     * ✅ `GAN` (StyleGAN, BigGAN)
     * ✅ `LLM signature` (e.g., GPT-4o, Flux)
     * ✅ `Face manipulation`, `Deepfake`, `Body morph`
     * ✅ `Metadata inspection` (EXIF, XMP)

3. **Professional Report Output**

   * Auto-generate full report after upload.
   * Overall “AI likelihood” score.
   * Breakdown by generation model.
   * Downloadable **PDF report** (with branding + summary table).

4. **Extra Tools**

   * 🧠 Metadata viewer (EXIF, ICC profile)
   * 🌐 Reverse image search (optional API)
   * 🔗 Image hash + blockchain verification (planned)
   * 📊 Confidence chart visualization (Radar / Bar charts)
   * ☁️ REST API endpoint for third-party integration

---

## 🧩 **Tech Stack**

| Layer             | Technology                                                   |
| ----------------- | ------------------------------------------------------------ |
| Frontend          | **Next.js 14**, React 18, TypeScript, TailwindCSS            |
| Backend           | Next.js API Routes (Node.js)                                 |
| Charts            | `recharts` or `chart.js`                                     |
| File handling     | Browser File API + Cloud storage (optional S3 or Cloudinary) |
| Report generation | `pdf-lib` or `jspdf`                                         |
| Optional AI APIs  | Hugging Face, Sightengine, HiveAI, or custom model endpoints |

---

## 🧱 **New Project Structure (added to your base app)**

```
ai-insight-pro/
 ├── app/
 │   ├── api/
 │   │   ├── analyze/route.ts
 │   │   ├── metadata/route.ts
 │   │   └── report/route.ts
 │   ├── components/
 │   │   ├── ProgressBar.tsx
 │   │   ├── ChartView.tsx
 │   │   ├── MetadataView.tsx
 │   │   └── ReportCard.tsx
 │   ├── layout.tsx
 │   └── page.tsx
 ├── lib/
 │   ├── analysis.ts
 │   ├── metadata.ts
 │   └── pdf.ts
 ├── public/
 │   └── logo.png
 ├── styles/
 │   └── globals.css
 ├── package.json
 └── README.md
```

---

## 🧠 **Pro Features To Add in Code**

### 1. Analysis Engine (`lib/analysis.ts`)

```ts
export async function analyzeImage(file: File) {
  // Use your own or 3rd party API
  // Here is a mocked logic:
  return {
    overall: 97,
    categories: { genai: 97, faceManipulation: 5 },
    diffusion: { 'Stable Diffusion': 65, MidJourney: 20, 'Dall-E': 7, Other: 5 },
    gan: { StyleGAN: 3, BigGAN: 1 },
    other: { 'Face manipulation': 5, 'Metadata hint': 2 },
  };
}
```

### 2. Metadata Extraction (`lib/metadata.ts`)

```ts
import exifr from 'exifr';

export async function extractMetadata(file: File) {
  const data = await exifr.parse(file);
  return {
    make: data.Make,
    model: data.Model,
    date: data.DateTimeOriginal,
    GPS: data.GPSLatitude ? `${data.GPSLatitude}, ${data.GPSLongitude}` : null,
  };
}
```

### 3. PDF Report Generator (`lib/pdf.ts`)

```ts
import { PDFDocument, rgb } from 'pdf-lib';

export async function generateReport(result, metadata) {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595, 842]);
  const { width, height } = page.getSize();
  page.drawText('AI Insight Pro Report', { x: 50, y: height - 50, size: 22, color: rgb(0, 0.3, 1) });
  page.drawText(`Overall Likelihood: ${result.overall}%`, { x: 50, y: height - 100 });
  page.drawText(`Camera: ${metadata.make || '-'} ${metadata.model || '-'}`, { x: 50, y: height - 130 });
  const pdfBytes = await pdf.save();
  return pdfBytes;
}
```

---

## 🎨 **UI Additions**

* **ChartView.tsx** → radar/bar graph visualizations.
* **MetadataView.tsx** → EXIF details.
* **ReportCard.tsx** → summarizing AI detection probabilities.

---

## 🚀 **Deployment**

* Local run: `npm run dev`
* Production: Vercel / Netlify / Docker
* Optional database (for uploads): PostgreSQL / Supabase

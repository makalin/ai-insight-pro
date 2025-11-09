# 🧠 AI Insight Pro  
**Professional AI-Image Authenticity Analyzer**

![AI Insight Pro Banner](public/banner.png)

AI Insight Pro is a Next.js-based web app that analyzes uploaded photos to estimate the likelihood that they were **AI-generated or manipulated**.  
It produces an interactive dashboard with detailed confidence metrics, metadata analysis, and a downloadable PDF authenticity report.

---

## 🚀 Features

| Category | Description |
|-----------|--------------|
| 🖼️ **Image Upload & Preview** | Drag-and-drop or file-picker upload with instant preview |
| 🔍 **AI Detection Engine** | Detects diffusion models (Stable Diffusion, Midjourney, DALL-E etc.), GANs, and face manipulations |
| 🧩 **Metadata Analysis** | Reads EXIF / XMP / ICC info (camera, GPS, date, orientation) |
| 📊 **Visual Dashboard** | Interactive bar and radar charts for model probabilities |
| 🧾 **PDF Report Export** | Generate and download a branded authenticity report |
| 🔗 **REST API Access** | `/api/analyze`, `/api/metadata`, `/api/report` endpoints |
| ☁️ **Integrations (optional)** | Hugging Face / Sightengine / HiveAI / Custom Models |

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-------------|
| Frontend | **Next.js 14**, **React 18**, **TypeScript**, **Tailwind CSS** |
| Backend | **Next.js API Routes (Node.js)** |
| Charts | `recharts` or `chart.js` |
| Reports | `pdf-lib` or `jspdf` |
| Metadata | `exifr` |
| Deployment | Vercel / Docker / Netlify |

---

## 📂 Project Structure

```

ai-insight-pro/
├── app/
│   ├── api/
│   │   ├── analyze/route.ts      # AI-detection API
│   │   ├── metadata/route.ts     # EXIF metadata API
│   │   └── report/route.ts       # PDF report generator
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
│   ├── logo.png
│   └── banner.png
├── styles/globals.css
├── package.json
└── README.md

````

---

## 🧰 Installation

```bash
# clone
git clone https://github.com/makalin/ai-insight-pro.git
cd ai-insight-pro

# install deps
npm install         # or yarn / pnpm install

# run locally
npm run dev
# open http://localhost:3000
````

---

## 🔬 API Endpoints

### `POST /api/analyze`

Analyzes uploaded image and returns probability data.

```json
{
  "overall": 97,
  "categories": { "genai": 97, "faceManipulation": 5 },
  "diffusion": { "Stable Diffusion": 65, "MidJourney": 20 },
  "gan": { "StyleGAN": 3 },
  "other": { "Face manipulation": 5 }
}
```

### `POST /api/metadata`

Returns EXIF metadata extracted from the image.

### `POST /api/report`

Generates and streams a PDF authenticity report.

---

## 🧠 Example Usage

1. **Upload Image** → drag into the upload box
2. **Click “Analyze”** → AI model predictions appear
3. **View Metadata** → camera, GPS, and EXIF info
4. **Download PDF Report** → click “Export Report”

![Dashboard Screenshot](public/screenshot.png)

---

## 🧩 Integration Options

| Provider     | Endpoint                                          | Notes                           |
| ------------ | ------------------------------------------------- | ------------------------------- |
| Hugging Face | `https://api-inference.huggingface.co/models/...` | custom models                   |
| Sightengine  | `https://api.sightengine.com/1.0/check.json`      | production-grade API            |
| HiveAI       | `https://api.thehive.ai/api/v2/task/sync`         | commercial deepfake detector    |
| Custom       | `/api/analyze`                                    | plug in your own model pipeline |

---

## 🧾 PDF Report

The report includes:

* Image preview
* AI likelihood score
* Model probability breakdown
* Metadata summary
* Timestamp and verification hash

---

## ⚡ Deployment

```bash
# build for production
npm run build
npm start
```

* **Vercel** → zero-config deploy (`vercel deploy`)
* **Docker**

  ```bash
  docker build -t ai-insight-pro .
  docker run -p 3000:3000 ai-insight-pro
  ```

---

## 🛡️ License

MIT © 2025 Mehmet T. Akalın
Use freely for research or educational purposes. Attribution appreciated.

---

## 🧭 Roadmap

* [ ] Real AI detector API integration
* [ ] Batch analysis mode
* [ ] Blockchain signature verification
* [ ] Multi-language UI (TR / EN / DE)
* [ ] Mobile app version (React Native)
* [ ] AI video analysis (beta)

---

**Created by [Mehmet T. Akalın](https://github.com/makalin) — 2025**
🌐 *“Detecting reality, one pixel at a time.”*

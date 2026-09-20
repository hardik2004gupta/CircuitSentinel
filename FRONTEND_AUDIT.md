# CircuitSentinel Frontend Audit

## Current Architecture

### Pages
- `pages/Home.jsx` — Single page rendering Navbar + UploadCard. No routing.

### Components
| Component | Role |
|-----------|------|
| `Navbar.jsx` | Top bar with product name |
| `UploadCard.jsx` | Master orchestrator: state management, upload logic, layout |
| `UploadBox.jsx` | Click-to-upload file input |
| `WebcamCapture.jsx` | Webcam preview + capture |
| `DetectionTable.jsx` | Detection results table |
| `SummaryCards.jsx` | 4 stat cards (defects, status, model, filename) |
| `InspectionReport.jsx` | Full report view with analysis data |
| `DownloadReportButton.jsx` | PDF generator via jsPDF + jspdf-autotable |
| `Loading.jsx` | Unused loading component |
| `ImagePreview.jsx` | Unused component |
| `Footer.jsx` | Footer bar |

### Services
- `services/api.js` — Axios instance pointing to Railway production backend

### API Contracts (must preserve)
**POST /predict**
- Input: FormData with `file` (JPG/JPEG/PNG)
- Returns:
```json
{
  "status": "success",
  "filename": "pcb.jpg",
  "total_detections": 6,
  "detections": [{ "type": "open_circuit", "confidence": 0.974, "bbox": [x1,y1,x2,y2] }],
  "result_image_url": "https://...railway.app/results/pcb_result.jpg",
  "analysis": {
    "inspection_id": "PCB-20260720-123456",
    "timestamp": "20 Jul 2026, 12:34 PM",
    "filename": "pcb.jpg",
    "total_defects": 6,
    "highest_confidence": 97.4,
    "average_confidence": 85.2,
    "distribution": { "open_circuit": 2, "short": 1 },
    "inspection_status": "PASS | MANUAL INSPECTION | FAIL",
    "recommendation": "...",
    "observations": ["...", "..."]
  }
}
```

**GET /health** — `{ status, model_loaded, version, classes }`
**GET /model-info** — `{ model_path, classes }`

### State Flow (UploadCard.jsx)
1. `file` / `preview` — set by UploadBox or WebcamCapture
2. `loading` — set during API call
3. `result` — set from API response
4. `showWebcam` — toggle for camera view
5. Webcam: base64 capture → Blob → File → same upload flow

### Existing Working Features
- File upload (click to browse)
- Drag & drop NOT implemented (only click to browse)
- Webcam capture
- POST /predict API call
- Side-by-side original + annotated image display
- Detection table with confidence badges
- Summary cards (4 stats)
- Inspection report (analysis data)
- PDF download via jsPDF
- Annotated image download
- Toast notifications (react-toastify)
- Basic mobile layout (flex-direction: column on <768px)

---

## UI Problems Identified

### Visual Issues
1. **Generic light theme** — white cards on light grey background, generic blue buttons
2. **No design system** — magic hex values (#2563eb, #16a34a, #94a3b8) scattered across 10 CSS files
3. **Emoji as UI elements** — 📷 📋 ✅ ✓ used throughout (inaccessible, unprofessional)
4. **Inconsistent typography** — mix of px sizes with no scale; 40px navbar, 40px upload-title, 30px image-title, 32px result-title — no hierarchy
5. **Weak upload box** — basic styled label, no drag-and-drop, no progress states
6. **No empty state** — page loads with blank center (only upload button visible)
7. **No loading animation** — just spinner icon on button text
8. **Poor image viewer** — two side-by-side images at fixed 420px; no zoom, no proper overlay system
9. **Detection table** — plain HTML table, no selected state, doesn't interact with image viewer
10. **Bounding boxes not rendered on original image** — despite bbox data being available in API response
11. **Camera UI** — basic webcam preview with no framing guides or technical overlay
12. **No error states** — only toast errors; no inline error feedback
13. **Duplicate media queries** — two identical `@media (max-width: 768px)` in UploadCard.css
14. **Unused components** — `Loading.jsx` and `ImagePreview.jsx` imported nowhere
15. **Duplicate CSS files** — `Footer.css` exists in both `components/` and `styles/`
16. **`var(--primary)` and `var(--secondary)` used but never defined** in index.css
17. **Card hover lifts entire card** — `transform: translateY(-4px)` on upload-card hover is distracting
18. **ToastContainer theme="light"** — incompatible with planned dark theme

### Accessibility Issues
- No aria-labels on icon-only interactions
- No focus ring styles
- Emoji used as icons (no text alternatives)
- `<input type="file">` not visually hidden properly

### Responsiveness
- Mobile layout exists but is just column stacking
- No tablet breakpoint
- Navbar text 40px too large on mobile (reduced to 24px but still large)
- No consideration for touch targets

---

## Redesign Plan

### Design System
**Background:** #080A0A primary, #0D1010 secondary, #121616 surface, #171C1C elevated  
**Text:** #F2F3EF primary, #A7ADA8 secondary, #6F7772 muted  
**Border:** rgba(255,255,255,0.08) subtle, rgba(255,255,255,0.14) medium  
**Accent:** #D7FF4F (used sparingly — only for CTA highlights)  
**Status:** #65D391 success, #E7B85A warning, #FF625C danger  
**Fonts:** Inter (UI) + IBM Plex Mono (technical data)

### New Component Architecture
```
src/
├── index.css              ← full design system (CSS variables + global)
├── App.jsx                ← shell with dark ToastContainer
├── pages/
│   └── Home.jsx           ← hero + InspectionWorkspace
├── components/
│   ├── Header.jsx         ← top navigation bar (replaces Navbar)
│   ├── InspectionWorkspace.jsx ← orchestrator (replaces UploadCard)
│   ├── UploadZone.jsx     ← drag-drop zone (replaces UploadBox)
│   ├── WebcamCapture.jsx  ← industrial camera UI (redesigned)
│   ├── PCBViewer.jsx      ← image viewer: original/detection toggle + bbox overlay
│   ├── DetectionList.jsx  ← detection rows with interactive selection (replaces DetectionTable)
│   ├── InspectionSummary.jsx ← stat panel (replaces SummaryCards)
│   ├── AnalysisState.jsx  ← loading animation (replaces Loading)
│   ├── ReportPanel.jsx    ← report + PDF (replaces InspectionReport + DownloadReportButton)
│   └── Footer.jsx         ← minimal footer (redesigned)
```

### Page Architecture
- **Hero section** — product name, tagline, visual PCB-inspired graphic, two CTAs
- **Inspection workspace** — source selector → PCB viewer → results (inline, no scroll-to-results needed)

### Animation Strategy
- CSS transitions only (no Framer Motion — not in dependencies)
- 150–200ms for UI state changes
- 300ms for panel reveals
- SVG scan line animation during analysis
- Fade-in for results appearance

### Responsive Strategy
- Desktop (≥1024px): PCB viewer + detection panel side by side
- Tablet (768–1023px): stacked, full width
- Mobile (<768px): single column, prioritize image then detections

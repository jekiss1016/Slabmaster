import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execFileSync } from 'child_process';
import { marked } from '../frontend/node_modules/marked/lib/marked.esm.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const EDGE_PATH = fs.existsSync('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe')
  ? 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
  : 'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe';

const DOCUMENTS_DIR = path.join(rootDir, 'documents');

// Subfolder structure definition
const DOCS_CONFIG = [
  {
    folder: '01_Executive_and_Strategy',
    title: 'Executive & Strategy',
    items: [
      {
        source: path.join(rootDir, 'docs', 'executive_summary.md'),
        targetName: 'executive_summary',
        type: 'md',
        title: 'Executive Summary',
        category: 'Executive & Strategy'
      },
      {
        source: path.join(rootDir, 'docs', 'SlabMaster_Operational_Architecture_and_Strategic_Roadmap.md'),
        targetName: 'SlabMaster_Operational_Architecture_and_Strategic_Roadmap',
        type: 'md',
        title: 'Operational Architecture & Strategic Roadmap',
        category: 'Executive & Strategy'
      }
    ]
  },
  {
    folder: '02_Specifications',
    title: 'Functional & Technical Specifications',
    items: [
      {
        source: path.join(rootDir, 'docs', 'functional_spec.md'),
        targetName: 'functional_spec',
        type: 'md',
        title: 'Functional Specification',
        category: 'Specifications'
      },
      {
        source: path.join(rootDir, 'docs', 'technical_spec.md'),
        targetName: 'technical_spec',
        type: 'md',
        title: 'Technical Specification & Architecture',
        category: 'Specifications'
      }
    ]
  },
  {
    folder: '03_Subscriber_Guides',
    title: 'Subscriber & Operational Guides',
    items: [
      {
        source: path.join(rootDir, 'docs', 'subscriber_onboarding_guide.md'),
        targetName: 'subscriber_onboarding_guide',
        type: 'md',
        title: 'New Subscriber Onboarding Checklist & Setup Guide',
        category: 'Subscriber Guides'
      },
      {
        source: path.join(rootDir, 'frontend', 'public', 'help.html'),
        targetName: 'user_help_guide',
        type: 'html',
        title: 'SlabMaster User Guide & Help Documentation',
        category: 'Subscriber Guides'
      }
    ]
  },
  {
    folder: '04_Competitive_Analysis',
    title: 'Competitive Analysis & Moraware Parity',
    items: [
      {
        source: path.join(rootDir, 'docs', 'moraware_feature_inventory.md'),
        targetName: 'moraware_feature_inventory',
        type: 'md',
        title: 'Moraware Live Crawled Feature Inventory',
        category: 'Competitive Analysis'
      },
      {
        source: path.join(rootDir, 'docs', 'SlabMaster_vs_Moraware_Customer_Feature_Comparison.md'),
        targetName: 'SlabMaster_vs_Moraware_Customer_Feature_Comparison',
        type: 'md',
        title: 'SlabMaster vs. Moraware Feature Comparison',
        category: 'Competitive Analysis'
      },
      {
        source: path.join(rootDir, 'docs', 'SlabMaster_vs_Moraware_Customer_Feature_Comparison.html'),
        targetName: 'SlabMaster_vs_Moraware_Customer_Feature_Comparison',
        type: 'raw_html',
        title: 'SlabMaster vs. Moraware Comparison Deck (HTML)',
        category: 'Competitive Analysis'
      },
      {
        source: path.join(rootDir, 'docs', 'moraware_crawled_features.json'),
        targetName: 'moraware_crawled_features',
        type: 'json',
        title: 'Moraware Crawled Raw Features Dataset',
        category: 'Competitive Analysis'
      }
    ]
  },
  {
    folder: '05_API_and_Integration',
    title: 'API, Integration & Postman Pack',
    items: [
      {
        source: path.join(rootDir, 'frontend', 'public', 'api-docs.html'),
        targetName: 'api_docs',
        type: 'html',
        title: 'REST API & SAP S/4HANA Developer Integration Pack',
        category: 'API & Integration'
      },
      {
        source: path.join(rootDir, 'frontend', 'public', 'slabmaster_postman_collection.json'),
        targetName: 'slabmaster_postman_collection',
        type: 'json',
        title: 'Official SlabMaster Postman Collection v2.1',
        category: 'API & Integration'
      }
    ]
  },
  {
    folder: '06_Quality_and_Testing',
    title: 'Quality Assurance & Test Suite',
    items: [
      {
        source: path.join(rootDir, 'docs', 'test_suite_summary.md'),
        targetName: 'test_suite_summary',
        type: 'md',
        title: 'Automated Test Suite Summary & Verification',
        category: 'Quality & Testing'
      }
    ]
  }
];

function wrapHtmlForPrint(htmlContent, title, category) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${title} | SlabMaster</title>
  <style>
    @page {
      size: letter;
      margin: 0.75in;
    }
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a;
      background: #ffffff;
      line-height: 1.6;
      font-size: 10.5pt;
      padding: 0;
    }
    .print-header {
      border-bottom: 2px solid #2563eb;
      padding-bottom: 8px;
      margin-bottom: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .print-header .brand {
      font-size: 13pt;
      font-weight: 800;
      color: #2563eb;
      letter-spacing: -0.02em;
    }
    .print-header .category {
      font-size: 9pt;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-weight: 700;
      color: #64748b;
      background: #f1f5f9;
      padding: 3px 8px;
      border-radius: 4px;
    }
    h1 {
      font-size: 20pt;
      font-weight: 800;
      color: #0f172a;
      margin-top: 0;
      margin-bottom: 12px;
      line-height: 1.25;
      letter-spacing: -0.02em;
    }
    h2 {
      font-size: 14pt;
      font-weight: 700;
      color: #1e293b;
      margin-top: 20px;
      margin-bottom: 8px;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 4px;
      page-break-after: avoid;
    }
    h3 {
      font-size: 11.5pt;
      font-weight: 700;
      color: #334155;
      margin-top: 14px;
      margin-bottom: 6px;
      page-break-after: avoid;
    }
    p {
      margin-bottom: 10px;
      color: #334155;
    }
    ul, ol {
      margin-bottom: 12px;
      padding-left: 24px;
      color: #334155;
    }
    li {
      margin-bottom: 4px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 14px 0;
      font-size: 9pt;
      page-break-inside: avoid;
    }
    th, td {
      border: 1px solid #cbd5e1;
      padding: 6px 10px;
      text-align: left;
    }
    th {
      background: #f1f5f9;
      font-weight: 700;
      color: #0f172a;
    }
    tr:nth-child(even) td {
      background: #f8fafc;
    }
    pre {
      background: #0f172a;
      color: #f8fafc;
      padding: 12px;
      border-radius: 6px;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 8.5pt;
      overflow-x: auto;
      margin: 12px 0;
      line-height: 1.45;
      page-break-inside: avoid;
      white-space: pre-wrap;
      word-break: break-word;
    }
    code {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 9pt;
      background: #f1f5f9;
      color: #0f172a;
      padding: 2px 4px;
      border-radius: 3px;
    }
    pre code {
      background: transparent;
      color: inherit;
      padding: 0;
    }
    blockquote {
      border-left: 4px solid #2563eb;
      background: #eff6ff;
      padding: 8px 12px;
      margin: 12px 0;
      color: #1e3a8a;
      border-radius: 0 4px 4px 0;
      page-break-inside: avoid;
    }
    hr {
      border: none;
      border-top: 1px solid #e2e8f0;
      margin: 20px 0;
    }
    .print-footer {
      margin-top: 32px;
      border-top: 1px solid #cbd5e1;
      padding-top: 8px;
      display: flex;
      justify-content: space-between;
      font-size: 8pt;
      color: #94a3b8;
    }
  </style>
</head>
<body>
  <div class="print-header">
    <div class="brand">📐 SlabMaster Enterprise | v1.0.0</div>
    <div class="category">${category}</div>
  </div>

  <main>
    ${htmlContent}
  </main>

  <div class="print-footer">
    <span>© 2026 SlabMaster | v1.0.0 — Confidential & Proprietary</span>
    <span>Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
  </div>
</body>
</html>`;
}

function convertHtmlFileToPrintFriendly(sourceHtmlPath, title, category) {
  let rawHtml = fs.readFileSync(sourceHtmlPath, 'utf8');

  // If already full document, inject print optimization styles
  const printStyles = `
    <style>
      @page { size: letter; margin: 0.7in; }
      body { background: #ffffff !important; color: #0f172a !important; }
      header { position: static !important; background: transparent !important; border-bottom: 2px solid #2563eb !important; padding: 10px 0 !important; }
      nav.sidebar { display: none !important; }
      main.content { padding: 0 !important; max-width: 100% !important; }
      .layout { display: block !important; }
      .card { background: #ffffff !important; border: 1px solid #cbd5e1 !important; break-inside: avoid; margin-bottom: 15px !important; }
      table { border-collapse: collapse !important; width: 100% !important; font-size: 8.5pt !important; }
      th, td { border: 1px solid #cbd5e1 !important; padding: 5px 8px !important; color: #0f172a !important; }
      th { background: #f1f5f9 !important; }
      pre { background: #0f172a !important; color: #f8fafc !important; font-size: 8pt !important; break-inside: avoid; }
      a { color: #2563eb !important; text-decoration: none !important; }
      footer { border-top: 1px solid #cbd5e1 !important; font-size: 8pt !important; color: #64748b !important; padding: 10px 0 !important; }
    </style>
  `;

  if (rawHtml.includes('</head>')) {
    return rawHtml.replace('</head>', `${printStyles}\n</head>`);
  } else {
    return wrapHtmlForPrint(rawHtml, title, category);
  }
}

async function run() {
  console.log('=== SlabMaster Document Organization & PDF Generation ===');

  if (!fs.existsSync(DOCUMENTS_DIR)) {
    fs.mkdirSync(DOCUMENTS_DIR, { recursive: true });
  }

  const generatedList = [];

  for (const group of DOCS_CONFIG) {
    const groupDir = path.join(DOCUMENTS_DIR, group.folder);
    if (!fs.existsSync(groupDir)) {
      fs.mkdirSync(groupDir, { recursive: true });
    }

    console.log(`\n📁 Processing Category: ${group.title} (${group.folder})`);

    for (const item of group.items) {
      if (!fs.existsSync(item.source)) {
        console.warn(`  ⚠️ Warning: Source not found: ${item.source}`);
        continue;
      }

      console.log(`  📄 Processing: ${item.title}`);

      let targetFilePath;
      let pdfFilePath = null;

      if (item.type === 'md') {
        targetFilePath = path.join(groupDir, `${item.targetName}.md`);
        pdfFilePath = path.join(groupDir, `${item.targetName}.pdf`);

        // Copy source markdown
        fs.copyFileSync(item.source, targetFilePath);

        // Convert MD to styled HTML
        const mdContent = fs.readFileSync(item.source, 'utf8');
        const bodyHtml = marked(mdContent);
        const fullHtml = wrapHtmlForPrint(bodyHtml, item.title, item.category);

        const tempHtmlPath = path.join(groupDir, `_temp_${item.targetName}.html`);
        fs.writeFileSync(tempHtmlPath, fullHtml, 'utf8');

        // Generate PDF via Headless Edge
        try {
          execFileSync(EDGE_PATH, [
            '--headless=new',
            '--disable-gpu',
            '--no-pdf-header-footer',
            `--print-to-pdf=${pdfFilePath}`,
            `file:///${tempHtmlPath.replace(/\\/g, '/')}`
          ]);
          console.log(`     ✅ Generated PDF: ${path.basename(pdfFilePath)} (${(fs.statSync(pdfFilePath).size / 1024).toFixed(1)} KB)`);
        } catch (err) {
          console.error(`     ❌ Error generating PDF for ${item.title}:`, err.message);
        } finally {
          if (fs.existsSync(tempHtmlPath)) {
            fs.unlinkSync(tempHtmlPath);
          }
        }
      } else if (item.type === 'html' || item.type === 'raw_html') {
        targetFilePath = path.join(groupDir, `${item.targetName}.html`);
        pdfFilePath = path.join(groupDir, `${item.targetName}.pdf`);

        // Copy source HTML
        fs.copyFileSync(item.source, targetFilePath);

        // Prepare print-friendly version
        const printHtml = convertHtmlFileToPrintFriendly(item.source, item.title, item.category);
        const tempHtmlPath = path.join(groupDir, `_temp_${item.targetName}.html`);
        fs.writeFileSync(tempHtmlPath, printHtml, 'utf8');

        // Generate PDF
        try {
          execFileSync(EDGE_PATH, [
            '--headless=new',
            '--disable-gpu',
            '--no-pdf-header-footer',
            `--print-to-pdf=${pdfFilePath}`,
            `file:///${tempHtmlPath.replace(/\\/g, '/')}`
          ]);
          console.log(`     ✅ Generated PDF: ${path.basename(pdfFilePath)} (${(fs.statSync(pdfFilePath).size / 1024).toFixed(1)} KB)`);
        } catch (err) {
          console.error(`     ❌ Error generating PDF for ${item.title}:`, err.message);
        } finally {
          if (fs.existsSync(tempHtmlPath)) {
            fs.unlinkSync(tempHtmlPath);
          }
        }
      } else if (item.type === 'json') {
        targetFilePath = path.join(groupDir, `${item.targetName}.json`);
        fs.copyFileSync(item.source, targetFilePath);
        console.log(`     ✅ Copied Dataset: ${path.basename(targetFilePath)}`);
      }

      generatedList.push({
        category: group.title,
        folder: group.folder,
        title: item.title,
        sourceExt: path.extname(targetFilePath),
        fileName: path.basename(targetFilePath),
        hasPdf: pdfFilePath && fs.existsSync(pdfFilePath),
        pdfName: pdfFilePath ? path.basename(pdfFilePath) : null,
        pdfSizeKb: pdfFilePath && fs.existsSync(pdfFilePath) ? (fs.statSync(pdfFilePath).size / 1024).toFixed(1) : null
      });
    }
  }

  // Generate Master README.md in documents/
  console.log('\n📚 Generating Master Index README.md in documents/ ...');
  let readme = `# SlabMaster Document Repository & Publication Archive

This directory organizes all official strategic, architectural, functional, technical, operational, competitive, and API integration documentation for **SlabMaster Enterprise**.

Each document is maintained in its native editable source format (\`.md\` or \`.html\`) alongside a publication-grade, print-optimized **PDF version** for distribution to executives, operations leaders, field teams, and external integration developers.

---

## Document Directory & Subfolder Structure

`;

  let currentCategory = '';
  for (const doc of generatedList) {
    if (doc.category !== currentCategory) {
      currentCategory = doc.category;
      readme += `### 📁 [${doc.category}](./${doc.folder})\n\n`;
      readme += `| Document Title | Source Format | PDF Publication | Size |\n`;
      readme += `| :--- | :--- | :--- | :--- |\n`;
    }

    const sourceLink = `[\`${doc.fileName}\`](./${doc.folder}/${doc.fileName})`;
    const pdfLink = doc.hasPdf ? `[\`📄 ${doc.pdfName}\`](./${doc.folder}/${doc.pdfName})` : '—';
    const size = doc.hasPdf ? `${doc.pdfSizeKb} KB` : 'Data file';

    readme += `| **${doc.title}** | ${sourceLink} | ${pdfLink} | ${size} |\n`;
    if (generatedList.indexOf(doc) === generatedList.length - 1 || generatedList[generatedList.indexOf(doc) + 1].category !== currentCategory) {
      readme += `\n`;
    }
  }

  readme += `---

## Summary of Subfolders

1. **\`01_Executive_and_Strategy/\`**: High-level platform vision, strategic ROI roadmap, and executive briefing materials.
2. **\`02_Specifications/\`**: Complete system functional requirements, domain rules, technical architecture, and database schemas.
3. **\`03_Subscriber_Guides/\`**: Comprehensive New Subscriber Onboarding Checklist, Day-Zero Setup Guide, and the User Help Manual.
4. **\`04_Competitive_Analysis/\`**: Detailed Moraware parity matrix, crawling logs, feature gap comparisons, and raw datasets.
5. **\`05_API_and_Integration/\`**: SAP S/4HANA REST API developer pack with ABAP code samples, endpoints, and the Postman Collection v2.1.
6. **\`06_Quality_and_Testing/\`**: Automated test suite catalog, coverage metrics, and verification standards.

---
*© 2026 SlabMaster | v1.0.0 — Enterprise Countertop Fabrication & Field Dispatch Platform*
`;

  fs.writeFileSync(path.join(DOCUMENTS_DIR, 'README.md'), readme, 'utf8');
  console.log('✅ Master Index README.md created successfully!');
  console.log('\n🎉 All documents organized and PDFs generated successfully!\n');
}

run().catch(console.error);

// Font helper utility - for PDF Chinese character support
const fs = require('fs');
const path = require('path');

/**
 * Find available Chinese fonts in the system
 * @returns {string|null} Font path, returns null if not found
 */
function findChineseFont() {
  const fontPaths = [
    // Windows Chinese font paths (prefer .ttf files as PDFKit doesn't support .ttc)
    'C:/Windows/Fonts/simhei.ttf',           // SimHei (Black)
    'C:/Windows/Fonts/simkai.ttf',          // SimKai (Kai)
    'C:/Windows/Fonts/simli.ttf',            // SimLi (Li)
    'C:/Windows/Fonts/simsun.ttf',           // SimSun (Song, if exists)
    'C:/Windows/Fonts/STSONG.TTF',           // STSong (Chinese Song)
    'C:/Windows/Fonts/STKAITI.TTF',          // STKaiti (Chinese Kai)
    'C:/Windows/Fonts/STHEITI.TTF',          // STHeiti (Chinese Hei)
    'C:/Windows/Fonts/STFANGSO.TTF',         // STFangsong (Chinese Fangsong)
    // macOS Chinese font paths
    '/Library/Fonts/Arial Unicode.ttf',
    '/System/Library/Fonts/Supplemental/STHeiti Light.ttc',
    // Linux Chinese font paths
    '/usr/share/fonts/truetype/wqy/wqy-microhei.ttc',
    '/usr/share/fonts/truetype/wqy/wqy-zenhei.ttc',
    '/usr/share/fonts/truetype/arphic/uming.ttc',
    '/usr/share/fonts/truetype/arphic/ukai.ttc',
    '/usr/share/fonts/truetype/noto/NotoSansCJK-Regular.ttc',
  ];

  // Prefer .ttf files
  for (const fontPath of fontPaths) {
    if (fs.existsSync(fontPath)) {
      // Skip .ttc files as PDFKit doesn't support them
      if (fontPath.endsWith('.ttc')) {
        continue;
      }
      return fontPath;
    }
  }

  // If no .ttf found, try to find Chinese fonts in Windows font directory
  if (process.platform === 'win32') {
    const windowsFontDir = 'C:/Windows/Fonts';
    const chineseFontNames = [
      'simhei.ttf', 'simkai.ttf', 'simli.ttf', 'simsun.ttf',
      'STSONG.TTF', 'STKAITI.TTF', 'STHEITI.TTF', 'STFANGSO.TTF',
      'msyh.ttf', 'msyhbd.ttf', 'msyhl.ttf'
    ];
    
    for (const fontName of chineseFontNames) {
      const fontPath = path.join(windowsFontDir, fontName);
      if (fs.existsSync(fontPath)) {
        return fontPath;
      }
    }
  }

  return null;
}

/**
 * Register Chinese font to PDF document
 * @param {PDFDocument} doc - PDFKit document object
 * @param {string} fontName - Font name (optional, default 'ChineseFont')
 * @returns {string|null} Registered font name, returns null if failed
 */
function registerChineseFont(doc, fontName = 'ChineseFont') {
  const fontPath = findChineseFont();
  
  if (!fontPath) {
    console.warn('Chinese font not found, Chinese characters in PDF may display incorrectly');
    console.warn('Please install Chinese fonts or use a PDF generation library that supports Chinese');
    return null;
  }

  try {
    doc.registerFont(fontName, fontPath);
    console.log(`Chinese font registered: ${fontPath}`);
    return fontName;
  } catch (error) {
    console.warn('Font registration failed:', error.message);
    return null;
  }
}

/**
 * Check if font is available
 * @param {string} fontPath - Font path
 * @returns {boolean}
 */
function isFontAvailable(fontPath) {
  return fs.existsSync(fontPath);
}

module.exports = {
  findChineseFont,
  registerChineseFont,
  isFontAvailable,
};


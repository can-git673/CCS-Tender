import mammoth from 'mammoth';
import * as XLSX from 'xlsx';
import * as pdfjsLib from 'pdfjs-dist';

// 配置PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export interface ParsedDocument {
  text: string;
  metadata: {
    fileName: string;
    fileType: string;
    pageCount?: number;
    wordCount: number;
    language?: string;
  };
}

/**
 * 解析PDF文件
 */
export async function parsePDF(file: File): Promise<ParsedDocument> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  
  let fullText = '';
  const pageCount = pdf.numPages;
  
  for (let i = 1; i <= pageCount; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: any) => item.str)
      .join(' ');
    fullText += pageText + '\n';
  }
  
  return {
    text: fullText,
    metadata: {
      fileName: file.name,
      fileType: 'PDF',
      pageCount,
      wordCount: fullText.split(/\s+/).length,
      language: detectLanguage(fullText),
    },
  };
}

/**
 * 解析Word文档
 */
export async function parseWord(file: File): Promise<ParsedDocument> {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  const text = result.value;
  
  return {
    text,
    metadata: {
      fileName: file.name,
      fileType: 'Word',
      wordCount: text.split(/\s+/).length,
      language: detectLanguage(text),
    },
  };
}

/**
 * 解析Excel文件
 */
export async function parseExcel(file: File): Promise<ParsedDocument> {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });
  
  let fullText = '';
  workbook.SheetNames.forEach((sheetName) => {
    const worksheet = workbook.Sheets[sheetName];
    const sheetData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    const sheetText = sheetData
      .map((row: any) => row.join(' '))
      .join('\n');
    fullText += `Sheet: ${sheetName}\n${sheetText}\n\n`;
  });
  
  return {
    text: fullText,
    metadata: {
      fileName: file.name,
      fileType: 'Excel',
      wordCount: fullText.split(/\s+/).length,
      language: detectLanguage(fullText),
    },
  };
}

/**
 * 检测文本语言
 */
function detectLanguage(text: string): string {
  const chineseChars = text.match(/[\u4e00-\u9fa5]/g);
  const englishChars = text.match(/[a-zA-Z]/g);
  
  const chineseCount = chineseChars ? chineseChars.length : 0;
  const englishCount = englishChars ? englishChars.length : 0;
  
  if (chineseCount > englishCount) {
    return 'zh';
  } else if (englishCount > chineseCount) {
    return 'en';
  } else {
    return 'unknown';
  }
}

/**
 * 统一文件解析入口
 */
export async function parseFile(file: File): Promise<ParsedDocument> {
  const fileExtension = file.name.split('.').pop()?.toLowerCase();
  
  switch (fileExtension) {
    case 'pdf':
      return await parsePDF(file);
    case 'doc':
    case 'docx':
      return await parseWord(file);
    case 'xls':
    case 'xlsx':
      return await parseExcel(file);
    default:
      throw new Error(`Unsupported file type: ${fileExtension}`);
  }
}

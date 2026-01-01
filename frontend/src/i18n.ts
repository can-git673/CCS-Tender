import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  zh: {
    translation: {
      header: {
        subtitle: '招标文件智能分析系统',
      },
      upload: {
        title: '上传招标文件',
        description: '支持PDF、Word、Excel等多种格式,系统将自动识别语言并进行专业分析',
        dragText: '点击或拖拽文件到此区域上传',
        hint: '支持PDF、DOCX、XLSX等格式,单个文件不超过50MB',
      },
      progress: {
        uploading: '文件上传中...',
        analyzing: '深度分析中...',
      },
      analysis: {
        complete: '分析完成!',
        completeDesc: '招标文件已完成深度分析,您可以下载详细的PDF报告',
      },
      report: {
        generating: '正在生成报告...',
        download: '下载PDF报告',
      },
      footer: {
        motto: 'Build World-Class Networks for the Information Service',
      },
    },
  },
  en: {
    translation: {
      header: {
        subtitle: 'Intelligent Tender Document Analysis System',
      },
      upload: {
        title: 'Upload Tender Document',
        description: 'Supports PDF, Word, Excel and other formats. The system will automatically recognize the language and conduct professional analysis',
        dragText: 'Click or drag file to this area to upload',
        hint: 'Supports PDF, DOCX, XLSX formats, single file up to 50MB',
      },
      progress: {
        uploading: 'Uploading file...',
        analyzing: 'Deep analysis in progress...',
      },
      analysis: {
        complete: 'Analysis Complete!',
        completeDesc: 'The tender document has been thoroughly analyzed. You can download the detailed PDF report',
      },
      report: {
        generating: 'Generating report...',
        download: 'Download PDF Report',
      },
      footer: {
        motto: 'Build World-Class Networks for the Information Service',
      },
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'zh',
    fallbackLng: 'zh',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;

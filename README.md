# CCS-Tender - 招标文件智能分析系统

**China Comservice - Build World-Class Networks for the Information Service**

## 项目简介

CCS-Tender是一款专业的招标文件法务与商务条款智能分析桌面应用,专为China Comservice设计开发。该系统支持Windows 11操作系统,提供文件上传、智能分析、多语言切换、进度显示、提醒闹钟和PDF报告生成等全方位功能。

## 核心功能

### 1. 文件上传与解析
- 支持多种文件格式:PDF、Word(DOC/DOCX)、Excel(XLS/XLSX)
- 拖拽上传,操作简便
- 实时显示上传进度和耗时
- 自动文本提取和语言识别

### 2. 智能分析引擎
- 对接全球多个免费LLM API,自动切换确保服务稳定性
  - OpenAI GPT-4.1-mini
  - Google Gemini 2.5-flash
- 针对合同涉及国家法律进行专业分析
- 识别法务风险点和商务条款问题
- 实时显示分析进度

### 3. 多语言支持
- 中英文界面一键切换
- 自动识别上传文件语言
- 即时转换为通用语言进行分析

### 4. 专业报告生成
- 生成高质量PDF分析报告
- 中文字体嵌入,确保无乱码
- 数据支撑:图表、统计数据
- 图文并茂的专业排版
- 符合所在国家合同规范

### 5. 提醒功能
- 上传完成提醒闹钟
- 分析完成提醒闹钟
- 系统通知和音效提示

### 6. 数据可视化
- 风险严重程度分布饼图
- 风险类别统计柱状图
- 合规性评估雷达图

## 技术架构

### 前端技术栈
- **框架**: React 19 + TypeScript
- **UI组件库**: Ant Design 6.x
- **动画**: Framer Motion
- **国际化**: i18next + react-i18next
- **图表**: Recharts
- **构建工具**: Vite 7.x

### 桌面应用
- **框架**: Electron 39.x
- **打包工具**: electron-builder
- **支持平台**: Windows 11 (x64)

### 文件处理
- **PDF解析**: pdfjs-dist
- **Word解析**: mammoth
- **Excel解析**: xlsx

### AI分析
- **HTTP客户端**: axios
- **API集成**: OpenAI、Google Generative AI
- **自动切换**: 多API负载均衡

### PDF生成
- **库**: jsPDF
- **HTML转换**: html2canvas
- **中文支持**: 内嵌字体

## 安装与使用

### 开发环境要求
- Node.js 22.x
- pnpm 10.x
- Windows 11 (推荐)

### 安装依赖
```bash
cd frontend
pnpm install
```

### 开发模式运行
```bash
pnpm run electron:dev
```

### 构建Windows可执行文件
```bash
pnpm run package:win
```

构建完成后,可执行文件位于 `dist-electron` 目录:
- `CCS-Tender-1.0.0-Setup.exe` - 安装程序
- `CCS-Tender-1.0.0-Portable.exe` - 便携版

## 项目结构

```
CCS_Tender/
├── frontend/
│   ├── src/
│   │   ├── assets/          # 静态资源(LOGO等)
│   │   ├── services/        # 业务服务
│   │   │   ├── fileParser.ts      # 文件解析服务
│   │   │   ├── aiAnalyzer.ts      # AI分析服务
│   │   │   └── pdfGenerator.ts    # PDF生成服务
│   │   ├── App.tsx          # 主应用组件
│   │   ├── App.css          # 样式文件
│   │   ├── i18n.ts          # 国际化配置
│   │   └── main.tsx         # 入口文件
│   ├── electron/
│   │   └── main.ts          # Electron主进程
│   ├── package.json         # 项目配置
│   ├── electron-builder.json # 打包配置
│   └── vite.config.ts       # Vite配置
└── README.md                # 项目文档
```

## API配置

### 环境变量设置

在使用前,需要配置API密钥:

```bash
# Windows PowerShell
$env:OPENAI_API_KEY="your-openai-api-key"
$env:GEMINI_API_KEY="your-gemini-api-key"

# Windows CMD
set OPENAI_API_KEY=your-openai-api-key
set GEMINI_API_KEY=your-gemini-api-key
```

### API自动切换机制

系统内置多API自动切换功能:
1. 默认使用OpenAI API
2. 如果OpenAI失败,自动切换到Gemini
3. 确保服务高可用性

## 使用说明

### 1. 启动应用
双击 `CCS-Tender-1.0.0-Setup.exe` 安装,或直接运行便携版

### 2. 上传文件
- 点击上传区域选择文件
- 或直接拖拽文件到上传区域
- 支持PDF、Word、Excel格式

### 3. 等待分析
- 系统自动显示上传进度
- 上传完成后自动开始深度分析
- 分析进度实时显示

### 4. 下载报告
- 分析完成后收到提醒通知
- 点击"下载PDF报告"按钮
- 获取专业分析报告

### 5. 语言切换
- 点击右上角语言切换按钮
- 在中英文界面间切换

## 系统要求

### 最低配置
- 操作系统: Windows 11 (64位)
- 处理器: Intel Core i3 或同等级别
- 内存: 4GB RAM
- 硬盘空间: 500MB可用空间
- 网络: 稳定的互联网连接

### 推荐配置
- 操作系统: Windows 11 (64位)
- 处理器: Intel Core i5 或更高
- 内存: 8GB RAM或更高
- 硬盘空间: 1GB可用空间
- 网络: 高速互联网连接

## 注意事项

1. **API密钥**: 使用前请确保已配置有效的API密钥
2. **网络连接**: 分析功能需要稳定的网络连接
3. **文件大小**: 建议单个文件不超过50MB
4. **隐私保护**: 所有分析在本地处理,不上传敏感数据
5. **中文支持**: PDF报告已嵌入中文字体,确保无乱码

## 技术支持

如遇问题,请联系:
- 企业: China Comservice
- 项目: CCS-Tender
- 版本: 1.0.0

## 版权声明

© 2025 China Comservice. All rights reserved.

**Build World-Class Networks for the Information Service**

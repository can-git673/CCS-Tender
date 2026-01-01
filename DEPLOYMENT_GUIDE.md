# CCS-Tender 部署指南

**项目**: CCS-Tender 招标文件智能分析系统  
**版本**: 1.0.0  
**企业**: China Comservice

---

## 目录

1. [环境准备](#环境准备)
2. [源码部署](#源码部署)
3. [Windows应用打包](#windows应用打包)
4. [API配置](#api配置)
5. [故障排查](#故障排查)

---

## 环境准备

### 开发环境要求

| 软件 | 版本要求 | 说明 |
|------|---------|------|
| Node.js | 22.x | JavaScript运行环境 |
| pnpm | 10.x | 包管理器 |
| TypeScript | 5.9.x | 类型检查工具 |
| Git | 最新版 | 版本控制工具 |

### 安装Node.js

1. 访问 https://nodejs.org/
2. 下载Node.js 22.x LTS版本
3. 运行安装程序
4. 验证安装:
```bash
node --version
npm --version
```

### 安装pnpm

```bash
npm install -g pnpm
pnpm --version
```

---

## 源码部署

### 1. 获取源代码

```bash
# 如果使用Git
git clone <repository-url>
cd CCS_Tender

# 或解压源码包
tar -xzf CCS_Tender_Delivery.tar.gz
cd CCS_Tender
```

### 2. 安装依赖

```bash
cd frontend
pnpm install
```

预期输出:
```
Packages: +700
Done in 30s
```

### 3. 配置环境变量

#### Windows PowerShell (推荐)

```powershell
# 设置用户级环境变量
[System.Environment]::SetEnvironmentVariable("OPENAI_API_KEY", "sk-your-api-key", "User")
[System.Environment]::SetEnvironmentVariable("GEMINI_API_KEY", "your-gemini-api-key", "User")

# 验证设置
$env:OPENAI_API_KEY
$env:GEMINI_API_KEY
```

#### Windows CMD

```cmd
setx OPENAI_API_KEY "sk-your-api-key"
setx GEMINI_API_KEY "your-gemini-api-key"
```

#### 临时设置(仅当前会话)

```powershell
$env:OPENAI_API_KEY="sk-your-api-key"
$env:GEMINI_API_KEY="your-gemini-api-key"
```

### 4. 启动开发服务器

```bash
pnpm run electron:dev
```

预期输出:
```
VITE v7.3.0  ready in 500 ms
➜  Local:   http://localhost:5173/
Electron app started
```

### 5. 验证功能

1. 应用窗口自动打开
2. 界面显示正常
3. 点击语言切换按钮测试
4. 尝试上传测试文件

---

## Windows应用打包

### 1. 构建前端资源

```bash
cd frontend
pnpm run build
```

预期输出:
```
✓ built in 5s
dist/index.html                   0.50 kB
dist/assets/index-xxx.js        500.00 kB
```

### 2. 编译Electron主进程

```bash
tsc electron/main.ts --outDir electron
```

验证编译结果:
```bash
ls electron/main.js
```

### 3. 打包Windows应用

```bash
pnpm run electron:build
```

或使用完整命令:
```bash
pnpm run package:win
```

### 4. 打包过程

预期输出:
```
• electron-builder  version=26.0.12
• loaded configuration  file=electron-builder.json
• building        target=nsis arch=x64
• building        target=portable arch=x64
• packaging       platform=win32 arch=x64
• building block map  blockMapFile=dist-electron\CCS-Tender-1.0.0-Setup.exe.blockmap
• building block map  blockMapFile=dist-electron\CCS-Tender-1.0.0-Portable.exe.blockmap
```

### 5. 输出文件

打包完成后,在 `dist-electron` 目录下生成:

| 文件名 | 类型 | 大小 | 说明 |
|--------|------|------|------|
| `CCS-Tender-1.0.0-Setup.exe` | 安装程序 | ~150MB | NSIS安装包 |
| `CCS-Tender-1.0.0-Portable.exe` | 便携版 | ~150MB | 免安装版本 |
| `*.blockmap` | 映射文件 | <1MB | 增量更新用 |

### 6. 测试安装包

#### 测试安装版

1. 双击 `CCS-Tender-1.0.0-Setup.exe`
2. 选择安装路径
3. 完成安装
4. 启动应用测试

#### 测试便携版

1. 双击 `CCS-Tender-1.0.0-Portable.exe`
2. 应用直接启动
3. 测试所有功能

---

## API配置

### OpenAI API

#### 获取API密钥

1. 访问 https://platform.openai.com
2. 注册/登录账号
3. 进入 API Keys 页面
4. 点击 "Create new secret key"
5. 复制生成的密钥(格式: `sk-...`)

#### 配置方法

```powershell
[System.Environment]::SetEnvironmentVariable("OPENAI_API_KEY", "sk-your-actual-key", "User")
```

#### 验证配置

```bash
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $env:OPENAI_API_KEY"
```

### Gemini API

#### 获取API密钥

1. 访问 https://ai.google.dev
2. 注册Google Cloud账号
3. 创建项目
4. 启用Generative AI API
5. 创建API密钥

#### 配置方法

```powershell
[System.Environment]::SetEnvironmentVariable("GEMINI_API_KEY", "your-gemini-key", "User")
```

#### 验证配置

```bash
curl "https://generativelanguage.googleapis.com/v1/models?key=$env:GEMINI_API_KEY"
```

### API使用限制

| API | 免费额度 | 限流 | 说明 |
|-----|---------|------|------|
| OpenAI | $5免费额度 | 3 RPM | 新用户赠送 |
| Gemini | 60 RPM | 60 RPM | 免费层 |

### 多API切换配置

系统已内置多API自动切换功能:

1. 默认使用OpenAI API
2. 如果失败,自动切换到Gemini
3. 确保至少配置一个API密钥

---

## 故障排查

### 问题1: 依赖安装失败

**症状**:
```
ERR_PNPM_FETCH_404  GET https://registry.npmjs.org/...
```

**解决方案**:
```bash
# 清除缓存
pnpm store prune

# 重新安装
pnpm install --force
```

### 问题2: TypeScript编译错误

**症状**:
```
error TS2307: Cannot find module 'xxx'
```

**解决方案**:
```bash
# 安装类型定义
pnpm add -D @types/node @types/react

# 重新编译
tsc --noEmit
```

### 问题3: Electron打包失败

**症状**:
```
Error: Cannot find module 'electron'
```

**解决方案**:
```bash
# 重新安装Electron
pnpm add -D electron electron-builder

# 清理缓存
rm -rf node_modules
pnpm install
```

### 问题4: API调用失败

**症状**:
```
Error: All API endpoints failed
```

**解决方案**:

1. 检查API密钥配置:
```powershell
$env:OPENAI_API_KEY
$env:GEMINI_API_KEY
```

2. 验证网络连接:
```bash
ping api.openai.com
```

3. 检查API额度:
   - 访问API控制台
   - 查看使用量和限额

### 问题5: PDF生成乱码

**症状**:
PDF报告中中文显示为方框或乱码

**解决方案**:

1. 确认使用最新版本
2. 检查字体文件是否正确嵌入
3. 使用Adobe Acrobat Reader打开
4. 如果问题持续,联系技术支持

### 问题6: 应用无法启动

**症状**:
双击exe文件无反应

**解决方案**:

1. 检查系统要求:
   - Windows 11 (64位)
   - 已安装所有系统更新

2. 以管理员身份运行:
   - 右键点击exe
   - 选择"以管理员身份运行"

3. 检查Windows Defender:
   - 添加应用到白名单

4. 查看日志文件:
```
C:\Users\[用户名]\AppData\Roaming\CCS-Tender\logs\
```

---

## 性能优化

### 1. 构建优化

```bash
# 启用生产模式构建
NODE_ENV=production pnpm run build
```

### 2. 减小打包体积

在 `electron-builder.json` 中配置:
```json
{
  "compression": "maximum",
  "asar": true
}
```

### 3. 加速依赖安装

```bash
# 使用淘宝镜像
pnpm config set registry https://registry.npmmirror.com

# 并行安装
pnpm install --parallel
```

---

## 持续集成

### GitHub Actions示例

```yaml
name: Build and Release

on:
  push:
    tags:
      - 'v*'

jobs:
  build:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
        with:
          version: 10
      - uses: actions/setup-node@v3
        with:
          node-version: 22
      - run: pnpm install
      - run: pnpm run package:win
      - uses: actions/upload-artifact@v3
        with:
          name: windows-installer
          path: dist-electron/*.exe
```

---

## 版本管理

### 更新版本号

1. 修改 `package.json`:
```json
{
  "version": "1.0.1"
}
```

2. 提交更改:
```bash
git add package.json
git commit -m "Bump version to 1.0.1"
git tag v1.0.1
git push origin v1.0.1
```

3. 重新打包:
```bash
pnpm run package:win
```

---

## 技术支持

### 联系方式

**企业**: China Comservice  
**项目**: CCS-Tender  
**版本**: 1.0.0

### 获取帮助

1. 查阅文档: README.md, USER_MANUAL.md
2. 检查日志: `AppData\Roaming\CCS-Tender\logs\`
3. 联系技术支持团队

---

**China Comservice - Build World-Class Networks for the Information Service**

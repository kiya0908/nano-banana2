# nano banana 2 - 下一代 AI 图像编辑器

一个基于 React 和 Cloudflare Workers 构建的尖端 AI 图像编辑平台，由先进的 Google Nano Banana Pro 模型驱动。专为追求极致自由和独特个性的创作者设计，提供超越想象的视觉创作体验。

[English](README.md) | [中文](README.zh-CN.md) | [在线访问](https://nanobanana2pro.space)

## ✨ 功能特性

- 🎨 **AI 深度生成**: 基于 Gemini 和 nano banana 2 引擎，实现高质量的文生图与创意构思。
- 🧊 **3D 物件编辑**: 具备深度空间理解能力，可在 2D 图像中实现精准的 3D 物件操作与调整。
- � **全局一致性保护**: 在复杂的编辑过程中，完美保持角色、艺术风格和环境的视觉一致性。
- 🧠 **复杂逻辑推理**: 利用高精度逻辑推理能力，精准理解并执行多层次的复杂提示词意图。
- 📱 **响应式流体体验**: 完美适配桌面端和移动端，随时随地开启创意之旅。
- ☁️ **原生云架构**: 基于 Cloudflare Workers 的无服务器架构，提供极速响应与全球分布支持。

## 🛠 技术栈

项目采用高性能的现代化技术栈：

- **[React](https://react.dev/)**: 响应式 UI 构建框架。
- **[React Router v7](https://reactrouter.com/)**: 统一项目路由与服务端 API 逻辑。
- **[Cloudflare Workers](https://workers.cloudflare.com/)**: 边缘计算无服务器运行环境。
- **[Cloudflare D1](https://developers.cloudflare.com/d1/)**: 分布式 SQL 边缘数据库。
- **[Cloudflare R2](https://developers.cloudflare.com/r2/)**: 兼容 S3 的大规模对象存储。
- **[Cloudflare KV](https://developers.cloudflare.com/kv/)**: 用于高效缓存的分布式键值存储。
- **[Tailwind CSS](https://tailwindcss.com/) & [DaisyUI](https://daisyui.com/)**: 原子化 CSS 框架与组件库。

## 🚀 快速开始

### 开发环境要求

- Node.js 18+ 
- pnpm
- Cloudflare 账户

### 1. 克隆项目

```bash
git clone https://github.com/kiya0908/nano-banana2.git
cd nano-banana2
```

### 2. 安装依赖

```bash
pnpm install
```

### 3. 环境配置

在 `wrangler.jsonc` 文件中配置以下环境变量：

#### 核心密钥配置
- `KIEAI_APIKEY`: 您的核心 AI 模型接口密钥。
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`: Google OAuth 认证密钥。
- `SESSION_SECRET`: 会话加密密钥。
- `CDN_URL`: R2 存储桶的公共访问 URL (例如 `https://cdn.nanobanana2pro.space`)。

#### Cloudflare 服务初始化

```bash
# 创建 D1 数据库
wrangler d1 create nanobanana2pro

# 创建 KV 命名空间
wrangler kv:namespace create "nanobanana2pro-kv"

# 创建 R2 存储桶
wrangler r2 bucket create nanobanana2pro
```

完成后在 `wrangler.jsonc` 中更新对应的 ID 绑定。

### 4. 数据库迁移

```bash
pnpm run db:migrate:local # 初始化本地数据库
pnpm run db:migrate       # 更新生产环境数据库
```

### 5. 本地开发

```bash
pnpm run dev
```

访问 `http://localhost:5173` 即可立即体验 nano banana 2 编辑器。

## 🌐 部署

一键部署到 Cloudflare 全球边缘节点：

```bash
pnpm run deploy
```

## 📄 许可证

本项目基于 MIT 许可证开源 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [Google Gemini](https://deepmind.google/technologies/gemini/) - 提供核心逻辑与视觉模型支持。
- [Cloudflare](https://cloudflare.com/) - 全球领先的基础设施平台。
- [Kie AI](https://kie.ai/) - AI 服务调度与优化。

---

⭐ 如果这个项目对您的创作有所启发，请给它一个 Star！
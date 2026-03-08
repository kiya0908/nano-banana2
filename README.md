# nano banana 2 - Advanced AI Image Editor

An next-generation AI image editor built with React and Cloudflare Workers, powered by the advanced Google Nano Banana Pro models. It offers unprecedented control over image generation and editing for modern digital creators.

[English](README.md) | [中文](README.zh-CN.md) | [Live Site](https://nanobanana2pro.space)

## ✨ Features

- 🎨 **AI-Powered Image Generation**: Intelligent image design powered by Gemini and the nano banana 2 core engine.
- 🧊 **3D Object Editing**: Advanced spatial understanding for precise object manipulation within 2D images.
- 🔒 **Consistency Protection**: Maintains character, artistic style, and environment consistency throughout complex editing workflows.
- 🧠 **Deep Prompt Understanding**: Leverages high-precision logical reasoning to handle multi-layered and complex visual tasks.
- 📱 **Responsive Design**: Seamlessly optimized for both desktop and mobile creative processes.
- ☁️ **Serverless Architecture**: Built on Cloudflare Workers for extreme performance and global scalability.

## 🛠 Tech Stack

This project is built with a modern, high-performance stack:

- **[React](https://react.dev/)**: For building dynamic and responsive user interfaces.
- **[React Router v7](https://reactrouter.com/)**: Handling application routing and unified server-side API logic.
- **[Cloudflare Workers](https://workers.cloudflare.com/)**: High-performance serverless runtime.
- **[Cloudflare D1](https://developers.cloudflare.com/d1/)**: Edge SQL database.
- **[Cloudflare R2](https://developers.cloudflare.com/r2/)**: S3-compatible object storage.
- **[Cloudflare KV](https://developers.cloudflare.com/kv/)**: Distributed key-value store for caching.
- **[Tailwind CSS](https://tailwindcss.com/) & [DaisyUI](https://daisyui.com/)**: For rapid and consistent UI development.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- Cloudflare account

### 1. Clone the Repository

```bash
git clone https://github.com/kiya0908/nano-banana2.git
cd nano-banana2
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Environment Setup

Configure your environment variables in `wrangler.jsonc`:

#### Core Configuration
- `KIEAI_APIKEY`: Your API key for core model requests.
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`: For Google OAuth authentication.
- `SESSION_SECRET`: Secret key for session encryption.
- `CDN_URL`: Your R2 bucket public URL (e.g., `https://cdn.nanobanana2pro.space`).

#### Cloudflare Services Initialization

```bash
# Create D1 Database
wrangler d1 create nanobanana2pro

# Create KV Namespace
wrangler kv:namespace create "nanobanana2pro-kv"

# Create R2 Bucket
wrangler r2 bucket create nanobanana2pro
```

Update the IDs in `wrangler.jsonc` accordingly.

### 4. Database Migration

```bash
pnpm run db:migrate:local # Local development
pnpm run db:migrate       # Remote production
```

### 5. Local Development

```bash
pnpm run dev
```

Visit `http://localhost:5173` to explore the nano banana 2 editor.

## 🌐 Deployment

Deploy to Cloudflare Workers effortlessly:

```bash
pnpm run deploy
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Google Gemini](https://deepmind.google/technologies/gemini/) - Core logic and vision support.
- [Cloudflare](https://cloudflare.com/) - High-performance edge infrastructure.
- [Kie AI](https://kie.ai/) - AI service orchestration.

---

⭐ If this project helps your creative workflow, please give it a star!

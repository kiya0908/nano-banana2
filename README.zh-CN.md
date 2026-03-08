# Hairroom - AI Hairstyle with Cloudflare Workers

一个基于 React 和 Cloudflare Workers 构建的 [AI 发型修改](https://hairroom.app) 应用，利用 AI 技术为用户提供个性化的发型建议和图像生成服务。

[English](README.md) | [中文](README.zh-CN.md)

## ✨ 功能特性

- 🎨 **AI 发型生成**: 基于 GPT-4o 和 Flux Kontext 的智能发型设计
- 📱 **响应式设计**: 支持桌面端和移动端访问
- 🔐 **Google OAuth 登录**: 安全便捷的用户认证
- ☁️ **云端部署**: 基于 Cloudflare Workers 的无服务器架构
- 💾 **完整的数据存储**: 集成 D1 数据库、R2 文件存储和 KV 缓存

## 🛠 技术栈

该项目采用现代化的技术栈构建：

- **[React](https://react.dev/)**: 用户界面构建框架
- **[React Router v7](https://reactrouter.com/)**: 应用路由和服务端 API 处理
- **[Cloudflare Workers](https://workers.cloudflare.com/)**: 无服务器运行环境
- **[Cloudflare D1](https://developers.cloudflare.com/d1/)**: 边缘数据库
- **[Cloudflare R2](https://developers.cloudflare.com/r2/)**: 对象存储服务
- **[Cloudflare KV](https://developers.cloudflare.com/kv/)**: 键值存储
- **[Tailwind CSS](https://tailwindcss.com/)**: 原子化 CSS 框架
- **[DaisyUI](https://daisyui.com/)**: Tailwind CSS 组件库
- **[React OAuth](https://github.com/MomenSherif/react-oauth)**: Google OAuth 认证

## 🚀 快速开始

### 环境要求

- Node.js 18+ 
- pnpm
- Cloudflare 账户

### 1. 克隆项目

```bash
git clone https://github.com/neyric/ai-hairstyle.git
cd ai-hairstyle
```

### 2. 安装依赖

```bash
pnpm install
```

### 3. 环境配置

复制并编辑 `wrangler.jsonc` 文件中的环境变量：

#### API 密钥配置

获取 [Kie AI](https://kie.ai) API 密钥：

```json
{
  "vars": {
    "KIEAI_APIKEY": "your_kie_ai_api_key_here"
  }
}
```

#### Google OAuth 配置

在 [Google Cloud Console](https://console.cloud.google.com/apis/dashboard) 创建 OAuth 2.0 客户端：

```json
{
  "vars": {
    "GOOGLE_CLIENT_ID": "your_google_client_id",
    "GOOGLE_CLIENT_SECRET": "your_google_client_secret"
  }
}
```

**#### Cloudflare 服务配置

创建并配置以下 Cloudflare 服务：

1. **D1 数据库**:
```bash
wrangler d1 create hairroom
```

2. **KV 命名空间**:
```bash
wrangler kv:namespace create "hairroom-kv"
```

3. **R2 存储桶**:
```bash
wrangler r2 bucket create hairroom
```**

然后在 `wrangler.jsonc` 中配置绑定：

```json
{
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "hairroom",
      "database_id": "your_d1_database_id",
      "migrations_dir": "./app/.server/drizzle/migrations"
    }
  ],
  "kv_namespaces": [
    {
      "binding": "KV",
      "id": "your_kv_namespace_id"
    }
  ],
  "r2_buckets": [
    {
      "binding": "R2",
      "bucket_name": "hairroom"
    }
  ]
}
```

### 4. 数据库迁移

运行数据库迁移以创建必要的表：

```bash
pnpm run db:migrate // 远程数据库结构迁移
pnpm run db:migrate:local // 本地数据库结构迁移
```

### 5. 本地开发

在完成 `pnpm run db:migrate:local` 指令后，使用以下命令启动开发服务器：

```bash
pnpm run dev
```

访问 [http://localhost:5173](http://localhost:5173) 查看应用。

## 🌐 部署

### 部署到 Cloudflare Workers

```bash
pnpm run deploy
```

### 自定义域名配置

如需绑定自定义域名，请在 `wrangler.jsonc` 中取消注释并修改以下配置：

```json
{
  "routes": [
    {
      "pattern": "your-domain.com",
      "custom_domain": true
    },
    {
      "pattern": "www.your-domain.com", 
      "custom_domain": true
    }
  ]
}
```

然后重新部署：

```bash
pnpm run deploy
```

## 🔧 可用脚本

- `pnpm run dev` - 启动开发服务器
- `pnpm run build` - 构建生产版本
- `pnpm run deploy` - 构建并部署到 Cloudflare Workers
- `pnpm run preview` - 预览构建后的应用
- `pnpm run typecheck` - TypeScript 类型检查
- `pnpm run cf-typegen` - 生成 Cloudflare Workers 类型定义
- `pnpm run db:generate` - 生成数据库迁移文件
- `pnpm run db:migrate` - 运行数据库迁移
- `pnpm run db:migrate:local` - 在本地运行数据库迁移

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！请确保：

1. Fork 本仓库
2. 创建特性分支: `git checkout -b feature/amazing-feature`
3. 提交更改: `git commit -m 'Add amazing feature'`
4. 推送到分支: `git push origin feature/amazing-feature`
5. 开启 Pull Request

## 📄 许可证

本项目基于 MIT 许可证开源 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [OpenAI](https://openai.com/) - GPT-4o API
- [Cloudflare](https://cloudflare.com/) - 基础设施支持
- [Kie AI](https://kie.ai/) - AI 服务提供

## 📞 联系方式

如有问题或建议，请通过以下方式联系：

- 提交 [Issue](https://github.com/neyric/ai-hairstyle/issues)

---

⭐ 如果这个项目对你有帮助，请给它一个 Star！
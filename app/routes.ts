import { type RouteConfig, layout, prefix, index, route } from "@react-router/dev/routes";
import { flatRoutes } from "@react-router/fs-routes";

// 各功能模块路由
const apiRoutes = await flatRoutes({ rootDirectory: "./routes/_api" });
const webhooksRoutes = await flatRoutes({
  rootDirectory: "./routes/_webhooks",
});
const callbackRoutes = await flatRoutes({
  rootDirectory: "./routes/_callback",
});
const metaRoutes = await flatRoutes({ rootDirectory: "./routes/_meta" });
const legalRoutes = await flatRoutes({ rootDirectory: "./routes/_legal" });

export default [
  // Nano Banana 首页 — 独立路由，不经过 BaseLayout
  index("./routes/home.tsx"),
  // 其他需要 BaseLayout 的页面
  ...prefix("base", [
    layout("./routes/base/layout/index.tsx", [
      index("./routes/base/index.tsx"),
      route("profile", "./routes/base/profile.tsx"),
      route("credits", "./routes/base/credits.tsx"),
      route("orders", "./routes/base/orders.tsx"),
      route("subscription", "./routes/base/subscription.tsx"),
      route("gallery", "./routes/base/gallery.tsx"),
    ]),
  ]),
  ...prefix("api", apiRoutes),
  ...prefix("webhooks", webhooksRoutes),
  ...prefix("callback", callbackRoutes),
  ...prefix("legal", legalRoutes),
  ...metaRoutes,
] satisfies RouteConfig;

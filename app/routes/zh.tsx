import type { Route } from "./+types/zh";

import { LandingPage } from "./home";
import { createCanonical } from "~/utils/meta";

const createAlternate = (pathname: string, domain: string, hrefLang: string) => ({
  tagName: "link" as const,
  rel: "alternate",
  hrefLang,
  href: new URL(pathname, domain).toString(),
});

export const meta: Route.MetaFunction = ({ matches }) => {
  const domain = matches[0]?.data?.DOMAIN ?? "https://nanobanana2pro.space";

  return [
    { title: "Nano Banana 2 - AI 图像编辑与生成平台" },
    {
      name: "description",
      content:
        "Nano Banana 2 是面向创作者的 AI 图像编辑平台。支持仅提示词或图片+提示词两种工作流，快速完成高质量图像生成与编辑。",
    },
    createCanonical("/zh", domain),
    createAlternate("/", domain, "en"),
    createAlternate("/zh", domain, "zh"),
    createAlternate("/", domain, "x-default"),
  ];
};

export default function ZhHomePage() {
  return <LandingPage initialLanguage="zh" />;
}

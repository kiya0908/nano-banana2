export interface PLAN {
  id: string;
  popular: boolean;
  product_id: { monthly: string; yearly: string } | null;
  price: { monthly: number; yearly: number };
  name: string;
  description: string;
  limit: {
    adblock: boolean; // 是否关闭广告
    watermarks: boolean; // 生成的结果是否显示水印
    highResolution: boolean; // 是否生成高质量图像
    fullStyles: boolean; // 是否允许使用完整风格
    credits: number; // 每月赠送积分
    private: boolean; // 是否私有化生成
    features: boolean; // 允许使用实验性功能
  };
}

// 免费方案
export const FREE_PLAN: PLAN = {
  id: "free",
  popular: false,
  product_id: null, // 免费方案无需商品编码
  price: { monthly: 0, yearly: 0 },
  name: "Starter",
  description:
    "Get started with Nano Banana 2 for free. Basic features with watermarks.",
  limit: {
    adblock: false,
    watermarks: true, // 免费方案显示水印
    highResolution: false,
    fullStyles: false,
    credits: 3, // 注册赠送的积分
    private: false,
    features: false,
  },
};

// 高级方案
export const PREMIUM_PLAN: PLAN = {
  id: "premium",
  popular: true,
  price: { monthly: 4.99, yearly: 49.9 },
  product_id: {
    monthly: "xxx", // TODO: 替换为 Creem 后台创建的月订阅商品编码
    yearly: "xxx", // TODO: 替换为 Creem 后台创建的年订阅商品编码
  },
  name: "Premium Plan",
  description:
    "Support full styles and Ad-free experience, get no watermarks and high resolution image.",
  limit: {
    adblock: true,
    watermarks: false,
    highResolution: true,
    fullStyles: true,
    credits: 100,
    private: true,
    features: false,
  },
};

// 定价方案列表（按展示顺序排列）
export const PRICING_LIST: PLAN[] = [FREE_PLAN, PREMIUM_PLAN];

// 定价方案字典（按 ID 快速查找）
export const PLANS: Record<string, PLAN> = PRICING_LIST.reduce(
  (acc, plan) => {
    acc[plan.id] = plan;
    return acc;
  },
  {} as Record<string, PLAN>
);

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { useTranslation } from "../i18n/LanguageContext";
import { useUser } from "~/store/user";
import { BASIC_PLAN, PREMIUM_PLAN } from "~/constants/pricing";

export default function Pricing() {
  const { t } = useTranslation();
  const enterpriseFeatures = t("pricing.enterpriseFeatures") as string[];

  const [isAnnual, setIsAnnual] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const user = useUser((state) => state.user);

  const proFeatures = [
    `${isAnnual ? PREMIUM_PLAN.limit.credits.yearly : PREMIUM_PLAN.limit.credits.monthly} Credits ${
      isAnnual ? "per year" : "per month"
    }`,
    ...PREMIUM_PLAN.feature_description.slice(1),
  ];

  const handleSubscribe = async (planType: "basic" | "pro") => {
    if (!user) {
      alert("Please login first to subscribe.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    try {
      setLoadingPlan(planType);

      const productId =
        planType === "basic"
          ? BASIC_PLAN.product_id?.monthly
          : isAnnual
          ? PREMIUM_PLAN.product_id?.yearly
          : PREMIUM_PLAN.product_id?.monthly;

      if (!productId) {
        alert("Subscription product is not fully configured yet.");
        setLoadingPlan(null);
        return;
      }

      const response = await fetch("/api/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ product_id: productId }),
      });

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      const session = (await response.json()) as { checkout_url?: string };

      if (session?.checkout_url) {
        window.location.href = session.checkout_url;
      } else {
        throw new Error("Invalid checkout session");
      }
    } catch (error) {
      console.error("Subscription error:", error);
      alert("Failed to initiate payment. Please try again later.");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <section
      id="pricing"
      className="py-32 border-t border-border-subtle bg-bg-surface/20"
    >
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            {t("pricing.title")}
          </h2>
          <div className="inline-flex items-center gap-2 bg-bg-surface border border-border-subtle rounded-full p-1">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                !isAnnual
                  ? "bg-white text-black shadow-sm"
                  : "text-text-secondary hover:text-white"
              }`}
            >
              {t("pricing.monthly")}
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                isAnnual
                  ? "bg-white text-black shadow-sm"
                  : "text-text-secondary hover:text-white"
              }`}
            >
              {t("pricing.annually")} <span className="text-blue-600 ml-1">Save</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-bg-surface border border-border-subtle rounded-3xl p-8 flex flex-col">
            <h3 className="text-xl font-bold mb-2">{BASIC_PLAN.name}</h3>
            <p className="text-sm text-text-secondary mb-6">{BASIC_PLAN.description}</p>
            <div className="mb-6">
              <span className="text-4xl font-extrabold">${BASIC_PLAN.price.monthly}</span>
              <span className="text-text-secondary">{t("pricing.month")}</span>
            </div>
            <div className="text-sm text-text-secondary mb-8 pb-8 border-b border-border-subtle">
              Monthly plan
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              {BASIC_PLAN.feature_description.map((f, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check size={20} className="text-white shrink-0" /> <span>{f}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleSubscribe("basic")}
              disabled={loadingPlan === "basic"}
              className="w-full py-4 rounded-full border border-white/20 hover:bg-white/10 transition-colors font-bold flex items-center justify-center gap-2"
            >
              {loadingPlan === "basic" && <Loader2 className="animate-spin" size={20} />}
              {t("pricing.getStarted")}
            </button>
          </div>

          <div className="bg-bg-elevated border border-blue-500/30 rounded-3xl p-8 flex flex-col relative transform md:-translate-y-4 shadow-2xl shadow-blue-900/20">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-xs font-bold tracking-wider uppercase">
              {t("pricing.mostPopular")}
            </div>
            <h3 className="text-xl font-bold mb-2">{PREMIUM_PLAN.name}</h3>
            <p className="text-sm text-white/70 mb-6">
              {isAnnual
                ? PREMIUM_PLAN.yearly_description ?? PREMIUM_PLAN.description
                : PREMIUM_PLAN.description}
            </p>
            <div className="mb-6 text-blue-50">
              <span className="text-4xl font-extrabold">
                {isAnnual
                  ? `$${(PREMIUM_PLAN.price.yearly / 12).toFixed(2)}`
                  : `$${PREMIUM_PLAN.price.monthly}`}
              </span>
              <span className="text-white/60">{t("pricing.month")}</span>
            </div>
            <div className="text-sm text-white/60 mb-8 pb-8 border-b border-white/10">
              {isAnnual
                ? `${t("pricing.billedAnnually")} $${PREMIUM_PLAN.price.yearly}`
                : `${t("pricing.billedAnnually")} $${(
                    PREMIUM_PLAN.price.monthly * 12
                  ).toFixed(2)}`}
            </div>
            <ul className="space-y-4 mb-8 flex-1 text-blue-50">
              {proFeatures.map((f, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check size={20} className="text-blue-400 shrink-0" /> <span>{f}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleSubscribe("pro")}
              disabled={loadingPlan === "pro"}
              className="w-full py-4 rounded-full bg-white text-black hover:scale-105 transition-transform font-bold flex items-center justify-center gap-2"
            >
              {loadingPlan === "pro" && <Loader2 className="animate-spin" size={20} />}
              {t("pricing.getStarted")}
            </button>
          </div>

          <div className="bg-bg-surface border border-border-subtle rounded-3xl p-8 flex flex-col">
            <h3 className="text-xl font-bold mb-2">{t("pricing.enterprise")}</h3>
            <div className="mb-6">
              <span className="text-4xl font-extrabold">{t("pricing.custom")}</span>
            </div>
            <div className="text-sm text-text-secondary mb-8 pb-8 border-b border-border-subtle">
              {t("pricing.tailored")}
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              {enterpriseFeatures.map((f, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check size={20} className="text-white shrink-0" /> <span>{f}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => (window.location.href = "mailto:contact@example.com")}
              className="w-full py-4 rounded-full border border-white/20 hover:bg-white/10 transition-colors font-bold"
            >
              {t("pricing.contactSales")}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

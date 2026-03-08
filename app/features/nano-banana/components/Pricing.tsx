import { useState } from 'react';
import { motion } from 'motion/react';
import { Check, Loader2 } from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext';
import { useUser } from '~/store/user';
import { PREMIUM_PLAN } from '~/constants/pricing';

// 价格方案组件 - 三列定价卡片
export default function Pricing() {
    const { t } = useTranslation();
    const starterFeatures = t('pricing.starterFeatures');
    const proFeatures = t('pricing.proFeatures');
    const enterpriseFeatures = t('pricing.enterpriseFeatures');

    const [isAnnual, setIsAnnual] = useState(false);
    const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

    const user = useUser((state) => state.user);

    const handleSubscribe = async (planType: string) => {
        if (!user) {
            // 如果未登录，触发导航栏的登录弹窗 (简单起见，可以提醒用户在顶部登录)
            alert("Please login first to subscribe.");
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        try {
            setLoadingPlan(planType);

            const productId = isAnnual
                ? PREMIUM_PLAN.product_id?.yearly
                : PREMIUM_PLAN.product_id?.monthly;

            if (!productId || productId === 'xxx') {
                alert("Subscription product is not fully configured yet.");
                setLoadingPlan(null);
                return;
            }

            const response = await fetch('/api/create-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ product_id: productId }),
            });

            if (!response.ok) {
                throw new Error('Failed to create order');
            }

            const session = (await response.json()) as any;

            if (session && session.checkout_url) {
                // 重定向到 Creem 支付页面
                window.location.href = session.checkout_url;
            } else {
                throw new Error('Invalid checkout session');
            }
        } catch (error) {
            console.error('Subscription error:', error);
            alert("Failed to initiate payment. Please try again later.");
        } finally {
            setLoadingPlan(null);
        }
    };

    return (
        <section id="pricing" className="py-32 border-t border-border-subtle bg-bg-surface/20">
            <div className="max-w-[1200px] mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">{t('pricing.title')}</h2>
                    <div className="inline-flex items-center gap-2 bg-bg-surface border border-border-subtle rounded-full p-1">
                        <button
                            onClick={() => setIsAnnual(false)}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${!isAnnual ? 'bg-white text-black shadow-sm' : 'text-text-secondary hover:text-white'}`}
                        >
                            {t('pricing.monthly')}
                        </button>
                        <button
                            onClick={() => setIsAnnual(true)}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${isAnnual ? 'bg-white text-black shadow-sm' : 'text-text-secondary hover:text-white'}`}
                        >
                            {t('pricing.annually')} <span className="text-blue-600 ml-1">-50%</span>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* 入门方案 */}
                    <div className="bg-bg-surface border border-border-subtle rounded-3xl p-8 flex flex-col opacity-75">
                        <h3 className="text-xl font-bold mb-2">{t('pricing.starter')}</h3>
                        <div className="mb-6">
                            <span className="text-4xl font-extrabold">$7.49</span>
                            <span className="text-text-secondary">{t('pricing.month')}</span>
                        </div>
                        <div className="text-sm text-text-secondary mb-8 pb-8 border-b border-border-subtle">
                            {t('pricing.billedAnnually')} $89.99
                        </div>
                        <ul className="space-y-4 mb-8 flex-1">
                            {starterFeatures.map((f: string, i: number) => (
                                <li key={i} className="flex items-start gap-3"><Check size={20} className="text-white shrink-0" /> <span>{f}</span></li>
                            ))}
                        </ul>
                        <button className="w-full py-4 rounded-full border border-white/20 bg-white/5 text-text-secondary cursor-not-allowed font-bold" disabled>
                            Currently Unavailable
                        </button>
                    </div>

                    {/* 专业方案 */}
                    <div className="bg-bg-elevated border border-blue-500/30 rounded-3xl p-8 flex flex-col relative transform md:-translate-y-4 shadow-2xl shadow-blue-900/20">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-xs font-bold tracking-wider uppercase">
                            {t('pricing.mostPopular')}
                        </div>
                        <h3 className="text-xl font-bold mb-2">{t('pricing.pro')}</h3>
                        <div className="mb-6 text-blue-50">
                            <span className="text-4xl font-extrabold">
                                {isAnnual ? `$${(PREMIUM_PLAN.price.yearly / 12).toFixed(2)}` : `$${PREMIUM_PLAN.price.monthly}`}
                            </span>
                            <span className="text-white/60">{t('pricing.month')}</span>
                        </div>
                        <div className="text-sm text-white/60 mb-8 pb-8 border-b border-white/10">
                            {t('pricing.billedAnnually')} ${isAnnual ? PREMIUM_PLAN.price.yearly : (PREMIUM_PLAN.price.monthly * 12).toFixed(2)}
                        </div>
                        <ul className="space-y-4 mb-8 flex-1 text-blue-50">
                            {proFeatures.map((f: string, i: number) => (
                                <li key={i} className="flex items-start gap-3"><Check size={20} className="text-blue-400 shrink-0" /> <span>{f}</span></li>
                            ))}
                        </ul>
                        <button
                            onClick={() => handleSubscribe('pro')}
                            disabled={loadingPlan === 'pro'}
                            className="w-full py-4 rounded-full bg-white text-black hover:scale-105 transition-transform font-bold flex items-center justify-center gap-2"
                        >
                            {loadingPlan === 'pro' && <Loader2 className="animate-spin" size={20} />}
                            {t('pricing.getStarted')}
                        </button>
                    </div>

                    {/* 企业方案 */}
                    <div className="bg-bg-surface border border-border-subtle rounded-3xl p-8 flex flex-col">
                        <h3 className="text-xl font-bold mb-2">{t('pricing.enterprise')}</h3>
                        <div className="mb-6">
                            <span className="text-4xl font-extrabold">{t('pricing.custom')}</span>
                        </div>
                        <div className="text-sm text-text-secondary mb-8 pb-8 border-b border-border-subtle">
                            {t('pricing.tailored')}
                        </div>
                        <ul className="space-y-4 mb-8 flex-1">
                            {enterpriseFeatures.map((f: string, i: number) => (
                                <li key={i} className="flex items-start gap-3"><Check size={20} className="text-white shrink-0" /> <span>{f}</span></li>
                            ))}
                        </ul>
                        <button
                            onClick={() => window.location.href = 'mailto:contact@example.com'}
                            className="w-full py-4 rounded-full border border-white/20 hover:bg-white/10 transition-colors font-bold"
                        >
                            {t('pricing.contactSales')}
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}

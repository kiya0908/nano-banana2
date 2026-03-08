import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext';

// 底部行动号召组件 - 渐变背景按钮区
export default function BottomCTA() {
    const { t } = useTranslation();

    return (
        <section className="py-32 relative overflow-hidden">
            <div className="absolute inset-0 brand-gradient opacity-10" />
            <div className="max-w-[800px] mx-auto px-6 relative z-10 text-center">
                <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
                    {t('cta.title1')} <br /> {t('cta.title2')}
                </h2>
                <p className="text-xl text-text-secondary mb-12">
                    {t('cta.desc')}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button className="w-full sm:w-auto bg-white text-black px-8 py-4 rounded-full text-base font-bold hover:scale-105 transition-transform">
                        {t('cta.signup')}
                    </button>
                    <button className="w-full sm:w-auto bg-bg-surface border border-border-subtle text-white px-8 py-4 rounded-full text-base font-bold hover:bg-white/5 transition-colors flex items-center justify-center gap-2 group">
                        {t('cta.demo')} <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </section>
    );
}

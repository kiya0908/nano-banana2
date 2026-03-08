import { motion } from 'motion/react';
import { ChevronRight, Sparkles, Layers, MessageSquare } from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext';

// 首屏英雄区域组件 - 渐变文字和动画入场
export default function Hero() {
    const { t } = useTranslation();

    return (
        <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
            {/* 背景光晕 */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/20 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-[1400px] mx-auto px-6 relative z-10 flex flex-col items-center text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 mb-8"
                >
                    <Sparkles size={14} className="text-blue-400" />
                    <span className="text-sm text-text-secondary">{t('hero.badge')}</span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="text-6xl md:text-8xl font-extrabold tracking-tight mb-6 leading-[1.1]"
                >
                    {t('hero.title1')} <br />
                    <span className="brand-gradient-text">{t('hero.title2')}</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="text-lg md:text-xl text-text-secondary max-w-2xl mb-10 leading-relaxed"
                >
                    {t('hero.desc')}
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col sm:flex-row items-center gap-4 mb-16"
                >
                    <button className="w-full sm:w-auto bg-white text-black px-8 py-4 rounded-full text-base font-bold hover:scale-105 transition-transform flex items-center justify-center gap-2 group">
                        {t('hero.tryBtn')}
                        <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button className="w-full sm:w-auto bg-white/5 border border-white/20 text-white px-8 py-4 rounded-full text-base font-bold hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
                        {t('hero.videoBtn')}
                    </button>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-wrap justify-center gap-8 text-sm text-text-secondary"
                >
                    <div className="flex items-center gap-2">
                        <Sparkles size={16} />
                        <span>{t('hero.feature1')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Layers size={16} />
                        <span>{t('hero.feature2')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MessageSquare size={16} />
                        <span>{t('hero.feature3')}</span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

import { motion } from 'motion/react';
import { useTranslation } from '../i18n/LanguageContext';

// 品牌故事组件 - 双栏布局含图片悬停效果
export default function BrandStory() {
    const { t } = useTranslation();

    return (
        <section className="py-32 relative border-t border-border-subtle">
            <div className="max-w-[1400px] mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                            {t('brand.title1')} <span className="brand-gradient-text">{t('brand.title2')}</span>
                        </h2>
                        <p className="text-lg text-text-secondary leading-relaxed mb-6">
                            {t('brand.p1')}
                        </p>
                        <p className="text-lg text-text-secondary leading-relaxed">
                            {t('brand.p2')}
                        </p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative aspect-square rounded-3xl overflow-hidden inner-glow bg-bg-surface flex items-center justify-center group"
                    >
                        <img
                            src="https://picsum.photos/seed/universe/800/800"
                            alt="Nano Banana Universe"
                            className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-1000"
                            referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-bg-deep to-transparent" />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

import { motion } from 'motion/react';
import { Brain, Box, Image as ImageIcon, ShieldCheck, MessageSquareText, Sparkles } from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext';

// 核心功能组件 - 六宫格网格布局
export default function Features() {
    const { t } = useTranslation();
    const items = t('features.items');

    const icons = [
        <Brain size={24} />,
        <Box size={24} />,
        <ImageIcon size={24} />,
        <ShieldCheck size={24} />,
        <MessageSquareText size={24} />,
        <Sparkles size={24} />
    ];

    return (
        <section id="features" className="py-32 bg-bg-surface/30">
            <div className="max-w-[1400px] mx-auto px-6">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">{t('features.title')}</h2>
                    <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                        {t('features.desc')}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((f: any, i: number) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className="bg-bg-surface border border-border-subtle rounded-3xl p-8 hover:border-border-highlight transition-colors group"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform">
                                {icons[i]}
                            </div>
                            <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                            <p className="text-text-secondary leading-relaxed">{f.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

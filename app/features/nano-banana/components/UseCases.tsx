import { motion } from 'motion/react';
import { useTranslation } from '../i18n/LanguageContext';

// 使用案例组件 - 四宫格卡片叠加
export default function UseCases() {
    const { t } = useTranslation();
    const items = t('useCases.items');

    const images = ["product", "content", "art", "restore"];

    return (
        <section id="use-cases" className="py-32">
            <div className="max-w-[1400px] mx-auto px-6">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-16 text-center">{t('useCases.title')}</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {items.map((c: any, i: number) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className="group relative h-[400px] rounded-3xl overflow-hidden bg-bg-surface border border-border-subtle"
                        >
                            <img
                                src={`https://picsum.photos/seed/${images[i]}/800/600`}
                                alt={c.title}
                                className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-40 group-hover:scale-105 transition-all duration-700"
                                referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-bg-deep via-bg-deep/50 to-transparent" />
                            <div className="absolute inset-0 p-8 flex flex-col justify-end">
                                <h3 className="text-2xl font-bold mb-3">{c.title}</h3>
                                <p className="text-text-secondary max-w-md">{c.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

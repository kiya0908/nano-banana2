import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext';

// 社群灵感组件 - 瀑布流图片网格
export default function Inspiration() {
    const { t } = useTranslation();

    return (
        <section id="inspiration" className="py-32 bg-bg-surface/30">
            <div className="max-w-[1400px] mx-auto px-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">{t('inspiration.title')}</h2>
                        <p className="text-lg text-text-secondary">{t('inspiration.desc')}</p>
                    </div>
                    <button className="text-white flex items-center gap-2 hover:gap-3 transition-all font-medium">
                        {t('inspiration.viewMore')} <ArrowRight size={18} />
                    </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {Array.from({ length: 10 }).map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.05 }}
                            className={`relative rounded-2xl overflow-hidden group cursor-pointer ${i === 0 || i === 5 ? 'col-span-2 row-span-2' : 'col-span-1 row-span-1'
                                }`}
                        >
                            <img
                                src={`https://picsum.photos/seed/art${i}/600/${i === 0 || i === 5 ? '600' : '800'}`}
                                alt="Community Art"
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                                <p className="text-sm text-white/80 line-clamp-2 mb-3">
                                    "A futuristic cityscape at sunset with flying cars and neon lights, cinematic lighting..."
                                </p>
                                <span className="text-xs font-bold text-white uppercase tracking-wider">{t('inspiration.viewDetails')}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

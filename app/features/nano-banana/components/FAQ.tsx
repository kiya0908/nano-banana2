import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext';

// 常见问题组件 - 手风琴展开/折叠动画
export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const { t } = useTranslation();
    const qs = t('faq.qs');
    const as = t('faq.as');

    return (
        <section className="py-32 border-t border-border-subtle bg-bg-surface/20">
            <div className="max-w-[800px] mx-auto px-6">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-12 text-center">{t('faq.title')}</h2>

                <div className="space-y-4">
                    {qs.map((q: string, i: number) => (
                        <div
                            key={i}
                            className="bg-bg-surface border border-border-subtle rounded-2xl overflow-hidden"
                        >
                            <button
                                className="w-full px-6 py-5 text-left flex items-center justify-between font-bold text-lg hover:bg-white/5 transition-colors"
                                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                            >
                                {q}
                                <ChevronDown
                                    className={`transition-transform duration-300 ${openIndex === i ? 'rotate-180' : ''}`}
                                />
                            </button>
                            <AnimatePresence>
                                {openIndex === i && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="px-6 pb-5 text-text-secondary leading-relaxed">
                                            {as[i]}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

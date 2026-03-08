import { motion } from 'motion/react';
import { useTranslation } from '../i18n/LanguageContext';

export default function HowItWorks() {
    const { t } = useTranslation();
    const steps = t('howItWorks.steps');

    return (
        <section className="py-24 bg-bg-deep relative overflow-hidden">
            <div className="max-w-[1400px] mx-auto px-6 relative z-10">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-bold tracking-tight mb-6"
                    >
                        {t('howItWorks.title')}
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-text-secondary leading-relaxed"
                    >
                        {t('howItWorks.desc')}
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {steps.map((step: any, index: number) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-bg-surface p-8 rounded-3xl border border-border-subtle hover:border-text-primary/20 transition-all duration-300 flex flex-col items-center text-center group"
                        >
                            <div className="w-16 h-16 rounded-full bg-bg-deep border border-border-default text-text-primary flex items-center justify-center text-2xl font-bold mb-6 group-hover:scale-110 transition-transform duration-300">
                                {index + 1}
                            </div>
                            <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                            <p className="text-text-secondary">{step.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

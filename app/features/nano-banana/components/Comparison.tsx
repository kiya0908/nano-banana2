import { motion } from 'motion/react';
import { Check, X } from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext';

// 对比表格组件 - 四列对比 + 示例图片
export default function Comparison() {
    const { t } = useTranslation();
    const items = t('comparison.items');
    const examples = t('comparison.examples');

    return (
        <section id="comparison" className="py-32 border-t border-border-subtle">
            <div className="max-w-[1000px] mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">{t('comparison.title')}</h2>
                    <p className="text-lg text-text-secondary">
                        {t('comparison.desc')}
                    </p>
                </div>

                <div className="bg-bg-surface border border-border-subtle rounded-3xl overflow-hidden">
                    <div className="grid grid-cols-4 border-b border-border-subtle bg-bg-elevated/50 p-6">
                        <div className="col-span-1 font-bold text-text-secondary">{t('comparison.dimensions')}</div>
                        <div className="col-span-1 font-bold text-center text-white">Nano Banana 2</div>
                        <div className="col-span-1 font-bold text-center text-text-secondary">Flux Kontext</div>
                        <div className="col-span-1 font-bold text-center text-text-secondary">Gemini 2.0</div>
                    </div>

                    {[
                        { name: items[0], nb: true, f: false, g: true },
                        { name: items[1], nb: true, f: false, g: false },
                        { name: items[2], nb: true, f: true, g: true },
                        { name: items[3], nb: true, f: false, g: false },
                        { name: items[4], nb: true, f: false, g: true },
                        { name: items[5], nb: true, f: true, g: true },
                    ].map((row, i) => (
                        <div key={i} className="grid grid-cols-4 border-b border-border-subtle last:border-0 p-6 items-center hover:bg-white/[0.02] transition-colors">
                            <div className="col-span-1 font-medium">{row.name}</div>
                            <div className="col-span-1 flex justify-center">
                                {row.nb ? <Check className="text-blue-400" /> : <X className="text-text-secondary/30" />}
                            </div>
                            <div className="col-span-1 flex justify-center">
                                {row.f ? <Check className="text-text-secondary" /> : <X className="text-text-secondary/30" />}
                            </div>
                            <div className="col-span-1 flex justify-center">
                                {row.g ? <Check className="text-text-secondary" /> : <X className="text-text-secondary/30" />}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { title: examples[0], img: 'water' },
                        { title: examples[1], img: 'portrait' },
                        { title: examples[2], img: 'fashion' },
                    ].map((ex, i) => (
                        <div key={i} className="bg-bg-surface border border-border-subtle rounded-2xl overflow-hidden group">
                            <div className="aspect-[4/3] relative overflow-hidden">
                                <img
                                    src={`https://picsum.photos/seed/${ex.img}/600/450`}
                                    alt={ex.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    referrerPolicy="no-referrer"
                                />
                                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs border border-white/10">
                                    {t('comparison.realEffect')}
                                </div>
                            </div>
                            <div className="p-4">
                                <h4 className="font-bold text-sm">{ex.title}</h4>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

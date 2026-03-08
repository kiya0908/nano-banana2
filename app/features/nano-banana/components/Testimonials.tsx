import { motion } from 'motion/react';
import { Star } from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext';

// 用户评价组件 - 三列评价卡片含星级评分
export default function Testimonials() {
    const { t } = useTranslation();
    const roles = t('testimonials.roles');
    const contents = t('testimonials.contents');

    const reviews = [
        {
            name: "AIArtistPro",
            role: roles[0],
            content: contents[0],
            avatar: "avatar1"
        },
        {
            name: "ContentCreator",
            role: roles[1],
            content: contents[1],
            avatar: "avatar2"
        },
        {
            name: "PhotoEditor",
            role: roles[2],
            content: contents[2],
            avatar: "avatar3"
        }
    ];

    return (
        <section className="py-32">
            <div className="max-w-[1400px] mx-auto px-6">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-16 text-center">{t('testimonials.title')}</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {reviews.map((r, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className="bg-bg-surface border border-border-subtle rounded-3xl p-8"
                        >
                            <div className="flex gap-1 mb-6 text-yellow-500">
                                {[...Array(5)].map((_, j) => <Star key={j} size={16} fill="currentColor" />)}
                            </div>
                            <p className="text-lg mb-8 leading-relaxed">"{r.content}"</p>
                            <div className="flex items-center gap-4">
                                <img
                                    src={`https://picsum.photos/seed/${r.avatar}/100/100`}
                                    alt={r.name}
                                    className="w-12 h-12 rounded-full object-cover"
                                    referrerPolicy="no-referrer"
                                />
                                <div>
                                    <h4 className="font-bold">{r.name}</h4>
                                    <p className="text-sm text-text-secondary">{r.role}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

import { Twitter, Instagram, Github, Disc as Discord } from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext';

// 页脚组件 - 多列链接布局
export default function Footer() {
    const { t } = useTranslation();

    return (
        <footer className="border-t border-border-subtle bg-bg-deep pt-20 pb-10">
            <div className="max-w-[1400px] mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 rounded-lg brand-gradient flex items-center justify-center font-bold text-white">
                                NB
                            </div>
                            <span className="font-bold text-xl tracking-tight">Nano Banana</span>
                        </div>
                        <p className="text-text-secondary max-w-sm mb-8">
                            {t('footer.desc')}
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-bg-surface border border-border-subtle flex items-center justify-center text-text-secondary hover:text-white hover:border-white/30 transition-colors">
                                <Twitter size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-bg-surface border border-border-subtle flex items-center justify-center text-text-secondary hover:text-white hover:border-white/30 transition-colors">
                                <Instagram size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-bg-surface border border-border-subtle flex items-center justify-center text-text-secondary hover:text-white hover:border-white/30 transition-colors">
                                <Discord size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-bg-surface border border-border-subtle flex items-center justify-center text-text-secondary hover:text-white hover:border-white/30 transition-colors">
                                <Github size={18} />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6">{t('footer.related')}</h4>
                        <ul className="space-y-4 text-text-secondary">
                            <li><a href="#" className="hover:text-white transition-colors">Ghostface AI</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Scream AI</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Mixboard</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6">{t('footer.legal')}</h4>
                        <ul className="space-y-4 text-text-secondary">
                            <li><a href="/legal/privacy" className="hover:text-white transition-colors">{t('footer.privacy')}</a></li>
                            <li><a href="/legal/terms" className="hover:text-white transition-colors">{t('footer.terms')}</a></li>
                            <li><a href="mailto:support@nanobanana2pro.space" className="hover:text-white transition-colors">{t('footer.contact')}</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-border-subtle pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-text-secondary">
                    <p>{t('footer.rights')}</p>
                    <p className="mt-2 md:mt-0">Powered by Google AI</p>
                </div>
            </div>
        </footer>
    );
}

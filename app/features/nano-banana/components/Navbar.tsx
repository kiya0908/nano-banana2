import { motion } from 'motion/react';
import { Menu, Globe, ChevronRight, LogOut, LayoutDashboard } from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext';
import { useUser } from '~/store/user';
import { GoogleOAuth } from '~/features/oauth';
import { Image } from '~/components/common';

// 导航栏组件 - 固定顶部毛玻璃效果
export default function Navbar() {
    const { t, language, setLanguage } = useTranslation();

    const toggleLanguage = () => {
        setLanguage(language === 'zh' ? 'en' : 'zh');
    };

    const user = useUser((state) => state.user);
    const credits = useUser((state) => state.credits);
    const clearUser = useUser((state) => state.clearUser);

    const handleLogout = async () => {
        await fetch('/api/logout');
        clearUser();
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass-panel">
            <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-2 cursor-pointer">
                        <div className="w-8 h-8 rounded-lg brand-gradient flex items-center justify-center font-bold text-white">
                            NB
                        </div>
                        <span className="font-bold text-xl tracking-tight">Nano Banana</span>
                    </div>
                    <div className="hidden md:flex items-center gap-6 text-sm text-text-secondary">
                        <a href="#features" className="hover:text-white transition-colors">{t('nav.features')}</a>
                        <a href="#use-cases" className="hover:text-white transition-colors">{t('nav.useCases')}</a>
                        <a href="#comparison" className="hover:text-white transition-colors">{t('nav.comparison')}</a>
                        <a href="#pricing" className="hover:text-white transition-colors">{t('nav.pricing')}</a>
                        <a href="#inspiration" className="hover:text-white transition-colors">{t('nav.inspiration')}</a>
                    </div>
                </div>
                <div className="hidden md:flex items-center gap-4">
                    <button
                        onClick={toggleLanguage}
                        className="text-sm text-text-secondary hover:text-white flex items-center gap-1 transition-colors"
                    >
                        <Globe size={16} />
                        <span>{language === 'zh' ? 'EN' : 'ZH'}</span>
                    </button>
                    {!user ? (
                        <>
                            <div className="text-sm text-text-secondary hover:text-white transition-colors cursor-pointer">
                                <GoogleOAuth useOneTap />
                            </div>
                            <button className="bg-white text-black px-5 py-2 rounded-full text-sm font-bold hover:scale-105 transition-transform flex items-center gap-1 group">
                                {t('nav.tryIt')} <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </>
                    ) : (
                        <div className="relative group/dropdown">
                            <div className="flex items-center gap-3 cursor-pointer p-1 rounded-full hover:bg-white/5 transition-colors">
                                <div className="text-right hidden sm:block">
                                    <div className="text-sm font-semibold truncate max-w-[120px]">{user.name}</div>
                                    <div className="text-xs text-brand-primary">Credits: {credits}</div>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-surface border border-white/10 overflow-hidden relative">
                                    {user.avatar ? (
                                        <Image src={user.avatar} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-lg">{user.name?.charAt(0)}</div>
                                    )}
                                </div>
                            </div>
                            {/* Dropdown Menu */}
                            <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover/dropdown:opacity-100 group-hover/dropdown:visible transition-all duration-200">
                                <div className="w-48 py-2 bg-[#1A1A1A] border border-white/10 rounded-xl shadow-xl flex flex-col gap-1">
                                    <a href="/base" className="w-full px-4 py-2 text-sm text-left hover:bg-white/5 flex items-center gap-2 transition-colors">
                                        <LayoutDashboard size={16} /> Console Dashboard
                                    </a>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full px-4 py-2 text-sm text-left hover:bg-white/5 text-red-400 flex items-center gap-2 transition-colors"
                                    >
                                        <LogOut size={16} /> Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <button className="md:hidden text-white">
                    <Menu />
                </button>
            </div>
        </nav>
    );
}

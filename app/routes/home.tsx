import Navbar from '~/features/nano-banana/components/Navbar';
import Hero from '~/features/nano-banana/components/Hero';
import BrandStory from '~/features/nano-banana/components/BrandStory';
import HowItWorks from '~/features/nano-banana/components/HowItWorks';
import Features from '~/features/nano-banana/components/Features';
import EditorDemo from '~/features/nano-banana/components/EditorDemo';
import Comparison from '~/features/nano-banana/components/Comparison';
import Inspiration from '~/features/nano-banana/components/Inspiration';
import UseCases from '~/features/nano-banana/components/UseCases';
import Pricing from '~/features/nano-banana/components/Pricing';
import Testimonials from '~/features/nano-banana/components/Testimonials';
import FAQ from '~/features/nano-banana/components/FAQ';
import BottomCTA from '~/features/nano-banana/components/BottomCTA';
import Footer from '~/features/nano-banana/components/Footer';
import { LanguageProvider } from '~/features/nano-banana/i18n/LanguageContext';

import type { Route } from './+types/home';

// SEO 元信息
export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Nano Banana AI - 独立 AI 图像编辑器" },
        {
            name: "description",
            content:
                "Nano Banana 是基于 Google AI 模型构建的独立 AI 图像编辑器，结合文字生成图像、快速推理与高精度视觉编辑，释放你的无限潜能。",
        },
    ];
}

// Nano Banana 落地页 — 首页
export default function HomePage() {
    return (
        <LanguageProvider>
            <div className="nano-banana-page min-h-screen bg-bg-deep text-text-primary selection:bg-blue-500/30">
                <Navbar />
                <main>
                    <Hero />
                    <EditorDemo />
                    <BrandStory />
                    <HowItWorks />
                    <Features />
                    <Comparison />
                    <Inspiration />
                    <UseCases />
                    <Pricing />
                    <Testimonials />
                    <FAQ />
                    <BottomCTA />
                </main>
                <Footer />
            </div>
        </LanguageProvider>
    );
}

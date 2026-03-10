import { motion } from 'motion/react';
import { Upload, Wand2, Settings2, Loader2, Download } from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext';
import { useState, useRef, useEffect } from 'react';
import { NANO_BANANA_TASK_CREDITS } from '~/constants/tasks';

// 编辑器演示组件 - 模型选择、提示词和画布区域
export default function EditorDemo() {
    const { t } = useTranslation();

    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [prompt, setPrompt] = useState(t('editor.promptDefault'));

    // 任务状态
    const [isGenerating, setIsGenerating] = useState(false);
    const [progress, setProgress] = useState(0);
    const [resultImage, setResultImage] = useState<string | null>(null);
    const [taskId, setTaskId] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
            // Reset task status when importing a new file
            setResultImage(null);
            setProgress(0);
            setTaskId(null);
        }
    };

    const handleGenerate = async () => {
        if (!file) {
            alert(t('editor.needUpload') || "Please upload an image first.");
            return;
        }

        setIsGenerating(true);
        setProgress(0);
        setResultImage(null);

        try {
            const formData = new FormData();
            formData.append("photo", file);
            formData.append("prompt", prompt);

            const res = await fetch("/api/create/nanobanana", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                const message = (await res.text()).trim();

                if (res.status === 401) {
                    throw new Error("Please sign in before generating an image.");
                }

                if (res.status === 402 || message === "Credits Insufficient") {
                    throw new Error("Insufficient credits. Please upgrade or recharge before generating.");
                }

                throw new Error(message || "Generation failed.");
            }

            const data = (await res.json()) as any;
            const newTaskNo = data.tasks?.[0]?.task_no;

            if (newTaskNo) {
                setTaskId(newTaskNo);
            } else {
                throw new Error("Missing Task ID");
            }

        } catch (error) {
            console.error(error);
            const message = error instanceof Error ? error.message : "An error occurred during task creation.";
            alert(message);
            setIsGenerating(false);
        }
    };

    // 轮询检查任务状态
    useEffect(() => {
        if (!taskId) return;

        let interval = setInterval(async () => {
            try {
                const res = await fetch(`/api/task/${taskId}`);
                const data = (await res.json()) as any;

                if (data.progress) {
                    setProgress(data.progress);
                }

                if (data.task?.status === "succeeded") {
                    setResultImage(data.task.result_url);
                    setIsGenerating(false);
                    setProgress(100);
                    clearInterval(interval);
                } else if (data.task?.status === "failed") {
                    alert(data.task.fail_reason || "Task failed on server.");
                    setIsGenerating(false);
                    clearInterval(interval);
                }
            } catch (error) {
                console.error("Fetch status error:", error);
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [taskId]);

    return (
        <section className="py-32">
            <div className="max-w-[1400px] mx-auto px-6">
                <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">{t('editor.title')}</h2>
                        <p className="text-lg text-text-secondary">{t('editor.desc')}</p>
                    </div>
                    <a href="#" className="text-blue-400 hover:text-blue-300 flex items-center gap-2 transition-colors">
                        {t('editor.mixboard')} <Wand2 size={16} />
                    </a>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* 控制面板 */}
                    <div className="lg:col-span-4 flex flex-col gap-4">
                        {/* 描述词区域 */}
                        <div className="bg-bg-surface border border-border-subtle rounded-3xl p-6 flex-1 flex flex-col">
                            <h3 className="font-bold mb-3 text-sm text-text-secondary uppercase tracking-wider">{t('editor.prompt')}</h3>
                            <textarea
                                className="w-full bg-bg-deep border border-border-subtle rounded-xl p-4 text-white placeholder-text-secondary/50 resize-none flex-1 min-h-[220px] focus:outline-none focus:border-white/30 transition-colors text-base"
                                placeholder={t('editor.promptPlaceholder')}
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                            ></textarea>
                            <button
                                onClick={handleGenerate}
                                disabled={isGenerating || !file}
                                className={`w-full mt-4 brand-gradient text-white font-bold py-3 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="animate-spin" size={18} />
                                        {progress > 0 ? `${progress}%` : t('editor.generating')}
                                    </>
                                ) : (
                                    <>
                                        <Wand2 size={18} />
                                        {t('editor.generate')}
                                    </>
                                )}
                            </button>
                        </div>

                        {/* 模型选择区域 */}
                        <div className="bg-bg-surface border border-border-subtle rounded-2xl px-4 py-3">
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-text-secondary text-sm shrink-0">{t('editor.modelSelect')}:</span>
                                <div className="flex items-center gap-1.5 bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 cursor-pointer hover:bg-white/15 transition-colors">
                                    <Settings2 size={14} className="text-yellow-400" />
                                    <span className="text-sm font-medium text-white">Nano Banana 2</span>
                                </div>
                                <div className="flex items-center gap-3 ml-auto text-sm text-text-secondary">
                                    <span className="text-xs opacity-60">{NANO_BANANA_TASK_CREDITS}{t('editor.points')}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 画布区域 */}
                    <div className="lg:col-span-8 bg-bg-surface border border-border-subtle rounded-3xl p-2 relative min-h-[500px] flex flex-col items-center justify-center overflow-hidden">

                        {/* 顶部按钮条 */}
                        <div className="absolute top-6 left-6 z-10 flex gap-2">
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                            />
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="bg-black/50 backdrop-blur-md border border-white/10 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-black/70 transition-colors"
                            >
                                <Upload size={16} /> {t('editor.uploadRef')}
                            </button>
                        </div>

                        {/* 图片展示区 */}
                        {resultImage ? (
                            <div className="flex-1 w-full h-full rounded-2xl overflow-hidden relative group">
                                <img
                                    src={resultImage}
                                    alt="Generated Result"
                                    className="w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                    <a
                                        href={resultImage}
                                        download="nano-banana-result.png"
                                        target="_blank"
                                        className="bg-white text-black px-6 py-2 rounded-full font-bold text-sm hover:scale-105 transition-transform flex items-center gap-2"
                                    >
                                        <Download size={16} /> {t('editor.download')}
                                    </a>
                                </div>
                            </div>
                        ) : previewUrl ? (
                            <div className="flex-1 w-full h-full rounded-2xl overflow-hidden relative">
                                <img
                                    src={previewUrl}
                                    alt="Upload Preview"
                                    className={`w-full h-full object-cover transition-all ${isGenerating ? 'opacity-50 blur-sm scale-105' : ''}`}
                                />
                                {isGenerating && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                                        <Loader2 className="w-12 h-12 text-white animate-spin mb-4" />
                                        <div className="bg-black/80 text-white px-4 py-2 rounded-full font-mono text-sm border border-white/10">
                                            {progress}%
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex-1 w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-2xl bg-white/5 m-4">
                                <div className="text-text-secondary text-center">
                                    <Upload size={48} className="mx-auto mb-4 opacity-50" />
                                    <p className="font-medium text-white mb-2">{t('editor.uploadRef')}</p>
                                    <p className="text-sm">PNG, JPG up to 10MB</p>
                                    <button
                                        className="mt-6 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-sm"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        {t('editor.selectFile')}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

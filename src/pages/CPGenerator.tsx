import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Copy, Download, RefreshCw, Heart, Check, Sparkles } from "lucide-react";
import { generateCP, worldviews } from "@/lib/characterData";
import { toast } from "@/hooks/use-toast";
import html2canvas from "html2canvas";

type CPResult = ReturnType<typeof generateCP>;

const CharCard = ({ title, data, gradient }: { title: string; data: Record<string, string>; gradient: string }) => (
  <div className="rounded-2xl bg-card border border-border p-7 h-full" style={{ boxShadow: "var(--shadow-card)" }}>
    <div className="flex items-center gap-3.5 mb-6">
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-primary-foreground font-bold text-lg shadow-sm`}>
        {data.姓名?.[0] || "?"}
      </div>
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">{title}</div>
        <div className="font-bold text-lg text-foreground">{data.姓名}</div>
      </div>
    </div>
    {Object.entries(data).filter(([k]) => k !== "姓名").map(([k, v]) => (
      <div key={k} className="mb-4">
        <div className="field-label mb-1">{k}</div>
        <div className="text-sm leading-relaxed text-foreground/80">{v}</div>
      </div>
    ))}
  </div>
);

const CPGenerator = () => {
  const [result, setResult] = useState<CPResult | null>(null);
  const [generating, setGenerating] = useState(false);
  const [worldview, setWorldview] = useState("");
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleGenerate = () => {
    setGenerating(true);
    setResult(null);
    setTimeout(() => {
      setResult(generateCP(worldview || undefined));
      setGenerating(false);
    }, 600);
  };

  const handleCopy = () => {
    if (!result) return;
    const text = [
      "【角色A】", ...Object.entries(result.a).map(([k, v]) => `${k}：${v}`), "",
      "【角色B】", ...Object.entries(result.b).map(([k, v]) => `${k}：${v}`), "",
      "【关系信息】", ...Object.entries(result.rel).map(([k, v]) => `${k}：${v}`),
    ].join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast({ title: "已复制到剪贴板", description: "CP设定已复制" });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async () => {
    if (!cardRef.current) return;
    try {
      const canvas = await html2canvas(cardRef.current, { backgroundColor: "#ffffff", scale: 2, useCORS: true });
      const link = document.createElement("a");
      link.download = `CP-${result?.a.姓名}-${result?.b.姓名}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      toast({ title: "下载成功", description: "CP角色卡已保存" });
    } catch {
      toast({ title: "下载失败", variant: "destructive" });
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">CP关系生成器</h1>
          <p className="text-sm text-muted-foreground mt-1.5">生成两个角色并构建他们之间的关系张力</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <select value={worldview} onChange={e => setWorldview(e.target.value)}
              className="bg-card text-foreground text-sm rounded-xl px-4 py-3 appearance-none border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 pr-8 hover:border-primary/20 transition-all">
              <option value="">随机世界观</option>
              {worldviews.map(w => <option key={w} value={w}>{w}</option>)}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
          </div>
          <button onClick={handleGenerate} className="btn-primary text-sm flex items-center gap-2">
            <Users className="w-4 h-4" /> 生成CP
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {generating ? (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-36">
            <div className="w-12 h-12 rounded-full border-[3px] border-primary/30 border-t-primary animate-spin mb-5" />
            <p className="text-sm text-muted-foreground font-medium">正在生成CP关系…</p>
          </motion.div>
        ) : result ? (
          <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
            <div ref={cardRef} className="grid grid-cols-3 gap-6 items-stretch">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
                <CharCard title="角色A" data={result.a} gradient="from-violet-500 to-indigo-500" />
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
                <div className="rounded-2xl bg-card border border-border p-7 h-full relative" style={{ boxShadow: "var(--shadow-elevated)" }}>
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center shadow-md" style={{ background: "var(--gradient-primary)" }}>
                      <Heart className="w-4 h-4 text-primary-foreground" />
                    </div>
                  </div>
                  <h3 className="font-bold text-foreground mb-6 text-center mt-3 text-lg">关系信息</h3>
                  {Object.entries(result.rel).map(([k, v]) => (
                    <div key={k} className="mb-5">
                      <div className="field-label mb-1.5">{k}</div>
                      <div className="text-sm leading-relaxed text-foreground/80 whitespace-pre-line">{v}</div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
                <CharCard title="角色B" data={result.b} gradient="from-rose-500 to-pink-500" />
              </motion.div>
            </div>

            <div className="flex gap-2 mt-8 justify-center">
              <button onClick={handleCopy} className="btn-ghost">
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />} {copied ? "已复制" : "复制CP设定"}
              </button>
              <button onClick={handleDownload} className="btn-ghost">
                <Download className="w-4 h-4" /> 下载CP角色卡
              </button>
              <button onClick={handleGenerate} className="btn-ghost">
                <RefreshCw className="w-4 h-4" /> 重新生成
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-36 text-muted-foreground">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 bg-accent border border-border">
              <Sparkles className="w-8 h-8 text-primary/30" />
            </div>
            <p className="text-base font-semibold text-foreground/60 mb-1.5">准备创作</p>
            <p className="text-sm text-muted-foreground/60">点击「生成CP」开始创作角色关系</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CPGenerator;

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Copy, Download, RefreshCw, Heart, Check } from "lucide-react";
import { generateCP, worldviews } from "@/lib/characterData";
import { toast } from "@/hooks/use-toast";
import html2canvas from "html2canvas";

type CPResult = ReturnType<typeof generateCP>;

const CharCard = ({ title, data, gradient }: { title: string; data: Record<string, string>; gradient: string }) => (
  <div className="rounded-2xl bg-card border border-border p-6 h-full" style={{ boxShadow: "var(--shadow-card)" }}>
    <div className="flex items-center gap-3 mb-5">
      <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-primary-foreground font-bold`}>
        {data.姓名?.[0] || "?"}
      </div>
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</div>
        <div className="font-bold text-foreground">{data.姓名}</div>
      </div>
    </div>
    {Object.entries(data).filter(([k]) => k !== "姓名").map(([k, v]) => (
      <div key={k} className="mb-3">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">{k}</div>
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
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-bold text-foreground">CP关系生成器</h1>
          <p className="text-sm text-muted-foreground mt-1">生成两个角色并构建他们之间的关系张力</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <select value={worldview} onChange={e => setWorldview(e.target.value)}
              className="bg-card text-foreground text-sm rounded-xl px-4 py-2.5 appearance-none border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 pr-8">
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
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-32">
            <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin mb-4" />
            <p className="text-sm text-muted-foreground">正在生成CP关系…</p>
          </motion.div>
        ) : result ? (
          <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
            <div ref={cardRef} className="grid grid-cols-3 gap-5 items-stretch">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1, duration: 0.4 }}>
                <CharCard title="角色A" data={result.a} gradient="from-violet-400 to-indigo-400" />
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.4 }}>
                <div className="rounded-2xl bg-card border border-border p-6 h-full relative" style={{ boxShadow: "var(--shadow-card)" }}>
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center shadow-md" style={{ background: "var(--gradient-primary)" }}>
                      <Heart className="w-3.5 h-3.5 text-primary-foreground" />
                    </div>
                  </div>
                  <h3 className="font-bold text-foreground mb-5 text-center mt-2">关系信息</h3>
                  {Object.entries(result.rel).map(([k, v]) => (
                    <div key={k} className="mb-4">
                      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">{k}</div>
                      <div className="text-sm leading-relaxed text-foreground/80 whitespace-pre-line">{v}</div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1, duration: 0.4 }}>
                <CharCard title="角色B" data={result.b} gradient="from-rose-400 to-pink-400" />
              </motion.div>
            </div>

            <div className="flex gap-2 mt-6 justify-center">
              <button onClick={handleCopy} className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground px-4 py-2.5 rounded-xl hover:bg-card border border-transparent hover:border-border transition-all">
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />} {copied ? "已复制" : "复制CP设定"}
              </button>
              <button onClick={handleDownload} className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground px-4 py-2.5 rounded-xl hover:bg-card border border-transparent hover:border-border transition-all">
                <Download className="w-4 h-4" /> 下载CP角色卡
              </button>
              <button onClick={handleGenerate} className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground px-4 py-2.5 rounded-xl hover:bg-card border border-transparent hover:border-border transition-all">
                <RefreshCw className="w-4 h-4" /> 重新生成
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-32 text-muted-foreground">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 bg-muted/50">
              <Users className="w-7 h-7 opacity-40" />
            </div>
            <p className="text-sm font-medium mb-1">还没有CP</p>
            <p className="text-xs text-muted-foreground/60">点击"生成CP"开始创作角色关系</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CPGenerator;

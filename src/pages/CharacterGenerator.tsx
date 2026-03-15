import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wand2, Copy, Download, RefreshCw, Check, Sparkles } from "lucide-react";
import { generateCharacter, worldviews, occupations, genders } from "@/lib/characterData";
import { toast } from "@/hooks/use-toast";
import html2canvas from "html2canvas";

const fieldOrder = ["姓名", "世界观", "身份", "角色定位", "性格特质", "外貌特征", "外在气质", "兴趣偏好", "成长背景", "核心矛盾", "人物秘密", "剧情钩子"];
const longFields = ["成长背景", "核心矛盾", "人物秘密", "剧情钩子"];

const fieldIcons: Record<string, string> = {
  姓名: "✦", 世界观: "🌍", 身份: "⚔", 角色定位: "🎭", 性格特质: "💎",
  外貌特征: "👤", 外在气质: "✨", 兴趣偏好: "🎯", 成长背景: "📖",
  核心矛盾: "⚡", 人物秘密: "🔒", 剧情钩子: "🪝",
};

const SelectField = ({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) => (
  <div>
    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">{label}</label>
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-background text-foreground text-sm rounded-xl px-4 py-3 appearance-none focus:outline-none focus:ring-2 focus:ring-primary/30 border border-border transition-all hover:border-primary/30"
      >
        <option value="">随机</option>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>
    </div>
  </div>
);

const CharacterGenerator = () => {
  const [worldview, setWorldview] = useState("");
  const [occupation, setOccupation] = useState("");
  const [gender, setGender] = useState("");
  const [locked, setLocked] = useState(false);
  const [character, setCharacter] = useState<Record<string, string> | null>(null);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleGenerate = () => {
    setGenerating(true);
    setCharacter(null);
    setTimeout(() => {
      const char = generateCharacter({
        worldview: worldview || undefined,
        occupation: occupation || undefined,
        gender: gender || undefined,
      });
      setCharacter(char);
      setGenerating(false);
      if (!locked) {
        setWorldview("");
        setOccupation("");
        setGender("");
      }
    }, 500);
  };

  const handleCopy = () => {
    if (!character) return;
    const text = fieldOrder.map((k) => `【${k}】${character[k]}`).join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast({ title: "已复制到剪贴板", description: "角色卡文本已复制" });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async () => {
    if (!cardRef.current) return;
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
      });
      const link = document.createElement("a");
      link.download = `${character?.姓名 || "角色卡"}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      toast({ title: "下载成功", description: "角色卡图片已保存" });
    } catch {
      toast({ title: "下载失败", description: "请稍后重试", variant: "destructive" });
    }
  };

  return (
    <div className="flex h-full min-h-screen">
      {/* Left Panel */}
      <div className="w-[300px] p-6 flex-shrink-0">
        <div className="sticky top-6">
          <div className="rounded-2xl p-6 bg-card border border-border" style={{ boxShadow: "var(--shadow-card)" }}>
            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--gradient-primary)" }}>
                <Sparkles className="w-4 h-4 text-primary-foreground" />
              </div>
              <h2 className="font-bold text-foreground">生成设置</h2>
            </div>
            <div className="flex flex-col gap-4">
              <SelectField label="世界观" options={worldviews} value={worldview} onChange={setWorldview} />
              <SelectField label="职业 / 身份" options={occupations} value={occupation} onChange={setOccupation} />
              <SelectField label="性别" options={genders} value={gender} onChange={setGender} />
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-foreground font-medium">锁定条件</span>
                <button
                  onClick={() => setLocked(!locked)}
                  className={`w-11 h-6 rounded-full relative transition-all duration-300 ${locked ? "" : "bg-muted"}`}
                  style={locked ? { background: "var(--gradient-primary)" } : {}}
                >
                  <span className={`block w-5 h-5 bg-card rounded-full absolute top-0.5 transition-all duration-300 shadow-sm ${locked ? "left-[22px]" : "left-0.5"}`} />
                </button>
              </div>
            </div>
            <button onClick={handleGenerate} className="btn-primary w-full mt-6 flex items-center justify-center gap-2 text-sm">
              <Wand2 className="w-4 h-4" /> 随机生成角色
            </button>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 p-6 pl-0 overflow-auto">
        <AnimatePresence mode="wait">
          {generating ? (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-32">
              <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin mb-4" />
              <p className="text-sm text-muted-foreground">正在生成角色…</p>
            </motion.div>
          ) : character ? (
            <motion.div key="result" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <div ref={cardRef} className="rounded-2xl bg-card border border-border p-8" style={{ boxShadow: "var(--shadow-card)" }}>
                {/* Header */}
                <div className="flex items-center gap-4 mb-8 pb-6 border-b border-border">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold text-primary-foreground" style={{ background: "var(--gradient-primary)" }}>
                    {character.姓名[0]}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">{character.姓名}</h2>
                    <p className="text-sm text-muted-foreground mt-0.5">{character.世界观} · {character.身份}</p>
                  </div>
                  <div className="ml-auto">
                    <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-primary/10 text-primary">{character.角色定位}</span>
                  </div>
                </div>

                {/* Fields grid */}
                <div className="grid grid-cols-2 gap-x-10 gap-y-6">
                  {fieldOrder.filter(k => !["姓名", "世界观", "身份", "角色定位"].includes(k)).map((key, i) => (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.3 }}
                      className={longFields.includes(key) ? "col-span-2" : ""}
                    >
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <span className="text-xs">{fieldIcons[key]}</span>
                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{key}</span>
                      </div>
                      <div className="text-[15px] leading-relaxed text-foreground/80">{character[key]}</div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-5">
                <button onClick={handleCopy} className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground px-4 py-2.5 rounded-xl hover:bg-card border border-transparent hover:border-border transition-all">
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  {copied ? "已复制" : "复制文本"}
                </button>
                <button onClick={handleDownload} className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground px-4 py-2.5 rounded-xl hover:bg-card border border-transparent hover:border-border transition-all">
                  <Download className="w-4 h-4" /> 下载角色卡图片
                </button>
                <button onClick={handleGenerate} className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground px-4 py-2.5 rounded-xl hover:bg-card border border-transparent hover:border-border transition-all">
                  <RefreshCw className="w-4 h-4" /> 重新生成
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-32 text-muted-foreground">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 bg-muted/50">
                <Wand2 className="w-7 h-7 opacity-40" />
              </div>
              <p className="text-sm font-medium mb-1">还没有角色</p>
              <p className="text-xs text-muted-foreground/60">点击左侧"随机生成角色"开始创作</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CharacterGenerator;

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wand2, Copy, Download, RefreshCw, Lock, Unlock } from "lucide-react";

const worldviews = ["古风仙侠", "都市现实", "西幻魔法", "末日废土", "现代校园", "赛博朋克", "历史架空"];
const occupations = ["剑修", "法医", "治愈师", "佣兵", "学生", "侦探", "商人", "刺客"];
const genders = ["男", "女", "非二元"];

const sampleCharacter = {
  姓名: "苏晚棠",
  世界观: "古风仙侠",
  身份: "天璇宗外门弟子 · 剑修",
  角色定位: "隐忍成长型主角",
  性格特质: "外冷内热，极度自律，不善表达感情，但对认定的人会拼尽全力守护",
  外貌特征: "墨发高束，剑眉星目，左手腕处有淡金色灵纹。常着素白剑袍，腰悬黑鞘长剑",
  外在气质: "清冷疏离，沉默寡言，行走间带着一种不自觉的锋芒",
  兴趣偏好: "夜观星象，独自练剑，收集各地的古籍残卷",
  成长背景: "幼时被遗弃在雪山，被一位隐居老剑客收养。十二岁时师父失踪，被迫独自求生入宗门",
  核心矛盾: "渴望被认可却害怕建立关系；追求力量却恐惧失控",
  人物秘密: "体内封印着一段被禁忌的上古剑意，每次动用都会侵蚀神识",
  剧情钩子: "一次意外中，封印出现裂痕，她开始听到一个陌生的声音在引导她前往传说中的剑冢……",
};

const fieldOrder = Object.keys(sampleCharacter);

const SelectField = ({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) => (
  <div>
    <label className="text-label mb-2 block">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-card text-foreground text-sm rounded-lg px-3 py-2.5 appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <option value="">随机</option>
      {options.map((o) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  </div>
);

const CharacterGenerator = () => {
  const [worldview, setWorldview] = useState("");
  const [occupation, setOccupation] = useState("");
  const [gender, setGender] = useState("");
  const [locked, setLocked] = useState(false);
  const [character, setCharacter] = useState<Record<string, string> | null>(null);
  const [generating, setGenerating] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setCharacter(null);
    setTimeout(() => {
      setCharacter(sampleCharacter);
      setGenerating(false);
    }, 600);
  };

  const handleCopy = () => {
    if (!character) return;
    const text = Object.entries(character).map(([k, v]) => `【${k}】${v}`).join("\n");
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="flex h-full min-h-screen">
      {/* Left Panel */}
      <div className="w-[320px] p-6">
        <div className="surface-sunken rounded-2xl p-6">
          <h2 className="text-display text-lg mb-6">生成设置</h2>
          <div className="flex flex-col gap-5">
            <SelectField label="世界观" options={worldviews} value={worldview} onChange={setWorldview} />
            <SelectField label="职业 / 身份" options={occupations} value={occupation} onChange={setOccupation} />
            <SelectField label="性别" options={genders} value={gender} onChange={setGender} />
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground font-medium">锁定条件</span>
              <button
                onClick={() => setLocked(!locked)}
                className={`w-11 h-6 rounded-full relative transition-all duration-200 ${locked ? "" : "bg-muted"}`}
                style={locked ? { background: "var(--gradient-primary)" } : {}}
              >
                <span className={`block w-5 h-5 bg-card rounded-full absolute top-0.5 transition-all duration-200 ${locked ? "left-[22px]" : "left-0.5"}`}
                  style={{ boxShadow: "0 1px 3px rgba(0,0,0,.1)" }}
                />
              </button>
            </div>
          </div>
          <button onClick={handleGenerate} className="btn-primary w-full mt-8 flex items-center justify-center gap-2 text-sm">
            <Wand2 className="w-4 h-4" /> 随机生成角色
          </button>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 p-6 pl-0">
        <div className="card-surface min-h-[600px]">
          <h2 className="text-display text-lg mb-6">角色卡</h2>
          <AnimatePresence mode="wait">
            {generating ? (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-center py-24">
                <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              </motion.div>
            ) : character ? (
              <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                <div className="grid grid-cols-2 gap-x-12 gap-y-5">
                  {fieldOrder.map((key, i) => (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.3, ease: [0.2, 0, 0, 1] }}
                      className={fieldOrder.indexOf(key) >= fieldOrder.length - 3 ? "col-span-2" : ""}
                    >
                      <div className="text-label mb-1">{key}</div>
                      <div className="text-value">{character[key]}</div>
                    </motion.div>
                  ))}
                </div>
                <div className="flex gap-3 mt-8 pt-6" style={{ borderTop: "1px solid hsl(var(--border))" }}>
                  <button onClick={handleCopy} className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground px-4 py-2 rounded-lg hover:bg-muted transition-all">
                    <Copy className="w-4 h-4" /> 复制文本
                  </button>
                  <button className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground px-4 py-2 rounded-lg hover:bg-muted transition-all">
                    <Download className="w-4 h-4" /> 下载角色卡图片
                  </button>
                  <button onClick={handleGenerate} className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground px-4 py-2 rounded-lg hover:bg-muted transition-all">
                    <RefreshCw className="w-4 h-4" /> 重新生成
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-24 text-muted-foreground">
                <Wand2 className="w-10 h-10 mb-4 opacity-30" />
                <p className="text-sm">点击"随机生成角色"开始创作</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default CharacterGenerator;

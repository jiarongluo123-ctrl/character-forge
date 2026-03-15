import { Wand2, Users, MessageSquare, Lock, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const recentCharacters = [
  { name: "苏晚棠", world: "古风仙侠", trait: "外冷内热 · 剑修", color: "from-violet-400 to-indigo-400" },
  { name: "林默深", world: "都市悬疑", trait: "冷静理性 · 法医", color: "from-sky-400 to-blue-400" },
  { name: "艾琳·霜语", world: "西幻魔法", trait: "倔强善良 · 治愈师", color: "from-emerald-400 to-teal-400" },
  { name: "陆知行", world: "现代校园", trait: "温柔隐忍 · 学长", color: "from-amber-400 to-orange-400" },
  { name: "夜寒星", world: "末日废土", trait: "孤傲果断 · 佣兵", color: "from-rose-400 to-pink-400" },
];

const features = [
  {
    icon: Wand2,
    title: "随机角色生成",
    desc: "一键生成完整OC角色卡，包括身份、性格、背景与剧情钩子",
    btn: "开始生成",
    to: "/generator",
    enabled: true,
  },
  {
    icon: Users,
    title: "CP关系生成",
    desc: "生成两个角色，并构建他们之间的关系张力与相遇剧情",
    btn: "生成CP",
    to: "/cp-generator",
    enabled: true,
  },
  {
    icon: MessageSquare,
    title: "角色共创 🔒",
    desc: "通过角色视角回答问题，一步步构建你的专属OC",
    btn: "Coming Soon",
    to: "",
    enabled: false,
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.2, 0, 0, 1] } },
};

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto px-8 pt-16 pb-12">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.2, 0, 0, 1] }}>
        <h1 className="text-display text-3xl mb-3">赋予你的角色灵魂。</h1>
        <p className="text-muted-foreground text-base max-w-xl leading-relaxed mb-2">
          AI辅助角色创作工具 —— 为小说作者、OC创作者与同人创作者提供灵感生成
        </p>
        <p className="text-xs text-muted-foreground/60 mb-12 tabular-nums">已为创作者提供 1,240,812 次灵感瞬间</p>
      </motion.div>

      <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16" variants={container} initial="hidden" animate="show">
        {features.map((f) => (
          <motion.div key={f.title} variants={item} className="card-surface-hover flex flex-col">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-5" style={{ background: f.enabled ? "var(--gradient-primary)" : undefined, backgroundColor: f.enabled ? undefined : "hsl(var(--muted))" }}>
              <f.icon className={`w-5 h-5 ${f.enabled ? "text-primary-foreground" : "text-muted-foreground"}`} />
            </div>
            <h3 className="font-semibold text-foreground mb-2">{f.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-6">{f.desc}</p>
            {f.enabled ? (
              <button onClick={() => navigate(f.to)} className="btn-primary text-sm flex items-center justify-center gap-2">
                {f.btn} <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button disabled className="bg-muted text-muted-foreground text-sm font-medium px-6 py-3 rounded-lg flex items-center justify-center gap-2 cursor-not-allowed">
                <Lock className="w-3.5 h-3.5" /> {f.btn}
              </button>
            )}
          </motion.div>
        ))}
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.5 }}>
        <h2 className="text-label mb-4">最近生成角色</h2>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {recentCharacters.map((c) => (
            <div key={c.name} className="card-surface min-w-[180px] !p-5 flex flex-col gap-3 cursor-default">
              <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${c.color} flex items-center justify-center text-primary-foreground font-bold text-sm`}>
                {c.name[0]}
              </div>
              <div>
                <div className="font-semibold text-sm text-foreground">{c.name}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{c.world}</div>
                <div className="text-xs text-muted-foreground/70 mt-1">{c.trait}</div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Index;

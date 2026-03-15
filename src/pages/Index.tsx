import { Wand2, Users, MessageSquare, Lock, ArrowRight, Sparkles, BookOpen, Compass } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const inspirationCards = [
  { name: "苏晚棠", identity: "剑修 · 宗门弃徒", world: "古风仙侠", color: "from-violet-500 to-indigo-500", emoji: "⚔" },
  { name: "林默深", identity: "法医 · 犯罪心理分析师", world: "都市悬疑", color: "from-sky-500 to-blue-500", emoji: "🔍" },
  { name: "艾琳·霜语", identity: "精灵治愈师 · 流亡者", world: "西幻魔法", color: "from-emerald-500 to-teal-500", emoji: "🌿" },
  { name: "陆知行", identity: "校园文学社社长", world: "现代校园", color: "from-amber-500 to-orange-500", emoji: "📚" },
  { name: "夜寒星", identity: "废土佣兵 · 赏金猎人", world: "末日废土", color: "from-rose-500 to-pink-500", emoji: "🔥" },
  { name: "卫霁", identity: "锦衣卫暗探", world: "古代宫廷", color: "from-yellow-500 to-amber-500", emoji: "🏯" },
];

const features = [
  {
    icon: Wand2, title: "随机角色生成",
    desc: "一键生成完整OC角色卡，包括身份、性格、背景与剧情钩子。每次生成都是全新的角色。",
    btn: "开始生成", to: "/generator", enabled: true,
    accent: "from-violet-500 to-indigo-500",
  },
  {
    icon: Users, title: "CP关系生成",
    desc: "生成两个角色，并构建他们之间的关系张力、相遇场景与剧情可能性。",
    btn: "生成CP", to: "/cp-generator", enabled: true,
    accent: "from-sky-500 to-blue-500",
  },
  {
    icon: MessageSquare, title: "角色共创",
    desc: "通过角色视角回答问题，一步步构建你的专属OC。互动式创作体验。",
    btn: "Coming Soon", to: "", enabled: false,
    accent: "from-muted to-muted",
  },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } } };

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-5xl mx-auto px-10 pt-20 pb-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
        {/* Hero */}
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/8 text-primary text-xs font-semibold mb-6 border border-primary/10">
            <Sparkles className="w-3.5 h-3.5" /> AI驱动 · 为创作者而生
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight text-foreground mb-4 leading-[1.15]">
            赋予你的角色
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-primary)" }}>灵魂。</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
            AI辅助角色创作工具 —— 为小说作者、OC创作者与同人创作者提供无限灵感
          </p>
          <div className="flex items-center gap-6 mt-8">
            <button onClick={() => navigate("/generator")} className="btn-primary text-sm flex items-center gap-2.5 px-8 py-3.5">
              <Wand2 className="w-4 h-4" /> 开始创作
            </button>
            <button onClick={() => navigate("/cp-generator")} className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              <Compass className="w-4 h-4" /> 探索CP生成 <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Feature cards */}
      <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20" variants={container} initial="hidden" animate="show">
        {features.map((f) => (
          <motion.div key={f.title} variants={item}
            className="group rounded-2xl bg-card border border-border p-8 flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br ${f.accent} ${!f.enabled ? 'opacity-40' : ''} transition-transform duration-300 group-hover:scale-110`}>
              <f.icon className="w-5.5 h-5.5 text-primary-foreground" />
            </div>
            <h3 className="font-bold text-lg text-foreground mb-2.5">
              {f.title}
              {!f.enabled && <Lock className="w-3.5 h-3.5 inline ml-2 text-muted-foreground" />}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-8">{f.desc}</p>
            {f.enabled ? (
              <button onClick={() => navigate(f.to)} className="btn-primary text-sm flex items-center justify-center gap-2">
                {f.btn} <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button disabled className="bg-muted text-muted-foreground text-sm font-medium px-6 py-3 rounded-xl flex items-center justify-center gap-2 cursor-not-allowed">
                <Lock className="w-3.5 h-3.5" /> {f.btn}
              </button>
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* Inspiration section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.6 }}>
        <div className="flex items-center gap-2.5 mb-6">
          <BookOpen className="w-4 h-4 text-muted-foreground" />
          <h2 className="section-title">创作灵感示例</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {inspirationCards.map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.07, duration: 0.4 }}
              className="group rounded-2xl bg-card border border-border p-6 flex flex-col gap-4 cursor-default transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center text-lg shadow-sm`}>
                  {c.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm text-foreground">{c.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5 truncate">{c.identity}</div>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-accent text-muted-foreground">{c.world}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Index;

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Copy, Download, RefreshCw, Heart } from "lucide-react";

const sampleA = {
  姓名: "苏晚棠",
  身份: "天璇宗外门弟子 · 剑修",
  性格: "外冷内热，极度自律",
  外貌: "墨发高束，剑眉星目，清冷疏离",
};

const sampleB = {
  姓名: "顾渊",
  身份: "魔族少主 · 被放逐的王子",
  性格: "张扬不羁，内心孤独",
  外貌: "银发赤瞳，妖冶俊美，左眼藏有封印",
};

const sampleRelation = {
  相遇场景: "在禁地深处的剑冢中，苏晚棠试图拔出封印之剑时，意外唤醒了被封印千年的顾渊。两人在黑暗中对峙，却因为共同感应到的剑意而停下了手。",
  关系类型: "宿敌转知己 · 相互救赎",
  关系张力: "身份对立（正道与魔族），却因为相似的被遗弃经历产生共鸣。苏晚棠需要顾渊的力量来控制体内剑意，顾渊需要苏晚棠的剑心来解除自己的封印。",
  剧情可能性: "1. 被宗门发现交往后的信任危机\n2. 共同对抗真正的幕后黑手\n3. 封印解除后顾渊恢复记忆，发现两人前世的纠葛\n4. 最终决战中的生死抉择",
};

const CharCard = ({ title, data, color }: { title: string; data: Record<string, string>; color: string }) => (
  <div className="card-surface flex-1 !p-6">
    <div className="flex items-center gap-3 mb-5">
      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-primary-foreground font-bold text-sm`}>
        {data.姓名[0]}
      </div>
      <h3 className="font-semibold text-foreground">{title}</h3>
    </div>
    {Object.entries(data).map(([k, v]) => (
      <div key={k} className="mb-3">
        <div className="text-label mb-0.5">{k}</div>
        <div className="text-value text-sm">{v}</div>
      </div>
    ))}
  </div>
);

const CPGenerator = () => {
  const [result, setResult] = useState<{ a: typeof sampleA; b: typeof sampleB; rel: typeof sampleRelation } | null>(null);
  const [generating, setGenerating] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setResult(null);
    setTimeout(() => {
      setResult({ a: sampleA, b: sampleB, rel: sampleRelation });
      setGenerating(false);
    }, 800);
  };

  const handleCopy = () => {
    if (!result) return;
    const text = [
      "【角色A】",
      ...Object.entries(result.a).map(([k, v]) => `${k}：${v}`),
      "",
      "【角色B】",
      ...Object.entries(result.b).map(([k, v]) => `${k}：${v}`),
      "",
      "【关系信息】",
      ...Object.entries(result.rel).map(([k, v]) => `${k}：${v}`),
    ].join("\n");
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-display text-xl">CP关系生成器</h1>
          <p className="text-sm text-muted-foreground mt-1">生成两个角色并构建他们之间的关系张力</p>
        </div>
        <button onClick={handleGenerate} className="btn-primary text-sm flex items-center gap-2">
          <Users className="w-4 h-4" /> 生成CP
        </button>
      </div>

      <AnimatePresence mode="wait">
        {generating ? (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-center py-32">
            <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          </motion.div>
        ) : result ? (
          <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
            <div className="flex items-stretch gap-4">
              <motion.div className="flex-1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1, duration: 0.4, ease: [0.2, 0, 0, 1] }}>
                <CharCard title="角色A" data={result.a} color="from-violet-400 to-indigo-400" />
              </motion.div>

              <motion.div className="w-[400px]" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.4, ease: [0.2, 0, 0, 1] }}>
                <div className="card-surface !p-8 h-full relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "var(--gradient-primary)" }}>
                      <Heart className="w-3 h-3 text-primary-foreground" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-foreground mb-5 text-center">关系信息</h3>
                  {Object.entries(result.rel).map(([k, v]) => (
                    <div key={k} className="mb-4">
                      <div className="text-label mb-1">{k}</div>
                      <div className="text-value text-sm whitespace-pre-line">{v}</div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div className="flex-1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1, duration: 0.4, ease: [0.2, 0, 0, 1] }}>
                <CharCard title="角色B" data={result.b} color="from-rose-400 to-pink-400" />
              </motion.div>
            </div>

            <div className="flex gap-3 mt-6 justify-center">
              <button onClick={handleCopy} className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground px-4 py-2 rounded-lg hover:bg-card transition-all">
                <Copy className="w-4 h-4" /> 复制CP设定
              </button>
              <button className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground px-4 py-2 rounded-lg hover:bg-card transition-all">
                <Download className="w-4 h-4" /> 下载CP角色卡
              </button>
              <button onClick={handleGenerate} className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground px-4 py-2 rounded-lg hover:bg-card transition-all">
                <RefreshCw className="w-4 h-4" /> 重新生成
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-32 text-muted-foreground">
            <Users className="w-10 h-10 mb-4 opacity-30" />
            <p className="text-sm">点击"生成CP"开始创作角色关系</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CPGenerator;

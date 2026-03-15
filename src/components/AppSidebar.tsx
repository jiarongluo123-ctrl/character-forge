import { NavLink, useLocation } from "react-router-dom";
import { Sparkles, Users, Home, Wand2 } from "lucide-react";

const navItems = [
  { to: "/", label: "首页", icon: Home },
  { to: "/generator", label: "角色生成", icon: Wand2 },
  { to: "/cp-generator", label: "CP生成", icon: Users },
];

const AppSidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-[260px] min-h-screen bg-card/80 backdrop-blur-xl border-r border-border flex flex-col py-8 px-5">
      <div className="flex items-center gap-3 px-3 mb-12">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm" style={{ background: "var(--gradient-primary)" }}>
          <Sparkles className="w-4.5 h-4.5 text-primary-foreground" />
        </div>
        <div>
          <span className="font-bold text-[15px] tracking-tight text-foreground block leading-tight">OC创作实验室</span>
          <span className="text-[10px] text-muted-foreground/60 font-medium tracking-wide">AI Creative Studio</span>
        </div>
      </div>
      <nav className="flex flex-col gap-1.5">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                ${isActive
                  ? "text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              style={isActive ? { background: "var(--gradient-primary)", boxShadow: "0 4px 14px -2px hsla(243, 100%, 70%, 0.3)" } : {}}
            >
              <item.icon className="w-[18px] h-[18px]" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
      <div className="mt-auto px-3 pt-6 border-t border-border">
        <div className="text-[11px] text-muted-foreground/40 font-medium">© 2026 OC创作实验室</div>
      </div>
    </aside>
  );
};

export default AppSidebar;

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
    <aside className="w-[240px] min-h-screen bg-card border-r border-border flex flex-col py-6 px-4">
      <div className="flex items-center gap-2.5 px-3 mb-10">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--gradient-primary)" }}>
          <Sparkles className="w-4 h-4 text-primary-foreground" />
        </div>
        <span className="font-bold text-base tracking-tight text-foreground">OC创作实验室</span>
      </div>
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                ${isActive
                  ? "text-foreground bg-accent"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                }`}
              style={isActive ? { boxShadow: "inset 0 0 0 1px hsl(var(--border))" } : {}}
            >
              <item.icon className="w-[18px] h-[18px]" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
      <div className="mt-auto px-3 pt-6 border-t border-border">
        <div className="text-xs text-muted-foreground/50">© 2026 OC创作实验室</div>
      </div>
    </aside>
  );
};

export default AppSidebar;

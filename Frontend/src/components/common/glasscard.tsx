import type { FC, ReactNode } from "react";
interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export const GlassCard: FC<GlassCardProps> = ({ children, className = '', hoverEffect = false }) => {
  return (
    <div 
      className={`backdrop-blur-md bg-white/4 border border-white/8 rounded-2xl shadow-xl transition-all duration-300 ${
        hoverEffect ? 'hover:bg-white/8 hover:border-white/15 hover:-translate-y-1.5 hover:shadow-indigo-500/20' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};
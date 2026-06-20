import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "motion/react";
import { Compass, Bookmark, Settings, User, Info, Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "./theme-provider";

export function FloatingNavbar() {
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia("(prefers-color-scheme: dark)").matches);

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  const links = [
    { href: '/', label: 'Explore', icon: Compass },
    { href: '/bookmarks', label: 'Saved', icon: Bookmark },
    { href: '/profile', label: 'Profile', icon: User },
    { href: '/about', label: 'About', icon: Info },
  ];

  return (
    <motion.div 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.1 }}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-4"
    >
      <nav className="glass-panel glass-highlight rounded-full px-4 py-2 flex items-center gap-1 shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
        <div className="flex items-center space-x-1 mr-4 border-r border-zinc-200 dark:border-zinc-800 pr-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#0A84FF]"/>
          </svg>
          <span className="font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight hidden sm:inline-block">Pathlight</span>
        </div>
        
        {links.map((link) => {
          const isActive = location.pathname === link.href || (link.href !== '/' && location.pathname.startsWith(link.href));
          const Icon = link.icon;
          
          return (
            <Link key={link.href} to={link.href} className="relative px-3 py-2 rounded-full cursor-pointer">
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute inset-0 rounded-full bg-zinc-100/80 dark:bg-zinc-800/80 -z-10 shadow-inner border border-zinc-200/40 dark:border-zinc-700/40"
                  transition={{ type: "spring", stiffness: 160, damping: 11, mass: 0.8 }}
                >
                  {/* Internal fluid glare & highlight */}
                  <div className="absolute inset-x-0 top-0 h-[40%] rounded-t-full bg-white/15 dark:bg-white/5 pointer-events-none" />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />
                </motion.div>
              )}
              <motion.div 
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.93 }}
                className={cn("flex items-center gap-2", isActive ? "text-zinc-900 dark:text-zinc-50" : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors")}
              >
                <Icon size={18} />
                <span className="text-sm font-medium hidden md:block">{link.label}</span>
              </motion.div>
            </Link>
          );
        })}

        {/* Elegant vertical divider inside navbar */}
        <div className="h-6 w-[1.5px] bg-zinc-200/80 dark:bg-zinc-800/80 mx-1 md:mx-2" />

        {/* Integrated fluid-motion theme toggle */}
        <motion.button
          whileHover={{ 
            scale: 1.1,
            boxShadow: isDark 
              ? "0 8px 24px rgba(10,132,255,0.2)" 
              : "0 8px 24px rgba(245,158,11,0.15)"
          }}
          whileTap={{ scale: 0.92 }}
          onClick={toggleTheme}
          className="w-10 h-10 rounded-full flex items-center justify-center p-0.5 cursor-pointer relative bg-zinc-100/30 dark:bg-zinc-800/30 border border-zinc-200/50 dark:border-zinc-700/50 shadow-inner overflow-hidden"
          aria-label="Toggle Theme"
        >
          <div className="relative w-full h-full rounded-full flex items-center justify-center overflow-hidden bg-zinc-150/40 dark:bg-zinc-800/60 inset-shadow-sm">
            <motion.div
               initial={false}
               animate={{
                 rotate: isDark ? 200 : 0,
                 y: isDark ? -24 : 0,
                 opacity: isDark ? 0 : 1,
                 scale: isDark ? 0.6 : 1
               }}
               transition={{ type: "spring", stiffness: 160, damping: 11, mass: 0.8 }}
               className="absolute"
            >
              <Sun size={16} className="text-amber-500 filter drop-shadow-[0_0_4px_rgba(245,158,11,0.5)]" />
            </motion.div>
            
            <motion.div
              initial={false}
              animate={{
                 rotate: isDark ? 0 : -200,
                 y: isDark ? 0 : 24,
                 opacity: isDark ? 1 : 0,
                 scale: isDark ? 1 : 0.6
              }}
              transition={{ type: "spring", stiffness: 160, damping: 11, mass: 0.8 }}
              className="absolute"
            >
              <Moon size={16} className="text-[#0A84FF] filter drop-shadow-[0_0_4px_rgba(10,132,255,0.4)]" />
            </motion.div>
    
            {/* Physical dial glare effect overlay */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/25 to-transparent pointer-events-none" />
          </div>
        </motion.button>
      </nav>
    </motion.div>
  );
}

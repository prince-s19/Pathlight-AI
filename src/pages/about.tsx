import * as React from 'react';
import { motion } from 'motion/react';
import { Sparkles, MapPin, Database, Award, ArrowRight, Linkedin, Briefcase, Cpu, ShieldCheck, HelpCircle } from 'lucide-react';

export default function About() {
  return (
    <main className="w-full max-w-4xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-16 relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="relative inline-block"
        >
          {/* Subtle Ambient Glow behind profile/developer element */}
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/10 to-emerald-500/10 rounded-3xl blur-xl opacity-75 dark:opacity-50" />
          
          <div className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-sm font-semibold mb-6 border border-zinc-200/50 dark:border-zinc-700/50 text-zinc-800 dark:text-zinc-200 shadow-sm">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            Official Developer Portfolio
          </div>
        </motion.div>

        {/* Developed By Heading in Massive elegant Font */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl sm:text-7xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 mb-6 bg-clip-text text-transparent bg-gradient-to-b from-zinc-900 via-zinc-900 to-zinc-650 dark:from-white dark:via-zinc-105 dark:to-zinc-400 leading-tight"
        >
          Developed by Prince S
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-zinc-500 dark:text-zinc-400 leading-relaxed text-lg sm:text-2xl mx-auto max-w-3xl font-mono mb-10"
        >
          An engineering solution built to streamline career-defining pathfinding & placement search for developers.
        </motion.p>

        {/* Link Out to LinkedIn Profile */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex justify-center"
        >
          <a
            href="https://www.linkedin.com/in/prince-aiml/"
            target="_blank"
            referrerPolicy="no-referrer"
            rel="noopener noreferrer"
            className="group px-8 py-5 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold text-lg hover:from-blue-500 hover:to-blue-400 transition-all duration-300 shadow-[0_4px_20px_rgba(10,132,255,0.3)] hover:shadow-[0_6px_24px_rgba(10,132,255,0.4)] hover:scale-105 active:scale-95 flex items-center gap-3 cursor-pointer"
            id="linkedin-profile-button"
          >
            <Linkedin size={24} className="animate-pulse" />
            <span>Connect on LinkedIn</span>
            <ArrowRight size={20} className="translate-x-0 group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>
      </div>

      {/* Main Capability Cards Grid */}
      <section className="mt-16 border-t border-zinc-200/50 dark:border-zinc-800/50 pt-16">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-900 dark:text-zinc-100 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400">
            About Pathlight
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-base sm:text-lg leading-relaxed">
            Pathlight addresses the friction students and young engineers face when searching for high-impact roles. By unifying real-time job indices and active programmatic caches with specialized filters, the platform provides an elegant, distraction-free stage.
          </p>
        </div>

        {/* Detailed Explanation Block */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass-panel p-8 sm:p-10 rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 mb-12 relative overflow-hidden bg-white/40 dark:bg-zinc-950/20 backdrop-blur-md"
        >
          <div className="absolute -left-16 -top-16 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -right-16 -bottom-16 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 text-left">
            <h3 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-50 mb-4 flex items-center gap-2">
              <Cpu size={22} className="text-[#0A84FF]" /> Complete Specialized Dev focus
            </h3>
            
            <p className="text-zinc-600 dark:text-zinc-300 text-sm sm:text-base leading-relaxed mb-6">
              Unlike broad-market aggregators that dilute tech search tables with unrelated office vacancies, Pathlight is designed <strong>exclusively</strong> for developer internships and software engineering career pipelines. By omitting distractions like general scholarships or external student hackathons, we provide a clean workspace dedicated only to active employment and skill-aligned role matchmaking.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="flex gap-4">
                <div className="w-10 h-10 shrink-0 rounded-full bg-blue-100/80 dark:bg-zinc-800/80 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Briefcase size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-zinc-900 dark:text-zinc-50 text-sm mb-1">Developer Internships</h4>
                  <p className="text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm leading-relaxed">
                    Access tech-focused engineering positions, developer placements, and corporate trainee opportunities across multiple domains (SWE, PM, UI/UX, Data Science).
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 shrink-0 rounded-full bg-emerald-100/80 dark:bg-zinc-800/80 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Cpu size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-zinc-900 dark:text-zinc-50 text-sm mb-1">Entry Level & Career Jobs</h4>
                  <p className="text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm leading-relaxed">
                    Connect directly to verified full-time developer openings in prime industry hubs, complete with clear target paths and quick linkouts.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Under the Hood Card Grid */}
        <h3 className="text-2xl font-black text-zinc-900 dark:text-zinc-50 mb-6 text-center">
          Under the Hood Tech Stack
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-panel p-6 rounded-2xl flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-zinc-800/80 text-[#0A84FF] flex items-center justify-center mb-4">
                <Sparkles size={20} />
              </div>
              <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100 mb-2 font-sans">Adzuna & Gemini Feed</h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm leading-relaxed font-sans">
                Curates real-time internships using high-speed query indexing from <strong>Adzuna</strong>. For sparse pipelines, the engine triggers automated fallback caching via <strong>Gemini 2.5 Flash</strong> curation.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="glass-panel p-6 rounded-2xl flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-zinc-800/80 text-[#0A84FF] flex items-center justify-center mb-4">
                <MapPin size={20} />
              </div>
              <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100 mb-2 font-sans">Dual Region Targeting</h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm leading-relaxed font-sans">
                Includes fully localized pipelines for <strong>India 🇮🇳</strong> and the <strong>United States/Global 🇺🇸</strong> pipelines, adapting queries dynamically per target.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="glass-panel p-6 rounded-2xl flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-15 rounded-full bg-blue-100 dark:bg-zinc-800/80 text-[#0A84FF] flex items-center justify-center mb-4">
                <Database size={20} />
              </div>
              <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100 mb-2 font-sans">Supabase Synced Engine</h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm leading-relaxed font-sans">
                Leverages secure, instant row-level persistence through Supabase query services to save, view, and organize bookmarked internships on the fly.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Feature List */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="glass-panel p-8 rounded-2xl max-w-3xl mx-auto border border-zinc-200/50 dark:border-zinc-800/50"
        >
          <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
            <Award size={20} className="text-[#0A84FF]" /> Core System Capabilities
          </h3>
          <ul className="space-y-4 text-left text-sm text-zinc-650 dark:text-zinc-400">
            <li className="flex gap-2.5">
              <span className="text-[#0A84FF] font-bold">✓</span>
              <span><strong>Refined Career Focus:</strong> Excluded all general scholarship grids, grant opportunities, and temporary external hackathons. The system is strictly structured for job and internship seekers in the technology sector.</span>
            </li>
            <li className="flex gap-2.5">
              <span className="text-[#0A84FF] font-bold">✓</span>
              <span><strong>Prestige Index Curation:</strong> Built-in routines automatically validate and pre-populate famous student tracks, including elite multi-national SWE explorer internships and specialized trainee pathways.</span>
            </li>
            <li className="flex gap-2.5">
              <span className="text-[#0A84FF] font-bold">✓</span>
              <span><strong>Inter-Device Fluidity:</strong> Hand-crafted responsive designs, layout frameworks, and fluid pill selection triggers that dynamically resize cleanly between smartphone screens and wide workspaces.</span>
            </li>
            <li className="flex gap-2.5">
              <span className="text-[#0A84FF] font-bold">✓</span>
              <span><strong>Secure JIT Personalization:</strong> Translates authorized contexts seamlessly on signup to instantly construct personal user statistics, study parameters, and curated tech categories.</span>
            </li>
          </ul>
        </motion.div>
      </section>
    </main>
  );
}

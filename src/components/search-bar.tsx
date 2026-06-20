import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Search as GlassSearchBar } from "lucide-react"; // Wait I'll just use simple search bar

interface SearchProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

export function IntelligentSearchBar({ onSearch, isLoading }: SearchProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-2xl mx-auto mb-12">
      <motion.div
        animate={isFocused ? { scale: 1.02 } : { scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className={cn(
          "glass-panel rounded-full flex items-center p-2 relative overflow-hidden transition-all duration-300",
          isFocused ? "shadow-[0_0_0_4px_rgba(10,132,255,0.2)] dark:shadow-[0_0_0_4px_rgba(10,132,255,0.4)]" : ""
        )}
      >
        <div className="pl-4 text-zinc-400 dark:text-zinc-500">
          <Search size={20} />
        </div>
        
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="I'm looking for a software engineering internship..."
          className="flex-1 bg-transparent border-none outline-none px-4 py-2 text-zinc-800 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 w-full"
        />

        <button 
          type="submit"
          disabled={isLoading || !query.trim()}
          className="bg-[#0A84FF] text-white rounded-full p-2.5 shadow-[0_2px_8px_rgba(10,132,255,0.3)] hover:scale-105 active:scale-95 transition-transform disabled:opacity-50 disabled:pointer-events-none"
        >
          {isLoading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            >
              <Sparkles size={18} />
            </motion.div>
          ) : (
            <Sparkles size={18} />
          )}
        </button>
      </motion.div>
    </form>
  );
}

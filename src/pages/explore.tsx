import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/useAuth';
import { supabase } from '@/lib/supabase';
import { Opportunity } from '@/types';
import { IntelligentSearchBar } from '@/components/search-bar';
import { OpportunityCard } from '@/components/opportunity-card';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { 
  Sparkles, 
  Code, 
  Database, 
  Briefcase, 
  Palette, 
  MapPin
} from 'lucide-react';

const categories = [
  { id: 'all', label: 'All', icon: Sparkles, q: 'internship', category: '' },
  { id: 'swe', label: 'Software Eng', icon: Code, q: 'software engineering', category: 'Software Engineering' },
  { id: 'ds', label: 'Data Science', icon: Database, q: 'data science', category: 'Data Science' },
  { id: 'pm', label: 'Product Mgmt', icon: Briefcase, q: 'product management', category: 'Product Management' },
  { id: 'design', label: 'Design & UI/UX', icon: Palette, q: 'design ui ux', category: 'Design' },
];

export default function Explore() {
  const { user } = useAuth();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCountry, setSelectedCountry] = useState('in'); // Default to India "in"
  const [searchQuery, setSearchQuery] = useState('');

  const fetchOpportunities = async (query: string = '', catId: string = 'all', countryCode: string = 'in') => {
    setIsLoading(true);
    try {
      const catObj = categories.find(c => c.id === catId) || categories[0];
      const activeQ = query || catObj.q;
      const activeCat = catObj.category;

      const url = `/api/opportunities?q=${encodeURIComponent(activeQ)}&category=${encodeURIComponent(activeCat)}&country=${countryCode}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setOpportunities(data);
      } else {
        setOpportunities([]);
      }

      if (user) {
        try {
          const { data: bData } = await supabase
            .from('bookmarks')
            .select('opportunity_id')
            .eq('user_id', user.id);
          if (bData) {
            setBookmarkedIds(new Set(bData.map(b => b.opportunity_id)));
          }
        } catch (dbErr) {
          console.log("Bookmarks DB issue (table might not exist yet):", dbErr);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities(searchQuery, selectedCategory, selectedCountry);
  }, [user, selectedCategory, selectedCountry]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setIsSearching(true);
    await fetchOpportunities(query, selectedCategory, selectedCountry);
    setIsSearching(false);
  };

  return (
    <main>
      <div className="text-center mb-10">
        <motion.h1 
          className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 to-zinc-500 dark:from-white dark:to-zinc-500"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Never Miss an Opportunity Again.
        </motion.h1>
        <motion.p 
          className="text-zinc-500 dark:text-zinc-400 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          Discover internships and jobs tailored to your journey.
        </motion.p>
        
        <IntelligentSearchBar onSearch={handleSearch} isLoading={isSearching} />

        {/* Dynamic Country Selector Pill */}
        <div className="flex justify-center items-center gap-2 mb-6 -mt-6">
          <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 flex items-center gap-1 font-mono">
            <MapPin size={12} /> Target Location:
          </span>
          <div className="relative inline-flex rounded-full bg-zinc-200/40 dark:bg-zinc-800/40 p-1 backdrop-blur-md border border-zinc-200/30 dark:border-zinc-700/30 shadow-inner">
            <button
               onClick={() => setSelectedCountry('in')}
               className={`relative px-4 py-1.5 text-xs font-bold rounded-full cursor-pointer transition-colors duration-250 z-10 ${
                 selectedCountry === 'in' 
                   ? 'text-zinc-950 dark:text-white' 
                   : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'
               }`}
            >
              {selectedCountry === 'in' && (
                <motion.div
                  layoutId="country-indicator"
                  className="absolute inset-0 bg-white dark:bg-zinc-700 rounded-full shadow-sm -z-10 border border-zinc-200/50 dark:border-zinc-650"
                  transition={{ type: "spring", stiffness: 160, damping: 11, mass: 0.8 }}
                >
                  <div className="absolute inset-x-0 top-0 h-[45%] rounded-t-full bg-white/20 pointer-events-none" />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/15 to-transparent pointer-events-none" />
                </motion.div>
              )}
              India 🇮🇳
            </button>
            <button
               onClick={() => setSelectedCountry('us')}
               className={`relative px-4 py-1.5 text-xs font-bold rounded-full cursor-pointer transition-colors duration-250 z-10 ${
                 selectedCountry === 'us' 
                   ? 'text-zinc-950 dark:text-white' 
                   : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'
               }`}
            >
              {selectedCountry === 'us' && (
                <motion.div
                  layoutId="country-indicator"
                  className="absolute inset-0 bg-white dark:bg-zinc-700 rounded-full shadow-sm -z-10 border border-zinc-200/50 dark:border-zinc-650"
                  transition={{ type: "spring", stiffness: 160, damping: 11, mass: 0.8 }}
                >
                  <div className="absolute inset-x-0 top-0 h-[45%] rounded-t-full bg-white/25 pointer-events-none" />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/15 to-transparent pointer-events-none" />
                </motion.div>
              )}
              USA/Global 🇺🇸
            </button>
          </div>
        </div>

        {/* High-Fidelity Domain Filter Categories Scroll */}
        <div className="w-full max-w-4xl mx-auto px-4 overflow-x-auto no-scrollbar pb-2">
          <div className="flex gap-2 min-w-max py-2 justify-center">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <motion.button
                  key={cat.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setSearchQuery(''); // Clear general search query on tab change to load fresh
                  }}
                  className="relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer overflow-hidden border border-zinc-200/40 dark:border-zinc-800/40 animate-none"
                >
                  {isSelected ? (
                    <motion.div
                      layoutId="category-indicator"
                      className="absolute inset-0 bg-zinc-900 dark:bg-zinc-100 -z-10 rounded-full shadow-inner"
                      transition={{ type: "spring", stiffness: 160, damping: 11, mass: 0.8 }}
                    >
                      <div className="absolute inset-x-0 top-0 h-[45%] rounded-t-full bg-white/20 dark:bg-black/5 pointer-events-none" />
                      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/15 to-transparent pointer-events-none" />
                    </motion.div>
                  ) : (
                    <div className="absolute inset-0 bg-white/40 dark:bg-zinc-950/30 backdrop-blur-[12px] -z-10 rounded-full" />
                  )}
                  
                  <span className={isSelected ? "text-white dark:text-zinc-950 flex items-center gap-2" : "text-zinc-650 dark:text-zinc-400 flex items-center gap-2 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"}>
                    <Icon size={16} />
                    <span>{cat.label}</span>
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
             <div key={i} className="glass-panel h-64 rounded-[24px] rounded-xl animate-pulse bg-zinc-200/50 dark:bg-zinc-800/50"></div>
          ))}
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            layout
          >
            {opportunities.map((opp, idx) => (
              <OpportunityCard 
                key={opp.id} 
                opportunity={opp} 
                userId={user?.id}
                initialBookmarked={bookmarkedIds.has(opp.id)}
                index={idx}
              />
            ))}
          </motion.div>
          {opportunities.length === 0 && !isLoading && (
            <div className="text-center py-24 text-zinc-500 dark:text-zinc-500">
              No opportunities available right now.
            </div>
          )}
        </AnimatePresence>
      )}

    </main>
  );
}

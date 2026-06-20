import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/useAuth';
import { supabase } from '@/lib/supabase';
import { Opportunity } from '@/types';
import { OpportunityCard } from '@/components/opportunity-card';
import { motion, AnimatePresence } from 'motion/react';
import { Navigate } from 'react-router-dom';

export default function Bookmarks() {
  const { user, loading } = useAuth();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBookmarks = async () => {
    setIsLoading(true);
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .select(`
          opportunity_id,
          opportunities (*)
        `)
        .eq('user_id', user.id);
        
      if (error) {
        if (error.code !== '42P01') throw error;
      } else if (data) {
        const opps = data.map((b: any) => b.opportunities).filter(Boolean);
        setOpportunities(opps);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!loading && user) {
      fetchBookmarks();
    } else if (!loading && !user) {
      setIsLoading(false);
    }
  }, [user, loading]);

  if (!loading && !user) {
    return <Navigate to="/auth" />;
  }

  return (
    <main>
      <div className="mb-10">
        <motion.h1 
          className="text-3xl font-bold tracking-tight mb-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          Saved Opportunities
        </motion.h1>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
             <div key={i} className="glass-panel h-64 rounded-[24px] animate-pulse bg-zinc-200/50 dark:bg-zinc-800/50"></div>
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
                initialBookmarked={true}
                onBookmarkToggle={() => setOpportunities(prev => prev.filter(o => o.id !== opp.id))}
                index={idx}
              />
            ))}
          </motion.div>
          {opportunities.length === 0 && (
            <div className="text-center py-24 text-zinc-500">
              You haven't saved any opportunities yet.
            </div>
          )}
        </AnimatePresence>
      )}
    </main>
  );
}

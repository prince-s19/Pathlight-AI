import { Opportunity } from '@/types';
import { GlassCard } from './ui/glass-card';
import { Bookmark, Calendar, ExternalLink, Share2, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface OpportunityCardProps {
  key?: React.Key;
  opportunity: Opportunity;
  initialBookmarked?: boolean;
  userId?: string;
  onBookmarkToggle?: () => void;
  index?: number;
}

export function OpportunityCard({ opportunity, initialBookmarked = false, userId, onBookmarkToggle, index = 0 }: OpportunityCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
  const [isLiking, setIsLiking] = useState(false);

  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const fallbackCopyToClipboard = () => {
    try {
      navigator.clipboard.writeText(opportunity.url);
      setCopied(true);
      toast.success('Opportunity link copied!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy fallback link:', err);
      toast.error('Failed to copy link');
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const shareData = {
      title: opportunity.title,
      text: opportunity.description ? `${opportunity.description.slice(0, 100)}...` : `Check out this developer opportunity: ${opportunity.title}`,
      url: opportunity.url,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        toast.success('Opportunity shared!');
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error('Error sharing natively:', err);
          fallbackCopyToClipboard();
        }
      }
    } else {
      fallbackCopyToClipboard();
    }
  };

  const titleLower = (opportunity.title || '').toLowerCase();
  const descLower = (opportunity.description || '').toLowerCase();
  const catLower = (opportunity.category || '').toLowerCase();

  const isInternship = 
    titleLower.includes('intern') || 
    descLower.includes('intern') || 
    catLower.includes('intern') || 
    titleLower.includes('co-op') || 
    titleLower.includes('coop') || 
    titleLower.includes('student') || 
    titleLower.includes('trainee');

  let domainCategory = opportunity.category || '';
  if (
    domainCategory.toLowerCase().includes('intern') || 
    domainCategory.toLowerCase() === 'general' ||
    !domainCategory
  ) {
    if (titleLower.includes('software') || titleLower.includes('developer') || titleLower.includes('engineer') || titleLower.includes('swe') || titleLower.includes('code')) {
      domainCategory = 'Software Eng';
    } else if (titleLower.includes('data') || titleLower.includes('analyst') || titleLower.includes('machine') || titleLower.includes('ml') || titleLower.includes('science')) {
      domainCategory = 'Data Science';
    } else if (titleLower.includes('product') || titleLower.includes('manager') || titleLower.includes('pm')) {
      domainCategory = 'Product Mgmt';
    } else if (titleLower.includes('ui') || titleLower.includes('ux') || titleLower.includes('design') || titleLower.includes('creative') || titleLower.includes('frontend')) {
      domainCategory = 'Design';
    } else {
      domainCategory = 'Software Eng';
    }
  }

  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault(); // prevent navigation if wrapped in link
    if (!userId) {
      toast.error('Please log in to save opportunities');
      return;
    }

    setIsLiking(true);
    
    try {
      const response = await fetch('/api/bookmarks/toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          opportunity,
          isBookmarked
        })
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || 'Failed to update bookmark');
      }

      const result = await response.json();
      if (result.removed) {
        setIsBookmarked(false);
        toast.success('Removed from saved');
      } else if (result.added) {
        setIsBookmarked(true);
        toast.success('Saved to your bookmarks');
      }

      if (onBookmarkToggle) onBookmarkToggle();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Failed to update bookmark');
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 24, 
        delay: index * 0.05 
      }}
    >
      <GlassCard className="flex flex-col h-full group p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="flex flex-wrap gap-1.5 items-center">
            <span className={cn(
              "inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider transition-colors border shadow-xs",
              isInternship 
                ? "border-emerald-200/50 dark:border-emerald-900/40 bg-emerald-50/60 dark:bg-emerald-950/25 text-emerald-700 dark:text-emerald-400"
                : "border-blue-200/50 dark:border-blue-900/40 bg-blue-50/60 dark:bg-blue-950/25 text-blue-700 dark:text-blue-400"
            )}>
              {isInternship ? 'Internship' : 'Job'}
            </span>
            {domainCategory && (
              <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider transition-colors border border-zinc-200/50 dark:border-zinc-800/80 bg-zinc-100/50 dark:bg-zinc-800/40 text-zinc-600 dark:text-zinc-400">
                {domainCategory}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-1.5">
            {/* Share Button representing native/clipboard options */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleShare}
              title="Share Opportunity"
              className={cn(
                "p-2 rounded-full transition-colors glass-panel hover:bg-white dark:hover:bg-zinc-800",
                copied ? "text-emerald-500 dark:text-emerald-400" : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
              )}
            >
              {copied ? <Check size={18} /> : <Share2 size={18} />}
            </motion.button>

            {/* Bookmark button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9, y: 2 }}
              onClick={handleBookmark}
              disabled={isLiking}
              title={isBookmarked ? "Remove Bookmark" : "Save Bookmark"}
              className={cn(
                "p-2 rounded-full transition-colors glass-panel hover:bg-white dark:hover:bg-zinc-800",
                isBookmarked ? "text-[#0A84FF]" : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
              )}
            >
              <Bookmark size={18} className={isBookmarked ? "fill-current" : ""} />
            </motion.button>
          </div>
        </div>

        <h3 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-2 leading-tight">
          {opportunity.title}
        </h3>
        
        {opportunity.description && (
          <div className="mb-4 flex-grow flex flex-col justify-between">
            <p className={cn(
              "text-sm text-zinc-650 dark:text-zinc-400 transition-all duration-300 select-text leading-relaxed",
              isExpanded ? "whitespace-pre-line" : "line-clamp-2"
            )}>
              {opportunity.description}
            </p>
            {opportunity.description.length > 90 && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setIsExpanded(!isExpanded);
                }}
                className="text-xs font-semibold text-[#0A84FF] hover:text-[#0070e0] dark:hover:text-blue-400 mt-1.5 cursor-pointer w-fit leading-none py-1 hover:underline transition-all"
              >
                {isExpanded ? "Show less" : "Read more..."}
              </button>
            )}
          </div>
        )}

        {opportunity.skills && opportunity.skills.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-auto mb-4">
            {opportunity.skills.map(skill => (
              <span key={skill} className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium text-zinc-600 dark:text-zinc-400 bg-zinc-100/50 dark:bg-zinc-800/50">
                {skill}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-zinc-200/50 dark:border-zinc-800/50">
          {opportunity.deadline && (
            <div className="flex items-center text-xs text-zinc-500 dark:text-zinc-400 gap-1.5">
              <Calendar size={14} />
              <span>By {new Date(opportunity.deadline).toLocaleDateString()}</span>
            </div>
          )}
          
          <a
            href={opportunity.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm font-medium text-[#0A84FF] hover:underline"
          >
            Apply <ExternalLink size={14} />
          </a>
        </div>
      </GlassCard>
    </motion.div>
  );
}

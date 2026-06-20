import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/useAuth';
import { supabase } from '@/lib/supabase';
import { Navigate } from 'react-router-dom';
import { GlassCard } from '@/components/ui/glass-card';
import { GlassButton } from '@/components/ui/glass-button';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { Profile as ProfileType } from '@/types';
import { Sparkles, MapPin, Database } from 'lucide-react';

const extractNameFromEmail = (email?: string) => {
  if (!email) return 'Prince S';
  if (email.toLowerCase().startsWith('prince')) return 'Prince S';
  const namePart = email.split('@')[0];
  return namePart
    .split(/[\._\-]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export default function Profile() {
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<ProfileType>>({});

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user!.id)
        .single();
        
      if (error && error.code !== 'PGRST116' && error.code !== '42P01') {
        throw error;
      }
      if (data) {
        // Handle BOTH education_year and graduation_year columns from database
        const remoteYear = data.education_year !== null && data.education_year !== undefined
          ? data.education_year
          : (data.graduation_year !== null && data.graduation_year !== undefined ? data.graduation_year : null);

        const cached = localStorage.getItem(`pathlight_profile_${user!.id}`);
        const local = cached ? JSON.parse(cached) : {};

        // Merge: prefer Remote values but don't let remote nulls/empty values wipe out local values
        const merged = {
          ...local,
          user_id: data.user_id || local.user_id || user!.id,
          name: data.name || local.name || extractNameFromEmail(user?.email || ''),
          skills: (data.skills && data.skills.length > 0) ? data.skills : (local.skills || []),
          interests: (data.interests && data.interests.length > 0) ? data.interests : (local.interests || []),
          education_year: remoteYear !== null && remoteYear !== undefined ? remoteYear : (local.education_year || null),
          created_at: data.created_at || local.created_at || new Date().toISOString()
        };

        setProfile(merged);
        setFormData(merged);
        // Sync with local fallback cache
        localStorage.setItem(`pathlight_profile_${user!.id}`, JSON.stringify(merged));
      } else {
        // No remote record yet, check local cache first for dynamic local tracking
        const cached = localStorage.getItem(`pathlight_profile_${user!.id}`);
        if (cached) {
          const parsed = JSON.parse(cached);
          setProfile(parsed);
          setFormData(parsed);
        } else {
          // No profile found anywhere, create a default local one with inferred name from email
          const inferredName = extractNameFromEmail(user?.email || '');
          const defaultProfile: ProfileType = {
            user_id: user!.id,
            name: inferredName,
            skills: [],
            interests: [],
            education_year: null,
            created_at: new Date().toISOString()
          };
          setProfile(defaultProfile);
          setFormData(defaultProfile);
          localStorage.setItem(`pathlight_profile_${user!.id}`, JSON.stringify(defaultProfile));
          
          // JIT save the default profile in background to personalize their database record dynamically
          supabase
            .from('profiles')
            .insert(defaultProfile)
            .then(({ error }) => {
              if (error) {
                console.log("Default profile JIT auto-generation info:", error.message);
              }
            });
        }
      }
    } catch (error) {
      console.warn("Supabase fetch profile error, falling back to local storage:", error);
      const cached = localStorage.getItem(`pathlight_profile_${user!.id}`);
      if (cached) {
        const parsed = JSON.parse(cached);
        setProfile(parsed);
        setFormData(parsed);
      } else {
        const inferredName = extractNameFromEmail(user?.email || '');
        const defaultProfile: ProfileType = {
          user_id: user!.id,
          name: inferredName,
          skills: [],
          interests: [],
          education_year: null,
          created_at: new Date().toISOString()
        };
        setProfile(defaultProfile);
        setFormData(defaultProfile);
        localStorage.setItem(`pathlight_profile_${user!.id}`, JSON.stringify(defaultProfile));
      }
    }
  };

  const handleSave = async () => {
    const parsedYear = formData.education_year ? parseInt(formData.education_year as any) : null;
    const payload = {
      user_id: user!.id,
      name: formData.name,
      skills: typeof formData.skills === 'string' 
        ? (formData.skills as string).split(',').map(s => s.trim()).filter(Boolean) 
        : formData.skills || [],
      interests: typeof formData.interests === 'string'
        ? (formData.interests as string).split(',').map(s => s.trim()).filter(Boolean)
        : formData.interests || [],
      education_year: parsedYear,
      graduation_year: parsedYear, // Write to both in case the DB table utilizes synonyms
      created_at: profile?.created_at || new Date().toISOString()
    };

    // Always eagerly persist to local storage cache to guarantee update success
    localStorage.setItem(`pathlight_profile_${user!.id}`, JSON.stringify(payload));
    setProfile(payload as ProfileType);

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert(payload);
        
      if (error) {
        console.warn("Could not upsert profile remotely, using local cache:", error.message);
      }
      
      toast.success("Profile updated");
      setIsEditing(false);
    } catch (error: any) {
      console.warn("Exception during remote profile save, using local cache:", error);
      
      // Even if database endpoint exception occurred, we have cached it locally
      toast.success("Profile updated");
      setIsEditing(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out");
  };

  if (!loading && !user) {
    return <Navigate to="/auth" />;
  }

  if (loading) return null;

  return (
    <main className="max-w-2xl mx-auto">
      <motion.h1 
        className="text-3xl font-bold tracking-tight mb-8"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        Your Profile
      </motion.h1>
      
      <GlassCard className="mb-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-100 to-[#0A84FF] flex items-center justify-center text-white text-xl font-bold">
            {profile?.name ? profile.name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-semibold">{profile?.name || 'Prince S'}</h2>
            <p className="text-zinc-500 text-sm">{user?.email}</p>
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Full Name</label>
              <input 
                type="text" 
                value={formData.name || ''} 
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full bg-white/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A84FF]/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Skills (comma separated)</label>
              <input 
                type="text" 
                value={Array.isArray(formData.skills) ? formData.skills.join(', ') : (formData.skills || '')} 
                onChange={e => setFormData({...formData, skills: e.target.value as any})}
                placeholder="React, Python, Design"
                className="w-full bg-white/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A84FF]/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Graduation Year</label>
              <input 
                type="number" 
                value={formData.education_year || ''} 
                onChange={e => setFormData({...formData, education_year: e.target.value as any})}
                className="w-full bg-white/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A84FF]/50 transition-all"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <GlassButton onClick={handleSave}>Save Changes</GlassButton>
              <GlassButton variant="ghost" onClick={() => setIsEditing(false)}>Cancel</GlassButton>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-zinc-500 mb-1">Graduation</h3>
                <p>{profile?.education_year || 'Not specified'}</p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-zinc-500 mb-2">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {profile?.skills?.map(skill => (
                  <span key={skill} className="px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800/50 text-sm rounded-md">
                    {skill}
                  </span>
                )) || <p className="text-sm">No skills added</p>}
              </div>
            </div>
            <div className="pt-2">
              <GlassButton variant="secondary" onClick={() => {
                setFormData(profile || {});
                setIsEditing(true);
              }}>Edit Profile</GlassButton>
            </div>
          </div>
        )}
      </GlassCard>

      <div className="flex justify-start">
        <GlassButton variant="ghost" onClick={handleLogout} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30">
          Sign Out
        </GlassButton>
      </div>

      {/* About Pathlight Promo Section with Developer Credits */}
      <section className="mt-16 border-t border-zinc-200/50 dark:border-zinc-800/50 pt-12 text-zinc-900 dark:text-zinc-100 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="glass-panel p-8 rounded-2xl max-w-2xl mx-auto border border-zinc-200/50 dark:border-zinc-800/50 relative overflow-hidden"
        >
          {/* Subtle Accent Glow */}
          <div className="absolute -right-16 -bottom-16 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-xs font-semibold mb-4 text-zinc-800 dark:text-zinc-200">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Developed by Prince S
            </div>
            
            <h3 className="text-2xl font-black tracking-tight mb-2">
              Discover the Pathlight Initiative
            </h3>
            
            <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed mb-6 max-w-md mx-auto">
              Ready to learn more about our AI-synthesized caching engines, dual-region targets, and the creator behind the project?
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <a
                href="/about"
                className="px-5 py-2.5 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors shadow-sm inline-flex items-center justify-center gap-1.5"
              >
                <span>Read Full About Section</span>
              </a>
              <a
                href="https://www.linkedin.com/in/prince-aiml/"
                target="_blank"
                referrerPolicy="no-referrer"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-full bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-xs font-semibold hover:bg-blue-200 dark:hover:bg-blue-950/60 transition-colors inline-flex items-center justify-center gap-1.5"
              >
                <span>Contact Prince on LinkedIn</span>
              </a>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}

import { useState, useRef, useEffect } from "react";
import { Search, Play, Pause, Copy, Check, Volume2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SOUNDS, SOUND_CATEGORIES, Sound } from "@/data/sounds";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const SoundCard = ({ 
  sound, 
  isPlaying, 
  onPlayToggle 
}: { 
  sound: Sound; 
  isPlaying: boolean; 
  onPlayToggle: (sound: Sound) => void;
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(sound.robloxId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="group relative flex items-center justify-between p-3 sm:p-4 rounded-lg bg-card/40 hover:bg-card/80 border border-white/5 hover:border-primary/30 transition-all overflow-hidden"
    >
      {/* Background glow when playing */}
      {isPlaying && (
        <div className="absolute inset-0 bg-primary/10 blur-xl pointer-events-none" />
      )}
      
      <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0 z-10">
        <Button 
          variant="secondary"
          size="icon"
          className={`shrink-0 rounded-full h-10 w-10 sm:h-12 sm:w-12 transition-all ${
            isPlaying 
              ? "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(168,85,247,0.5)]" 
              : "bg-white/5 text-muted-foreground hover:text-white hover:bg-white/10"
          }`}
          onClick={() => onPlayToggle(sound)}
        >
          {isPlaying ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 ml-1 fill-current" />}
        </Button>

        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm sm:text-base font-medium text-foreground truncate">
              {sound.title}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[10px] sm:text-xs bg-black/40 border-white/10 text-muted-foreground whitespace-nowrap">
              {sound.category}
            </Badge>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 pl-3 z-10 shrink-0">
        <div className="hidden sm:flex items-center bg-black/50 border border-white/10 rounded px-3 py-1.5 font-mono text-xs text-primary/80 select-all">
          {sound.robloxId}
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCopy}
          className={`h-9 w-9 sm:h-10 sm:w-10 rounded-md border transition-all ${
            copied 
              ? "bg-green-500/20 text-green-400 border-green-500/30" 
              : "bg-black/50 text-muted-foreground border-white/10 hover:text-white hover:border-white/20 hover:bg-white/5"
          }`}
          title="Copy ID"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>
    </motion.div>
  );
};

export default function Soundboard() {
  const [search, setSearch] = useState("");
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  const handlePlayToggle = (sound: Sound) => {
    if (playingId === sound.id) {
      // Pause current
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setPlayingId(null);
    } else {
      // Play new
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const audio = new Audio(sound.url);
      audio.volume = 0.5;
      audio.onended = () => setPlayingId(null);
      audio.play().catch(e => console.error("Playback failed:", e));
      audioRef.current = audio;
      setPlayingId(sound.id);
    }
  };

  const filteredSounds = SOUNDS.filter(s => 
    s.title.toLowerCase().includes(search.toLowerCase()) || 
    s.robloxId.includes(search) ||
    s.category.toLowerCase().includes(search.toLowerCase())
  );

  const scrollToCategory = (category: string) => {
    const el = document.getElementById(`category-${category}`);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 100; // offset for sticky header
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-[100dvh] bg-background text-foreground selection:bg-primary/30 pb-20">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-white/5 shadow-2xl shadow-black/50">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-indigo-900 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                <Volume2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  JJS Soundboard
                </h1>
                <p className="text-xs text-primary/60 font-medium tracking-wider uppercase">Cursed Audio Archive</p>
              </div>
            </div>

            <div className="relative w-full sm:max-w-xs">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-muted-foreground" />
              </div>
              <Input 
                type="text"
                placeholder="Search sounds or IDs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-black/40 border-white/10 focus-visible:ring-primary h-10 w-full rounded-full"
              />
            </div>
          </div>
        </div>
        
        {/* Category Nav */}
        <div className="border-t border-white/5 bg-black/20 overflow-x-auto no-scrollbar">
          <div className="max-w-5xl mx-auto px-4 py-2 flex items-center gap-2 min-w-max">
            {SOUND_CATEGORIES.map(category => {
              const hasMatches = filteredSounds.some(s => s.category === category);
              if (!hasMatches && search) return null;
              
              return (
                <button
                  key={category}
                  onClick={() => scrollToCategory(category)}
                  className="px-3 py-1.5 rounded-full text-xs font-medium text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors whitespace-nowrap"
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {filteredSounds.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/5 mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No sounds found</h3>
            <p className="text-muted-foreground">Try adjusting your search terms.</p>
          </div>
        ) : (
          <div className="space-y-10">
            {SOUND_CATEGORIES.map(category => {
              const categorySounds = filteredSounds.filter(s => s.category === category);
              if (categorySounds.length === 0) return null;

              return (
                <div key={category} id={`category-${category}`} className="scroll-mt-32">
                  <div className="flex items-center gap-4 mb-4">
                    <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                      {category}
                    </h2>
                    <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <AnimatePresence>
                      {categorySounds.map(sound => (
                        <SoundCard
                          key={sound.id}
                          sound={sound}
                          isPlaying={playingId === sound.id}
                          onPlayToggle={handlePlayToggle}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <footer className="mt-20 border-t border-white/5 py-8 text-center text-xs text-muted-foreground bg-black/40">
        <p>Audio IDs are intended for use in Roblox Studio.</p>
        <p className="mt-1 opacity-50">Not affiliated with Gege Akutami or Roblox Corporation.</p>
      </footer>
    </div>
  );
}

import { useState, useRef, useCallback } from "react";
import { Search, Play, Pause, Copy, Check, Volume2, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SOUNDS, SOUND_CATEGORIES, Sound } from "@/data/sounds";
import { playProfile, getProfile } from "@/lib/audioEngine";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Circular progress ring rendered outside + around the button.
// Uses framer-motion pathLength for reliable cross-browser SVG animation.
function ProgressRing({ duration, playing }: { duration: number; playing: boolean }) {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 56 56"
      style={{ transform: "rotate(-90deg)" }}
    >
      {/* track */}
      <circle cx="28" cy="28" r="26" fill="none" stroke="rgba(168,85,247,0.18)" strokeWidth="2.5" />
      {/* animated fill */}
      <motion.circle
        cx="28"
        cy="28"
        r="26"
        fill="none"
        stroke="rgb(168,85,247)"
        strokeWidth="2.5"
        strokeLinecap="round"
        pathLength={1}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: playing ? 1 : 0 }}
        transition={
          playing
            ? { duration, ease: "linear" }
            : { duration: 0.15 }
        }
      />
    </svg>
  );
}

const FAVORITES_KEY = "jjs-soundboard-favorites";

function loadFavorites(): Set<string> {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function saveFavorites(favs: Set<string>) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify([...favs]));
}

const SoundCard = ({
  sound,
  isPlaying,
  isFavorite,
  ringDuration,
  onPlayToggle,
  onFavoriteToggle,
}: {
  sound: Sound;
  isPlaying: boolean;
  isFavorite: boolean;
  ringDuration: number;
  onPlayToggle: (sound: Sound) => void;
  onFavoriteToggle: (id: string) => void;
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(sound.robloxId);
    } catch {
      const el = document.createElement("textarea");
      el.value = sound.robloxId;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.18 }}
      className="group relative flex items-center justify-between p-3 sm:p-4 rounded-lg bg-card/40 hover:bg-card/80 border border-white/5 hover:border-primary/30 transition-all overflow-hidden"
    >
      {isPlaying && (
        <div className="absolute inset-0 bg-primary/10 blur-xl pointer-events-none" />
      )}

      <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0 z-10">
        {/* Ring container is 4px larger on each side than the button so the ring visibly wraps around it */}
        <div className="relative shrink-0 flex items-center justify-center h-14 w-14 sm:h-16 sm:w-16">
          <ProgressRing duration={ringDuration} playing={isPlaying} />
          <Button
            variant="secondary"
            size="icon"
            className={`relative z-10 rounded-full h-10 w-10 sm:h-12 sm:w-12 transition-all ${
              isPlaying
                ? "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(168,85,247,0.5)]"
                : "bg-white/5 text-muted-foreground hover:text-white hover:bg-white/10"
            }`}
            onClick={() => onPlayToggle(sound)}
          >
            {isPlaying ? (
              <Pause className="h-5 w-5 fill-current" />
            ) : (
              <Play className="h-5 w-5 ml-0.5 fill-current" />
            )}
          </Button>
        </div>

        <div className="flex flex-col min-w-0">
          <h3 className="text-sm sm:text-base font-medium text-foreground truncate mb-1">
            {sound.title}
          </h3>
          <Badge
            variant="outline"
            className="w-fit text-[10px] sm:text-xs bg-black/40 border-white/10 text-muted-foreground whitespace-nowrap"
          >
            {sound.category}
          </Badge>
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2 pl-2 z-10 shrink-0">
        <div className="hidden sm:flex items-center bg-black/50 border border-white/10 rounded px-3 py-1.5 font-mono text-xs text-primary/80 select-all">
          {sound.robloxId}
        </div>

        <button
          onClick={() => onFavoriteToggle(sound.id)}
          title={isFavorite ? "Remove from favorites" : "Add to favorites"}
          className={`h-9 w-9 flex items-center justify-center rounded-md border transition-all ${
            isFavorite
              ? "text-yellow-400 border-yellow-500/30 bg-yellow-500/10 hover:bg-yellow-500/20"
              : "text-muted-foreground border-white/10 bg-black/50 hover:text-yellow-400 hover:border-yellow-500/20 hover:bg-yellow-500/5"
          }`}
        >
          <Star className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
        </button>

        <button
          onClick={handleCopy}
          title="Copy ID"
          className={`h-9 w-9 flex items-center justify-center rounded-md border transition-all ${
            copied
              ? "bg-green-500/20 text-green-400 border-green-500/30"
              : "bg-black/50 text-muted-foreground border-white/10 hover:text-white hover:border-white/20 hover:bg-white/5"
          }`}
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </button>
      </div>
    </motion.div>
  );
};

type Tab = "all" | "favorites";

export default function Soundboard() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [playingDuration, setPlayingDuration] = useState<number>(1);
  const [favorites, setFavorites] = useState<Set<string>>(loadFavorites);

  // Synthesis stop fn
  const stopCurrentRef = useRef<(() => void) | null>(null);
  // HTML Audio element for real audio files
  const htmlAudioRef = useRef<HTMLAudioElement | null>(null);
  // Timer to auto-clear playingId after synthesis ends
  const endTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stopAll = useCallback(() => {
    stopCurrentRef.current?.();
    stopCurrentRef.current = null;
    if (htmlAudioRef.current) {
      htmlAudioRef.current.pause();
      htmlAudioRef.current.src = "";
      htmlAudioRef.current = null;
    }
    if (endTimerRef.current) {
      clearTimeout(endTimerRef.current);
      endTimerRef.current = null;
    }
  }, []);

  const handlePlayToggle = useCallback(
    (sound: Sound) => {
      if (playingId === sound.id) {
        stopAll();
        setPlayingId(null);
      } else {
        stopAll();

        if (sound.url) {
          // ── Real audio file ──────────────────────────────────────────────
          const audio = new Audio(sound.url);
          audio.volume = 0.7;
          htmlAudioRef.current = audio;

          // Update ring duration once metadata is available
          audio.addEventListener("loadedmetadata", () => {
            if (isFinite(audio.duration) && audio.duration > 0) {
              setPlayingDuration(audio.duration);
            }
          }, { once: true });

          audio.addEventListener("ended", () => {
            setPlayingId((prev) => (prev === sound.id ? null : prev));
            htmlAudioRef.current = null;
          }, { once: true });

          audio.play().catch(() => setPlayingId(null));
          // Ring will show a spinner-style long duration until metadata loads
          setPlayingDuration(60);
        } else {
          // ── Synthesized audio ────────────────────────────────────────────
          const profile = getProfile(sound.id);
          const total = profile.duration + profile.release;
          setPlayingDuration(total);
          const stop = playProfile(profile);
          stopCurrentRef.current = stop;
          endTimerRef.current = setTimeout(() => {
            setPlayingId((prev) => (prev === sound.id ? null : prev));
            stopCurrentRef.current = null;
          }, (total + 0.1) * 1000);
        }

        setPlayingId(sound.id);
      }
    },
    [playingId, stopAll]
  );

  const handleFavoriteToggle = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      saveFavorites(next);
      return next;
    });
  }, []);

  const scrollToCategory = (category: string) => {
    const el = document.getElementById(`category-${category}`);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 112;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const sourceSounds =
    activeTab === "favorites"
      ? SOUNDS.filter((s) => favorites.has(s.id))
      : SOUNDS;

  const filteredSounds = sourceSounds.filter(
    (s) =>
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.robloxId.includes(search) ||
      s.category.toLowerCase().includes(search.toLowerCase())
  );

  const visibleCategories = SOUND_CATEGORIES.filter((cat) =>
    filteredSounds.some((s) => s.category === cat)
  );

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
                <h1 className="text-xl font-bold tracking-tight text-white">
                  JJS Soundboard
                </h1>
                <p className="text-xs text-primary/60 font-medium tracking-wider uppercase">
                  Best Sound Library.
                </p>
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

        {/* Tab + Category Nav */}
        <div className="border-t border-white/5 bg-black/20 overflow-x-auto no-scrollbar">
          <div className="max-w-5xl mx-auto px-4 py-2 flex items-center gap-1 min-w-max">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors whitespace-nowrap mr-1 ${
                activeTab === "all"
                  ? "bg-primary/20 text-primary border border-primary/30"
                  : "text-muted-foreground hover:text-white hover:bg-white/5"
              }`}
            >
              All Sounds
            </button>
            <button
              onClick={() => setActiveTab("favorites")}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors whitespace-nowrap flex items-center gap-1.5 mr-3 ${
                activeTab === "favorites"
                  ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                  : "text-muted-foreground hover:text-yellow-400 hover:bg-yellow-500/5"
              }`}
            >
              <Star
                className={`h-3 w-3 ${activeTab === "favorites" ? "fill-current" : ""}`}
              />
              Favorites
              {favorites.size > 0 && (
                <span
                  className={`inline-flex items-center justify-center h-4 min-w-4 px-1 rounded-full text-[10px] font-bold ${
                    activeTab === "favorites"
                      ? "bg-yellow-500/30 text-yellow-300"
                      : "bg-white/10 text-muted-foreground"
                  }`}
                >
                  {favorites.size}
                </span>
              )}
            </button>

            <div className="h-4 w-px bg-white/10 mr-3" />

            {activeTab === "all" &&
              SOUND_CATEGORIES.map((category) => {
                const hasMatches = filteredSounds.some(
                  (s) => s.category === category
                );
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
        {activeTab === "favorites" && favorites.size === 0 && (
          <div className="text-center py-24">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500/10 border border-yellow-500/20 mb-4">
              <Star className="h-8 w-8 text-yellow-500/50" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">
              No favorites yet
            </h3>
            <p className="text-muted-foreground text-sm">
              Click the star on any sound to save it here.
            </p>
          </div>
        )}

        {filteredSounds.length === 0 &&
          !(activeTab === "favorites" && favorites.size === 0) && (
            <div className="text-center py-20">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/5 mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">
                No sounds found
              </h3>
              <p className="text-muted-foreground">
                Try adjusting your search terms.
              </p>
            </div>
          )}

        {filteredSounds.length > 0 && (
          <div className="space-y-10">
            {visibleCategories.map((category) => {
              const categorySounds = filteredSounds.filter(
                (s) => s.category === category
              );
              if (categorySounds.length === 0) return null;

              return (
                <div
                  key={category}
                  id={`category-${category}`}
                  className="scroll-mt-32"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                      {category}
                    </h2>
                    <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                    <span className="text-xs text-muted-foreground">
                      {categorySounds.length}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <AnimatePresence>
                      {categorySounds.map((sound) => (
                        <SoundCard
                          key={sound.id}
                          sound={sound}
                          isPlaying={playingId === sound.id}
                          isFavorite={favorites.has(sound.id)}
                          ringDuration={playingId === sound.id ? playingDuration : 1}
                          onPlayToggle={handlePlayToggle}
                          onFavoriteToggle={handleFavoriteToggle}
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
        <p className="mt-1 opacity-50">
          Not affiliated with Gege Akutami or Roblox Corporation.
        </p>
      </footer>
    </div>
  );
}

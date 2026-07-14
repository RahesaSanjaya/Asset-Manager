import { useState, useCallback } from "react";
import { Search, Copy, Check, Volume2, Star, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { SOUNDS, SOUND_CATEGORIES, Sound } from "@/data/sounds";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

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
  isFavorite,
  onFavoriteToggle,
}: {
  sound: Sound;
  isFavorite: boolean;
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
      className="group relative flex items-center justify-between p-3 sm:p-4 rounded-lg bg-black/5 hover:bg-black/10 dark:bg-card/40 dark:hover:bg-card/80 border border-black/10 dark:border-white/5 hover:border-primary/50 dark:hover:border-primary/30 transition-all overflow-hidden text-black dark:text-white"
    >
      <div className="flex flex-col min-w-0 flex-1 z-10">
        <h3 className="text-sm sm:text-base font-medium text-foreground truncate mb-1">
          {sound.title}
        </h3>
        <div className="font-mono text-xs text-primary/80 select-all cursor-text mb-1 truncate">
          {sound.robloxId}
        </div>
        <Badge
          variant="outline"
          className="w-fit text-[10px] sm:text-xs bg-black/40 border-white/10 text-muted-foreground whitespace-nowrap"
        >
          {sound.category}
        </Badge>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2 pl-3 z-10 shrink-0">

        <button
          onClick={() => onFavoriteToggle(sound.id)}
          title={isFavorite ? "Remove from favorites" : "Add to favorites"}
          className={`h-9 w-9 flex items-center justify-center rounded-md border transition-all ${
            isFavorite
              ? "text-yellow-500 dark:text-yellow-400 border-yellow-500/30 bg-yellow-500/10 hover:bg-yellow-500/20"
              : "text-black dark:text-muted-foreground border-black/10 dark:border-white/10 bg-black/5 dark:bg-black/50 hover:text-yellow-500 dark:hover:text-yellow-400 hover:border-yellow-500/20 hover:bg-yellow-500/10 dark:hover:bg-yellow-500/5"
          }`}
        >
          <Star className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
        </button>

        <button
          onClick={handleCopy}
          title="Copy ID"
          className={`h-9 w-9 flex items-center justify-center rounded-md border transition-all ${
            copied
              ? "bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30"
              : "bg-black/5 dark:bg-black/50 text-black dark:text-muted-foreground border-black/10 dark:border-white/10 hover:text-black dark:hover:text-white hover:border-black/20 dark:hover:border-white/20 hover:bg-black/10 dark:hover:bg-white/5"
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
  const [favorites, setFavorites] = useState<Set<string>>(loadFavorites);
  const { theme, setTheme } = useTheme();

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
              <div className="h-10 w-10 rounded-xl overflow-hidden shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                <img src="/logo.png" alt="JJS Logo" className="h-full w-full object-cover" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-black dark:text-white">
                  JJS Soundboard
                </h1>
                <p className="text-xs text-primary/80 dark:text-primary/60 font-medium tracking-wider uppercase">
                  Best Sound Library.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-black/50 dark:text-muted-foreground" />
                </div>
                <Input
                  type="text"
                  placeholder="Search sounds or IDs..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 bg-black/5 dark:bg-black/40 border-black/10 dark:border-white/10 focus-visible:ring-primary h-10 w-full rounded-full text-black dark:text-white placeholder:text-black/50 dark:placeholder:text-muted-foreground"
                />
              </div>
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="flex items-center justify-center h-10 w-10 rounded-full bg-black/40 border border-white/10 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </button>
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
                          isFavorite={favorites.has(sound.id)}
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

import { useState, useCallback } from "react";
import { Search, Copy, Check, Star, Moon, Sun, Clock, X } from "lucide-react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SOUNDS, SOUND_CATEGORIES } from "@/data/sounds";
import type { Sound } from "@/data/sounds";

const FAVORITES_KEY = "jjs-soundboard-favorites";
const SEARCH_HISTORY_KEY = "jjs-search-history";
const MAX_HISTORY = 5;

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

function loadSearchHistory(): string[] {
  try {
    const raw = localStorage.getItem(SEARCH_HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveSearchHistory(history: string[]) {
  localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history));
}

const CopyButton = ({ robloxId }: { robloxId: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(robloxId);
    } catch {
      const el = document.createElement("textarea");
      el.value = robloxId;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleCopy}
      title="Copy ID"
      className={copied ? "text-green-600 dark:text-green-400" : ""}
    >
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
    </Button>
  );
};

const SoundCard = ({
  sound,
  isFavorite,
  onFavoriteToggle,
}: {
  sound: Sound;
  isFavorite: boolean;
  onFavoriteToggle: (id: string) => void;
}) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.95 }}
    transition={{ duration: 0.18 }}
  >
    <Card className="flex items-center justify-between p-3 sm:p-4">
      <div className="flex flex-col min-w-0 flex-1">
        <h3 className="text-sm sm:text-base font-medium text-foreground truncate mb-1">
          {sound.title}
        </h3>
        <div className="font-mono text-xs text-primary/80 select-all cursor-text mb-1 truncate">
          {sound.robloxId}
        </div>
        <Badge variant="outline" className="w-fit text-[10px] sm:text-xs whitespace-nowrap">
          {sound.category}
        </Badge>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2 pl-3 shrink-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onFavoriteToggle(sound.id)}
          title={isFavorite ? "Remove from favorites" : "Add to favorites"}
          className={isFavorite ? "text-yellow-500 dark:text-yellow-400" : ""}
        >
          <Star className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
        </Button>
        <CopyButton robloxId={sound.robloxId} />
      </div>
    </Card>
  </motion.div>
);

type Tab = "all" | "favorites";

export default function Soundboard() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [favorites, setFavorites] = useState<Set<string>>(loadFavorites);
  const [searchHistory, setSearchHistory] = useState<string[]>(loadSearchHistory);
  const [showHistory, setShowHistory] = useState(false);
  const { theme, setTheme } = useTheme();

  const addToHistory = useCallback((term: string) => {
    setSearchHistory((prev) => {
      const filtered = prev.filter((t) => t !== term);
      const updated = [term, ...filtered].slice(0, MAX_HISTORY);
      saveSearchHistory(updated);
      return updated;
    });
  }, []);

  const removeFromHistory = useCallback((term: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSearchHistory((prev) => {
      const updated = prev.filter((t) => t !== term);
      saveSearchHistory(updated);
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setSearchHistory([]);
    saveSearchHistory([]);
  }, []);

  const handleSearchClick = useCallback(() => {
    if (searchHistory.length > 0) {
      setShowHistory(true);
    }
  }, [searchHistory.length]);

  const handleHistoryItemClick = useCallback((term: string) => {
    setSearch(term);
    setShowHistory(false);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && search.trim()) {
      addToHistory(search.trim());
      setShowHistory(false);
    }
  }, [search, addToHistory]);

  const handleBlur = useCallback(() => {
    setTimeout(() => setShowHistory(false), 200);
  }, []);

  const handleFavoriteToggle = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      saveFavorites(next);
      return next;
    });
  }, []);

  const sourceSounds = activeTab === "favorites"
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
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border dark:shadow-2xl dark:shadow-black/50">
        <div className="relative max-w-5xl mx-auto px-4">
          <div className="absolute top-4 right-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </Button>
          </div>

          <div className="flex flex-col items-center pt-8 pb-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl overflow-hidden shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                <img src="/logo.png" alt="JJS Logo" className="h-full w-full object-cover" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                JJS Soundboard
              </h1>
            </div>
          </div>

          <div className="flex justify-center pb-3">
            <div className="relative w-full max-w-xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
              <Input
                type="text"
                placeholder="Search sounds or IDs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleKeyDown}
                onClick={handleSearchClick}
                onBlur={handleBlur}
                className="pl-11 h-12 w-full rounded-full text-base"
              />
              {showHistory && searchHistory.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-lg z-50 overflow-hidden">
                  {searchHistory.map((term) => (
                    <div
                      key={term}
                      className="flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-muted transition-colors"
                      onMouseDown={() => handleHistoryItemClick(term)}
                    >
                      <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="flex-1 text-sm text-foreground truncate">{term}</span>
                      <button
                        onMouseDown={(e) => removeFromHistory(term, e)}
                        className="p-1 hover:bg-muted-foreground/20 rounded-full transition-colors"
                        title="Remove"
                      >
                        <X className="h-3.5 w-3.5 text-muted-foreground" />
                      </button>
                    </div>
                  ))}
                  <div className="border-t border-border px-4 py-2">
                    <button
                      onMouseDown={clearHistory}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Clear search history
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="dark:border-t dark:border-border dark:bg-black/20 overflow-x-auto no-scrollbar">
          <div className="max-w-5xl mx-auto px-4 py-2 flex justify-center">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as Tab)}>
              <TabsList className="justify-center">
                <TabsTrigger value="all">All Sounds</TabsTrigger>
                <TabsTrigger value="favorites" className="gap-1.5">
                  <Star className="h-3 w-3" />
                  Favorites
                  {favorites.size > 0 && (
                    <span className="inline-flex items-center justify-center h-4 min-w-4 px-1 rounded-full text-[10px] font-bold bg-muted text-muted-foreground ml-1">
                      {favorites.size}
                    </span>
                  )}
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {activeTab === "favorites" && favorites.size === 0 && (
          <div className="text-center py-24">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted border border-border mb-4">
              <Star className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
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
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted border border-border mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
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
                    <CardTitle className="text-lg sm:text-xl">
                      {category}
                    </CardTitle>
                    <div className="h-px flex-1 bg-border" />
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

      <footer className="mt-20 border-t border-border py-8 text-center text-xs text-muted-foreground bg-muted/50">
        <p>Audio IDs are intended for use in Roblox Studio.</p>
        <p className="mt-1 opacity-50">
          Not affiliated with Gege Akutami or Roblox Corporation.
        </p>
      </footer>
    </div>
  );
}

export type Sound = {
  id: string;
  title: string;
  category: string;
  robloxId: string;
  /** Real audio file path (e.g. "/audio/domain-expansion.mp3").
   *  Leave undefined to use the built-in synthesized tone. */
  url?: string;
};

export const SOUND_CATEGORIES = [
  "Music",
  "Impacts & Ragdolls",
  "Gojo",
  "Sukuna",
  "Hakari",
  "Yuji",
  "Items"
] as const;

export type SoundCategory = typeof SOUND_CATEGORIES[number];

// To use a real audio file, set url to a path like "/audio/filename.mp3"
// (place the file in artifacts/jjs-soundboard/public/audio/).
// Leave url undefined to use the built-in synthesized tone.
export const SOUNDS: Sound[] = [
  // Music
  { id: "m1", title: "Domain Expansion Theme",          category: "Music", robloxId: "6473829105" },
  { id: "m2", title: "Hollow Purple (OST)",             category: "Music", robloxId: "7283940192" },
  { id: "m3", title: "Gojo's Infinity (Ambient)",       category: "Music", robloxId: "8472910384" },
  { id: "m4", title: "Cursed Energy (Battle)",          category: "Music", robloxId: "9384728194" },
  { id: "m5", title: "Jujutsu High Theme",              category: "Music", robloxId: "5748392019" },
  { id: "m6", title: "Mahito's Domain",                 category: "Music", robloxId: "3847291028" },
  { id: "m7", title: "Hakari's Lucky Theme",            category: "Music", robloxId: "4728193048" },
  { id: "m8", title: "Reverse Cursed Technique (Calm)", category: "Music", robloxId: "1928374650" },

  // Impacts & Ragdolls
  { id: "i1", title: "Heavy Impact",    category: "Impacts & Ragdolls", robloxId: "2938475610" },
  { id: "i2", title: "Ragdoll Slam",    category: "Impacts & Ragdolls", robloxId: "5847362910" },
  { id: "i3", title: "Bone Crack",      category: "Impacts & Ragdolls", robloxId: "3948572019" },
  { id: "i4", title: "Explosion",       category: "Impacts & Ragdolls", robloxId: "7483920194" },
  { id: "i5", title: "Ground Shatter",  category: "Impacts & Ragdolls", robloxId: "1029384756" },
  { id: "i6", title: "Shockwave Burst", category: "Impacts & Ragdolls", robloxId: "8475629103" },
  { id: "i7", title: "Debris Scatter",  category: "Impacts & Ragdolls", robloxId: "4758392019" },
  { id: "i8", title: "Death Sound",     category: "Impacts & Ragdolls", robloxId: "5869403928" },

  // Gojo
  { id: "g1", title: "Infinity Activation", category: "Gojo", robloxId: "9384756102" },
  { id: "g2", title: "Blue (Attraction)",   category: "Gojo", robloxId: "1029384750" },
  { id: "g3", title: "Red (Repulsion)",     category: "Gojo", robloxId: "5847392011" },
  { id: "g4", title: "Purple (Hollow)",     category: "Gojo", robloxId: "3948572018" },
  { id: "g5", title: "Domain Expansion",    category: "Gojo", robloxId: "4758692013" },
  { id: "g6", title: "Six Eyes Reveal",     category: "Gojo", robloxId: "2938475614" },
  { id: "g7", title: "Limitless Cancel",    category: "Gojo", robloxId: "8475629107" },
  { id: "g8", title: "Gojo Laugh",          category: "Gojo", robloxId: "5748392015" },

  // Sukuna
  { id: "s1", title: "Domain Malevolent Shrine", category: "Sukuna", robloxId: "3847592019" },
  { id: "s2", title: "Slash Attack",             category: "Sukuna", robloxId: "1928374651" },
  { id: "s3", title: "Dismantle",                category: "Sukuna", robloxId: "9384728193" },
  { id: "s4", title: "Cleave",                   category: "Sukuna", robloxId: "5847362916" },
  { id: "s5", title: "Sukuna Taunt",             category: "Sukuna", robloxId: "3948572012" },
  { id: "s6", title: "Divergent Fist",           category: "Sukuna", robloxId: "4728193042" },
  { id: "s7", title: "Ten Shadows Crush",        category: "Sukuna", robloxId: "8472910388" },
  { id: "s8", title: "Sukuna Roar",              category: "Sukuna", robloxId: "7483920198" },

  // Hakari
  { id: "h1", title: "Jackpot!",                category: "Hakari", robloxId: "2938475617" },
  { id: "h2", title: "Domain Idle Death Gamble", category: "Hakari", robloxId: "5847392013" },
  { id: "h3", title: "Curtain Drop",             category: "Hakari", robloxId: "1029384753" },
  { id: "h4", title: "Reverse Cursed Punch",     category: "Hakari", robloxId: "3948572016" },
  { id: "h5", title: "Pachinko Hit",             category: "Hakari", robloxId: "4758692010" },
  { id: "h6", title: "Lucky Roll",               category: "Hakari", robloxId: "8475629109" },
  { id: "h7", title: "Hakari Dash",              category: "Hakari", robloxId: "5748392011" },
  { id: "h8", title: "Domain Reset",             category: "Hakari", robloxId: "9384756105" },

  // Yuji
  { id: "y1", title: "Divergent Fist Impact", category: "Yuji", robloxId: "3847291022" },
  { id: "y2", title: "Black Flash",           category: "Yuji", robloxId: "7283940196" },
  { id: "y3", title: "Yuji Shout",            category: "Yuji", robloxId: "6473829101" },
  { id: "y4", title: "Superhuman Punch",      category: "Yuji", robloxId: "5869403924" },
  { id: "y5", title: "Boost Slam",            category: "Yuji", robloxId: "4758392013" },
  { id: "y6", title: "Divergent Fist Combo",  category: "Yuji", robloxId: "8475629100" },
  { id: "y7", title: "Yuji Footstep",         category: "Yuji", robloxId: "1029384759" },
  { id: "y8", title: "Wind-Up Punch",         category: "Yuji", robloxId: "7483920191" },

  // Items
  { id: "it1", title: "Curtain Activation", category: "Items", robloxId: "5847392014" },
  { id: "it2", title: "Binding Vow",        category: "Items", robloxId: "3948572010" },
  { id: "it3", title: "Grade Stamp",        category: "Items", robloxId: "9384756108" },
  { id: "it4", title: "Seal Barrier",       category: "Items", robloxId: "2938475618" },
  { id: "it5", title: "Talisman Break",     category: "Items", robloxId: "4758692017" },
  { id: "it6", title: "Cursed Tool Clash",  category: "Items", robloxId: "8475629102" },
  { id: "it7", title: "Sorcerer Badge",     category: "Items", robloxId: "5748392016" },
  { id: "it8", title: "Item Pickup",        category: "Items", robloxId: "1029384752" },
];

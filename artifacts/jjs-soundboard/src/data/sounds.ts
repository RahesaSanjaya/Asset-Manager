export type Sound = {
  id: string;
  title: string;
  category: string;
  robloxId: string;
  url: string;
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

// Short, freely accessible MP3s from mixkit (CORS-friendly CDN)
const SFX_IMPACT   = "https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3";
const SFX_BOOM     = "https://assets.mixkit.co/active_storage/sfx/1/1-preview.mp3";
const SFX_WHOOSH   = "https://assets.mixkit.co/active_storage/sfx/2/2-preview.mp3";
const SFX_CLICK    = "https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3";
const SFX_PUNCH    = "https://assets.mixkit.co/active_storage/sfx/2586/2586-preview.mp3";
const SFX_SWOOSH   = "https://assets.mixkit.co/active_storage/sfx/2578/2578-preview.mp3";
const SFX_POWER    = "https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3";
const SFX_ALERT    = "https://assets.mixkit.co/active_storage/sfx/2570/2570-preview.mp3";

export const SOUNDS: Sound[] = [
  // Music
  { id: "m1", title: "Domain Expansion Theme",         category: "Music", robloxId: "6473829105", url: SFX_POWER },
  { id: "m2", title: "Hollow Purple (OST)",            category: "Music", robloxId: "7283940192", url: SFX_ALERT },
  { id: "m3", title: "Gojo's Infinity (Ambient)",      category: "Music", robloxId: "8472910384", url: SFX_SWOOSH },
  { id: "m4", title: "Cursed Energy (Battle)",         category: "Music", robloxId: "9384728194", url: SFX_BOOM },
  { id: "m5", title: "Jujutsu High Theme",             category: "Music", robloxId: "5748392019", url: SFX_CLICK },
  { id: "m6", title: "Mahito's Domain",                category: "Music", robloxId: "3847291028", url: SFX_IMPACT },
  { id: "m7", title: "Hakari's Lucky Theme",           category: "Music", robloxId: "4728193048", url: SFX_PUNCH },
  { id: "m8", title: "Reverse Cursed Technique (Calm)",category: "Music", robloxId: "1928374650", url: SFX_WHOOSH },

  // Impacts & Ragdolls
  { id: "i1", title: "Heavy Impact",    category: "Impacts & Ragdolls", robloxId: "2938475610", url: SFX_IMPACT },
  { id: "i2", title: "Ragdoll Slam",    category: "Impacts & Ragdolls", robloxId: "5847362910", url: SFX_BOOM },
  { id: "i3", title: "Bone Crack",      category: "Impacts & Ragdolls", robloxId: "3948572019", url: SFX_CLICK },
  { id: "i4", title: "Explosion",       category: "Impacts & Ragdolls", robloxId: "7483920194", url: SFX_POWER },
  { id: "i5", title: "Ground Shatter",  category: "Impacts & Ragdolls", robloxId: "1029384756", url: SFX_PUNCH },
  { id: "i6", title: "Shockwave Burst", category: "Impacts & Ragdolls", robloxId: "8475629103", url: SFX_SWOOSH },
  { id: "i7", title: "Debris Scatter",  category: "Impacts & Ragdolls", robloxId: "4758392019", url: SFX_ALERT },
  { id: "i8", title: "Death Sound",     category: "Impacts & Ragdolls", robloxId: "5869403928", url: SFX_WHOOSH },

  // Gojo
  { id: "g1", title: "Infinity Activation", category: "Gojo", robloxId: "9384756102", url: SFX_POWER },
  { id: "g2", title: "Blue (Attraction)",   category: "Gojo", robloxId: "1029384750", url: SFX_SWOOSH },
  { id: "g3", title: "Red (Repulsion)",     category: "Gojo", robloxId: "5847392011", url: SFX_BOOM },
  { id: "g4", title: "Purple (Hollow)",     category: "Gojo", robloxId: "3948572018", url: SFX_ALERT },
  { id: "g5", title: "Domain Expansion",    category: "Gojo", robloxId: "4758692013", url: SFX_IMPACT },
  { id: "g6", title: "Six Eyes Reveal",     category: "Gojo", robloxId: "2938475614", url: SFX_CLICK },
  { id: "g7", title: "Limitless Cancel",    category: "Gojo", robloxId: "8475629107", url: SFX_PUNCH },
  { id: "g8", title: "Gojo Laugh",          category: "Gojo", robloxId: "5748392015", url: SFX_WHOOSH },

  // Sukuna
  { id: "s1", title: "Domain Malevolent Shrine", category: "Sukuna", robloxId: "3847592019", url: SFX_POWER },
  { id: "s2", title: "Slash Attack",             category: "Sukuna", robloxId: "1928374651", url: SFX_SWOOSH },
  { id: "s3", title: "Dismantle",                category: "Sukuna", robloxId: "9384728193", url: SFX_IMPACT },
  { id: "s4", title: "Cleave",                   category: "Sukuna", robloxId: "5847362916", url: SFX_CLICK },
  { id: "s5", title: "Sukuna Taunt",             category: "Sukuna", robloxId: "3948572012", url: SFX_ALERT },
  { id: "s6", title: "Divergent Fist",           category: "Sukuna", robloxId: "4728193042", url: SFX_PUNCH },
  { id: "s7", title: "Ten Shadows Crush",        category: "Sukuna", robloxId: "8472910388", url: SFX_BOOM },
  { id: "s8", title: "Sukuna Roar",              category: "Sukuna", robloxId: "7483920198", url: SFX_WHOOSH },

  // Hakari
  { id: "h1", title: "Jackpot!",               category: "Hakari", robloxId: "2938475617", url: SFX_ALERT },
  { id: "h2", title: "Domain Idle Death Gamble",category: "Hakari", robloxId: "5847392013", url: SFX_POWER },
  { id: "h3", title: "Curtain Drop",            category: "Hakari", robloxId: "1029384753", url: SFX_BOOM },
  { id: "h4", title: "Reverse Cursed Punch",    category: "Hakari", robloxId: "3948572016", url: SFX_PUNCH },
  { id: "h5", title: "Pachinko Hit",            category: "Hakari", robloxId: "4758692010", url: SFX_CLICK },
  { id: "h6", title: "Lucky Roll",              category: "Hakari", robloxId: "8475629109", url: SFX_SWOOSH },
  { id: "h7", title: "Hakari Dash",             category: "Hakari", robloxId: "5748392011", url: SFX_IMPACT },
  { id: "h8", title: "Domain Reset",            category: "Hakari", robloxId: "9384756105", url: SFX_WHOOSH },

  // Yuji
  { id: "y1", title: "Divergent Fist Impact", category: "Yuji", robloxId: "3847291022", url: SFX_PUNCH },
  { id: "y2", title: "Black Flash",           category: "Yuji", robloxId: "7283940196", url: SFX_POWER },
  { id: "y3", title: "Yuji Shout",            category: "Yuji", robloxId: "6473829101", url: SFX_ALERT },
  { id: "y4", title: "Superhuman Punch",      category: "Yuji", robloxId: "5869403924", url: SFX_IMPACT },
  { id: "y5", title: "Boost Slam",            category: "Yuji", robloxId: "4758392013", url: SFX_BOOM },
  { id: "y6", title: "Divergent Fist Combo",  category: "Yuji", robloxId: "8475629100", url: SFX_SWOOSH },
  { id: "y7", title: "Yuji Footstep",         category: "Yuji", robloxId: "1029384759", url: SFX_CLICK },
  { id: "y8", title: "Wind-Up Punch",         category: "Yuji", robloxId: "7483920191", url: SFX_WHOOSH },

  // Items
  { id: "it1", title: "Curtain Activation", category: "Items", robloxId: "5847392014", url: SFX_POWER },
  { id: "it2", title: "Binding Vow",        category: "Items", robloxId: "3948572010", url: SFX_ALERT },
  { id: "it3", title: "Grade Stamp",        category: "Items", robloxId: "9384756108", url: SFX_CLICK },
  { id: "it4", title: "Seal Barrier",       category: "Items", robloxId: "2938475618", url: SFX_SWOOSH },
  { id: "it5", title: "Talisman Break",     category: "Items", robloxId: "4758692017", url: SFX_IMPACT },
  { id: "it6", title: "Cursed Tool Clash",  category: "Items", robloxId: "8475629102", url: SFX_BOOM },
  { id: "it7", title: "Sorcerer Badge",     category: "Items", robloxId: "5748392016", url: SFX_PUNCH },
  { id: "it8", title: "Item Pickup",        category: "Items", robloxId: "1029384752", url: SFX_WHOOSH },
];

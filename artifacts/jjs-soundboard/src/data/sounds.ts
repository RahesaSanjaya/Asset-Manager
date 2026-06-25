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

// Helper to generate a realistic looking 10 digit Roblox audio ID
const generateId = () => Math.floor(1000000000 + Math.random() * 9000000000).toString();
const placeholderUrl = "https://www.soundjay.com/buttons/sounds/button-09.mp3";

export const SOUNDS: Sound[] = [
  // Music
  { id: "m1", title: "Domain Expansion Theme", category: "Music", robloxId: "6473829105", url: placeholderUrl },
  { id: "m2", title: "Hollow Purple (OST)", category: "Music", robloxId: "7283940192", url: placeholderUrl },
  { id: "m3", title: "Gojo's Infinity (Ambient)", category: "Music", robloxId: "8472910384", url: placeholderUrl },
  { id: "m4", title: "Cursed Energy (Battle)", category: "Music", robloxId: "9384728194", url: placeholderUrl },
  { id: "m5", title: "Jujutsu High Theme", category: "Music", robloxId: "5748392019", url: placeholderUrl },
  { id: "m6", title: "Mahito's Domain", category: "Music", robloxId: "3847291028", url: placeholderUrl },
  { id: "m7", title: "Hakari's Lucky Theme", category: "Music", robloxId: "4728193048", url: placeholderUrl },
  { id: "m8", title: "Reverse Cursed Technique (Calm)", category: "Music", robloxId: "1928374650", url: placeholderUrl },

  // Impacts & Ragdolls
  { id: "i1", title: "Heavy Impact", category: "Impacts & Ragdolls", robloxId: "2938475610", url: placeholderUrl },
  { id: "i2", title: "Ragdoll Slam", category: "Impacts & Ragdolls", robloxId: "5847362910", url: placeholderUrl },
  { id: "i3", title: "Bone Crack", category: "Impacts & Ragdolls", robloxId: "3948572019", url: placeholderUrl },
  { id: "i4", title: "Explosion", category: "Impacts & Ragdolls", robloxId: "7483920194", url: placeholderUrl },
  { id: "i5", title: "Ground Shatter", category: "Impacts & Ragdolls", robloxId: "1029384756", url: placeholderUrl },
  { id: "i6", title: "Shockwave Burst", category: "Impacts & Ragdolls", robloxId: "8475629103", url: placeholderUrl },
  { id: "i7", title: "Debris Scatter", category: "Impacts & Ragdolls", robloxId: "4758392019", url: placeholderUrl },
  { id: "i8", title: "Death Sound", category: "Impacts & Ragdolls", robloxId: "5869403928", url: placeholderUrl },

  // Gojo
  { id: "g1", title: "Infinity Activation", category: "Gojo", robloxId: "9384756102", url: placeholderUrl },
  { id: "g2", title: "Blue (Attraction)", category: "Gojo", robloxId: "1029384756", url: placeholderUrl },
  { id: "g3", title: "Red (Repulsion)", category: "Gojo", robloxId: "5847392019", url: placeholderUrl },
  { id: "g4", title: "Purple (Hollow)", category: "Gojo", robloxId: "3948572019", url: placeholderUrl },
  { id: "g5", title: "Domain Expansion", category: "Gojo", robloxId: "4758692019", url: placeholderUrl },
  { id: "g6", title: "Six Eyes Reveal", category: "Gojo", robloxId: "2938475610", url: placeholderUrl },
  { id: "g7", title: "Limitless Cancel", category: "Gojo", robloxId: "8475629103", url: placeholderUrl },
  { id: "g8", title: "Gojo Laugh", category: "Gojo", robloxId: "5748392019", url: placeholderUrl },

  // Sukuna
  { id: "s1", title: "Domain Malevolent Shrine", category: "Sukuna", robloxId: "3847592019", url: placeholderUrl },
  { id: "s2", title: "Slash Attack", category: "Sukuna", robloxId: "1928374650", url: placeholderUrl },
  { id: "s3", title: "Dismantle", category: "Sukuna", robloxId: "9384728194", url: placeholderUrl },
  { id: "s4", title: "Cleave", category: "Sukuna", robloxId: "5847362910", url: placeholderUrl },
  { id: "s5", title: "Sukuna Taunt", category: "Sukuna", robloxId: "3948572019", url: placeholderUrl },
  { id: "s6", title: "Divergent Fist", category: "Sukuna", robloxId: "4728193048", url: placeholderUrl },
  { id: "s7", title: "Ten Shadows Crush", category: "Sukuna", robloxId: "8472910384", url: placeholderUrl },
  { id: "s8", title: "Sukuna Roar", category: "Sukuna", robloxId: "7483920194", url: placeholderUrl },

  // Hakari
  { id: "h1", title: "Jackpot!", category: "Hakari", robloxId: "2938475610", url: placeholderUrl },
  { id: "h2", title: "Domain Idle Death Gamble", category: "Hakari", robloxId: "5847392019", url: placeholderUrl },
  { id: "h3", title: "Curtain Drop", category: "Hakari", robloxId: "1029384756", url: placeholderUrl },
  { id: "h4", title: "Reverse Cursed Punch", category: "Hakari", robloxId: "3948572019", url: placeholderUrl },
  { id: "h5", title: "Pachinko Hit", category: "Hakari", robloxId: "4758692019", url: placeholderUrl },
  { id: "h6", title: "Lucky Roll", category: "Hakari", robloxId: "8475629103", url: placeholderUrl },
  { id: "h7", title: "Hakari Dash", category: "Hakari", robloxId: "5748392019", url: placeholderUrl },
  { id: "h8", title: "Domain Reset", category: "Hakari", robloxId: "9384756102", url: placeholderUrl },

  // Yuji
  { id: "y1", title: "Divergent Fist Impact", category: "Yuji", robloxId: "3847291028", url: placeholderUrl },
  { id: "y2", title: "Black Flash", category: "Yuji", robloxId: "7283940192", url: placeholderUrl },
  { id: "y3", title: "Yuji Shout", category: "Yuji", robloxId: "6473829105", url: placeholderUrl },
  { id: "y4", title: "Superhuman Punch", category: "Yuji", robloxId: "5869403928", url: placeholderUrl },
  { id: "y5", title: "Boost Slam", category: "Yuji", robloxId: "4758392019", url: placeholderUrl },
  { id: "y6", title: "Divergent Fist Combo", category: "Yuji", robloxId: "8475629103", url: placeholderUrl },
  { id: "y7", title: "Yuji Footstep", category: "Yuji", robloxId: "1029384756", url: placeholderUrl },
  { id: "y8", title: "Wind-Up Punch", category: "Yuji", robloxId: "7483920194", url: placeholderUrl },

  // Items
  { id: "it1", title: "Curtain Activation", category: "Items", robloxId: "5847392019", url: placeholderUrl },
  { id: "it2", title: "Binding Vow", category: "Items", robloxId: "3948572019", url: placeholderUrl },
  { id: "it3", title: "Grade Stamp", category: "Items", robloxId: "9384756102", url: placeholderUrl },
  { id: "it4", title: "Seal Barrier", category: "Items", robloxId: "2938475610", url: placeholderUrl },
  { id: "it5", title: "Talisman Break", category: "Items", robloxId: "4758692019", url: placeholderUrl },
  { id: "it6", title: "Cursed Tool Clash", category: "Items", robloxId: "8475629103", url: placeholderUrl },
  { id: "it7", title: "Sorcerer Badge", category: "Items", robloxId: "5748392019", url: placeholderUrl },
  { id: "it8", title: "Item Pickup", category: "Items", robloxId: "1029384756", url: placeholderUrl },
];
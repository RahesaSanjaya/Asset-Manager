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
  "M1s & Dashes",
  "Gojo",
  "Sukuna",
  "Yuji",
  "Hakari",
  "Megumi",
  "Mahito",
  "Yuta",
  "Todo",
  "Items",
] as const;

export type SoundCategory = typeof SOUND_CATEGORIES[number];

// To use a real audio file, set url to a path like "/audio/filename.mp3"
// (place the file in artifacts/jjs-soundboard/public/audio/).
// Leave url undefined to use the built-in synthesized tone.
// All IDs sourced from ossaamm.github.io
export const SOUNDS: Sound[] = [
  // Music
  { id: "m1", title: "Domain Clash Theme",          category: "Music", robloxId: "89526560746434" },
  { id: "m2", title: "Infinite Void (Gojo Domain)", category: "Music", robloxId: "16071901783" },
  { id: "m3", title: "Malevolent Shrine (Sukuna)",  category: "Music", robloxId: "15583493700" },
  { id: "m4", title: "Idle Death Gamble (Hakari)",  category: "Music", robloxId: "9039704032" },
  { id: "m5", title: "Jackpot! (Hakari)",           category: "Music", robloxId: "1841443579" },
  { id: "m6", title: "Red Max — Remember",          category: "Music", robloxId: "17284219852" },
  { id: "m7", title: "Jihei Endonka (Mahito)",      category: "Music", robloxId: "17856253579" },
  { id: "m8", title: "Hollow Purple Theme",         category: "Music", robloxId: "14326861262" },

  // Impacts & Ragdolls
  { id: "i1", title: "Impact 1",       category: "Impacts & Ragdolls", robloxId: "91186117342" },
  { id: "i2", title: "Impact 2",       category: "Impacts & Ragdolls", robloxId: "9118615862" },
  { id: "i3", title: "Impact 3",       category: "Impacts & Ragdolls", robloxId: "9118614058" },
  { id: "i4", title: "Impact 4",       category: "Impacts & Ragdolls", robloxId: "9116816096" },
  { id: "i5", title: "Ragdoll Fall 1", category: "Impacts & Ragdolls", robloxId: "3784888301" },
  { id: "i6", title: "Ragdoll Fall 2", category: "Impacts & Ragdolls", robloxId: "3784888809" },
  { id: "i7", title: "Ragdoll Fall 3", category: "Impacts & Ragdolls", robloxId: "3784889529" },
  { id: "i8", title: "Break (Downslam)", category: "Impacts & Ragdolls", robloxId: "3778609188" },

  // M1s & Dashes
  { id: "d1", title: "M1 Swing",         category: "M1s & Dashes", robloxId: "4571259077" },
  { id: "d2", title: "M1 Hit 1",         category: "M1s & Dashes", robloxId: "8595975878" },
  { id: "d3", title: "M1 Hit 2",         category: "M1s & Dashes", robloxId: "8595975458" },
  { id: "d4", title: "M1 Hit 3",         category: "M1s & Dashes", robloxId: "8595974357" },
  { id: "d5", title: "Front Dash",       category: "M1s & Dashes", robloxId: "4909206080" },
  { id: "d6", title: "Front Dash Hit",   category: "M1s & Dashes", robloxId: "8595975458" },
  { id: "d7", title: "Side Dash",        category: "M1s & Dashes", robloxId: "3929467229" },
  { id: "d8", title: "Strike (Mahito Blade Hit)", category: "M1s & Dashes", robloxId: "17866718764" },

  // Gojo
  { id: "g1", title: "Lapse Blue Pull",    category: "Gojo", robloxId: "411286671" },
  { id: "g2", title: "Infinity",           category: "Gojo", robloxId: "9066732918" },
  { id: "g3", title: "Red Wind",           category: "Gojo", robloxId: "6006851551" },
  { id: "g4", title: "Red Explode",        category: "Gojo", robloxId: "3059775624" },
  { id: "g5", title: "Hollow Purple Hit",  category: "Gojo", robloxId: "698224146" },
  { id: "g6", title: "Domain Voice",       category: "Gojo", robloxId: "6667923288" },
  { id: "g7", title: "Infinite Void SFX",  category: "Gojo", robloxId: "15171602676" },
  { id: "g8", title: "Domain Shatter",     category: "Gojo", robloxId: "6737581507" },

  // Sukuna
  { id: "s1", title: "Dismantle Slash",   category: "Sukuna", robloxId: "935843979" },
  { id: "s2", title: "Finish Slash",      category: "Sukuna", robloxId: "9119749145" },
  { id: "s3", title: "World Slash 1",     category: "Sukuna", robloxId: "17053666464" },
  { id: "s4", title: "World Slash 2",     category: "Sukuna", robloxId: "17053670289" },
  { id: "s5", title: "World Slash 3",     category: "Sukuna", robloxId: "17053667034" },
  { id: "s6", title: "Shrine Voice",      category: "Sukuna", robloxId: "7817341182" },
  { id: "s7", title: "Shrine Domain Ring",category: "Sukuna", robloxId: "7817336081" },
  { id: "s8", title: "Open — Arrow",      category: "Sukuna", robloxId: "7278163473" },

  // Yuji
  { id: "y1", title: "Divergent Fist Crack",  category: "Yuji", robloxId: "4403634269" },
  { id: "y2", title: "Divergent Fist Swing",  category: "Yuji", robloxId: "4059009185" },
  { id: "y3", title: "Divergent Fist Hit",    category: "Yuji", robloxId: "7515452875" },
  { id: "y4", title: "Black Flash Sparks",    category: "Yuji", robloxId: "12764933067" },
  { id: "y5", title: "Black Flash",           category: "Yuji", robloxId: "9114314398" },
  { id: "y6", title: "Manji Kick Startup",    category: "Yuji", robloxId: "9125615451" },
  { id: "y7", title: "Manji Kick Slam",       category: "Yuji", robloxId: "9126228977" },
  { id: "y8", title: "Voice (Kôkusen)",       category: "Yuji", robloxId: "12761286504" },

  // Hakari
  { id: "h1", title: "Jackpot!",             category: "Hakari", robloxId: "6644505962" },
  { id: "h2", title: "Jackpot Music",        category: "Hakari", robloxId: "1841443579" },
  { id: "h3", title: "Domain Travel",        category: "Hakari", robloxId: "16943255415" },
  { id: "h4", title: "Shutter Doors Spawn",  category: "Hakari", robloxId: "9125644321" },
  { id: "h5", title: "Shutter Doors Slam",   category: "Hakari", robloxId: "9116684884" },
  { id: "h6", title: "Fever Breaker Swing",  category: "Hakari", robloxId: "17101065238" },
  { id: "h7", title: "Rough Energy Charge",  category: "Hakari", robloxId: "17046377464" },
  { id: "h8", title: "Domain Roll",          category: "Hakari", robloxId: "3299794881" },

  // Megumi
  { id: "me1", title: "Rabbit Escape Spawn", category: "Megumi", robloxId: "17206057016" },
  { id: "me2", title: "Nue Spawn",           category: "Megumi", robloxId: "17269358415" },
  { id: "me3", title: "Nue Hit",             category: "Megumi", robloxId: "17269354824" },
  { id: "me4", title: "Toad Spawn",          category: "Megumi", robloxId: "17269355559" },
  { id: "me5", title: "Max Elephant Hit",    category: "Megumi", robloxId: "4086190876" },
  { id: "me6", title: "Great Serpent Spawn", category: "Megumi", robloxId: "17513691442" },
  { id: "me7", title: "Shadow Enter",        category: "Megumi", robloxId: "4459057272" },
  { id: "me8", title: "Mahoraga Timer",      category: "Megumi", robloxId: "17607887277" },

  // Mahito
  { id: "ma1", title: "Stockpile Hit",         category: "Mahito", robloxId: "9118609396" },
  { id: "ma2", title: "Soul Fire Morph",        category: "Mahito", robloxId: "3929463305" },
  { id: "ma3", title: "Focus Strike Black Flash", category: "Mahito", robloxId: "17520297840" },
  { id: "ma4", title: "Blade Chains",           category: "Mahito", robloxId: "9113756883" },
  { id: "ma5", title: "Body Repel Clap",        category: "Mahito", robloxId: "18259558246" },
  { id: "ma6", title: "Body Repel Fire",        category: "Mahito", robloxId: "18259558562" },
  { id: "ma7", title: "Transform — Blade",      category: "Mahito", robloxId: "18110706601" },
  { id: "ma8", title: "Domain Voice",           category: "Mahito", robloxId: "17866271934" },

  // Yuta
  { id: "yu1", title: "Resolute Slash",      category: "Yuta", robloxId: "14427790767" },
  { id: "yu2", title: "Black Flash Windup",  category: "Yuta", robloxId: "126598851794168" },
  { id: "yu3", title: "Black Flash Land",    category: "Yuta", robloxId: "132472285449398" },
  { id: "yu4", title: "Veilstep",            category: "Yuta", robloxId: "121354995604661" },
  { id: "yu5", title: "Veilstep Hit",        category: "Yuta", robloxId: "90439756216771" },
  { id: "yu6", title: "Sword Grab",          category: "Yuta", robloxId: "122209095269858" },
  { id: "yu7", title: "Swing",               category: "Yuta", robloxId: "86506412325620" },
  { id: "yu8", title: "Electric Shock",      category: "Yuta", robloxId: "120458587618994" },

  // Todo
  { id: "to1", title: "Clap (Boogie Woogie)", category: "Todo", robloxId: "17156034319" },
  { id: "to2", title: "Swift Kick Dash",      category: "Todo", robloxId: "17101065425" },
  { id: "to3", title: "Brute Force Start",    category: "Todo", robloxId: "17725418857" },
  { id: "to4", title: "Black Flash Sparks",   category: "Todo", robloxId: "12764933067" },
  { id: "to5", title: "Black Flash Music",    category: "Todo", robloxId: "83892455359949" },
  { id: "to6", title: "Black Flash Voice",    category: "Todo", robloxId: "92231886696392" },
  { id: "to7", title: "Elbow Drop Ground",    category: "Todo", robloxId: "7093763783" },
  { id: "to8", title: "Awakening SFX",        category: "Todo", robloxId: "126354519236423" },

  // Items
  { id: "it1", title: "Gun Fire",          category: "Items", robloxId: "5735280081" },
  { id: "it2", title: "Gun Hit",           category: "Items", robloxId: "3932141920" },
  { id: "it3", title: "Sniper Fire",       category: "Items", robloxId: "136523485" },
  { id: "it4", title: "Sniper Recharge",   category: "Items", robloxId: "131265718595511" },
  { id: "it5", title: "Jet Black Swing",   category: "Items", robloxId: "4085938599" },
  { id: "it6", title: "Playful Cloud Swing", category: "Items", robloxId: "116901112122156" },
  { id: "it7", title: "Bowling Ball Loop", category: "Items", robloxId: "96331415600436" },
  { id: "it8", title: "TNT Explode",       category: "Items", robloxId: "90854697257230" },
];

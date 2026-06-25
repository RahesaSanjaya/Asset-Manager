export type Sound = {
  id: string;
  title: string;
  category: string;
  robloxId: string;
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
  "Mahoraga",
  "Mahito",
  "Choso",
  "Todo",
  "Higurama",
  "Yuta",
  "Items",
] as const;

export type SoundCategory = typeof SOUND_CATEGORIES[number];

// All IDs sourced from ossaamm.github.io
export const SOUNDS: Sound[] = [
  // ── Music ───────────────────────────────────────────────────────────────
  { id: "m1",  title: "Domain Clash Theme",           category: "Music", robloxId: "89526560746434" },
  { id: "m2",  title: "Infinite Void (Gojo Domain)",  category: "Music", robloxId: "16071901783" },
  { id: "m3",  title: "Malevolent Shrine (Sukuna)",   category: "Music", robloxId: "15583493700" },
  { id: "m4",  title: "Idle Death Gamble (Hakari)",   category: "Music", robloxId: "9039704032" },
  { id: "m5",  title: "Jackpot! (Hakari)",            category: "Music", robloxId: "1841443579" },
  { id: "m6",  title: "Red Max — Remember",           category: "Music", robloxId: "17284219852" },
  { id: "m7",  title: "Jihei Endonka (Mahito)",       category: "Music", robloxId: "17856253579" },
  { id: "m8",  title: "Hollow Purple Theme",          category: "Music", robloxId: "14326861262" },
  { id: "m9",  title: "Red Max — Black Flash",        category: "Music", robloxId: "17520297840" },
  { id: "m10", title: "Hollow Nuke Music",            category: "Music", robloxId: "14457960806" },

  // ── Impacts & Ragdolls ───────────────────────────────────────────────────
  { id: "i1",  title: "Impact 1",          category: "Impacts & Ragdolls", robloxId: "91186117342" },
  { id: "i2",  title: "Impact 2",          category: "Impacts & Ragdolls", robloxId: "9118615862" },
  { id: "i3",  title: "Impact 3",          category: "Impacts & Ragdolls", robloxId: "9118614058" },
  { id: "i4",  title: "Impact 4",          category: "Impacts & Ragdolls", robloxId: "9116816096" },
  { id: "i5",  title: "Ragdoll Fall 1",    category: "Impacts & Ragdolls", robloxId: "3784888301" },
  { id: "i6",  title: "Ragdoll Fall 2",    category: "Impacts & Ragdolls", robloxId: "3784888809" },
  { id: "i7",  title: "Ragdoll Fall 3",    category: "Impacts & Ragdolls", robloxId: "3784889529" },
  { id: "i8",  title: "Break (Downslam)", category: "Impacts & Ragdolls", robloxId: "3778609188" },
  { id: "i9",  title: "Ground Impact",     category: "Impacts & Ragdolls", robloxId: "7093763783" },
  { id: "i10", title: "Rush Hit",          category: "Impacts & Ragdolls", robloxId: "3763467977" },

  // ── M1s & Dashes ─────────────────────────────────────────────────────────
  { id: "d1",  title: "M1 Swing",              category: "M1s & Dashes", robloxId: "4571259077" },
  { id: "d2",  title: "M1 Hit 1",              category: "M1s & Dashes", robloxId: "8595975878" },
  { id: "d3",  title: "M1 Hit 2",              category: "M1s & Dashes", robloxId: "8595975458" },
  { id: "d4",  title: "M1 Hit 3",              category: "M1s & Dashes", robloxId: "8595974357" },
  { id: "d5",  title: "Block 1",               category: "M1s & Dashes", robloxId: "4306994267" },
  { id: "d6",  title: "Block 2",               category: "M1s & Dashes", robloxId: "4306994664" },
  { id: "d7",  title: "Block 3",               category: "M1s & Dashes", robloxId: "4306994923" },
  { id: "d8",  title: "Front Dash",            category: "M1s & Dashes", robloxId: "4909206080" },
  { id: "d9",  title: "Side Dash",             category: "M1s & Dashes", robloxId: "3929467229" },
  { id: "d10", title: "Strike (Blade Windup)", category: "M1s & Dashes", robloxId: "17866719328" },

  // ── Gojo ─────────────────────────────────────────────────────────────────
  { id: "g1",  title: "Lapse Blue Pull",         category: "Gojo", robloxId: "411286671" },
  { id: "g2",  title: "Lapse Blue Grab",         category: "Gojo", robloxId: "9105467029" },
  { id: "g3",  title: "Infinity",                category: "Gojo", robloxId: "9066732918" },
  { id: "g4",  title: "Red Wind",                category: "Gojo", robloxId: "6006851551" },
  { id: "g5",  title: "Red Throw",               category: "Gojo", robloxId: "154787303" },
  { id: "g6",  title: "Red Explode",             category: "Gojo", robloxId: "3059775624" },
  { id: "g7",  title: "Hollow Purple Merge",     category: "Gojo", robloxId: "17018019870" },
  { id: "g8",  title: "Hollow Purple Hit",       category: "Gojo", robloxId: "698224146" },
  { id: "g9",  title: "Domain Voice",            category: "Gojo", robloxId: "6667923288" },
  { id: "g10", title: "Domain Shatter",          category: "Gojo", robloxId: "6737581507" },

  // ── Sukuna ───────────────────────────────────────────────────────────────
  { id: "s1",  title: "Dismantle Slash",        category: "Sukuna", robloxId: "935843979" },
  { id: "s2",  title: "Finish Slash",           category: "Sukuna", robloxId: "9119749145" },
  { id: "s3",  title: "World Slash 1",          category: "Sukuna", robloxId: "17053666464" },
  { id: "s4",  title: "World Slash 2",          category: "Sukuna", robloxId: "17053670289" },
  { id: "s5",  title: "World Slash 3",          category: "Sukuna", robloxId: "17053667034" },
  { id: "s6",  title: "Shrine Voice",           category: "Sukuna", robloxId: "7817341182" },
  { id: "s7",  title: "Shrine Domain Ring",     category: "Sukuna", robloxId: "7817336081" },
  { id: "s8",  title: "Shrine Water Splash",    category: "Sukuna", robloxId: "9120548819" },
  { id: "s9",  title: "Open — Arrow",           category: "Sukuna", robloxId: "7278163473" },
  { id: "s10", title: "Open — Explode",         category: "Sukuna", robloxId: "331888892" },

  // ── Yuji ─────────────────────────────────────────────────────────────────
  { id: "y1",  title: "Cursed Strikes Hit",     category: "Yuji", robloxId: "16773286330" },
  { id: "y2",  title: "Aerial Spin",            category: "Yuji", robloxId: "8120249833" },
  { id: "y3",  title: "Crushing Blow Crack",    category: "Yuji", robloxId: "4403634269" },
  { id: "y4",  title: "Divergent Fist Swing",   category: "Yuji", robloxId: "4059009185" },
  { id: "y5",  title: "Divergent Fist Hit",     category: "Yuji", robloxId: "7515452875" },
  { id: "y6",  title: "Black Flash Sparks",     category: "Yuji", robloxId: "12764933067" },
  { id: "y7",  title: "Black Flash",            category: "Yuji", robloxId: "9114314398" },
  { id: "y8",  title: "Manji Kick Startup",     category: "Yuji", robloxId: "9125615451" },
  { id: "y9",  title: "Manji Kick Slam",        category: "Yuji", robloxId: "9126228977" },
  { id: "y10", title: "Voice (Kôkusen)",        category: "Yuji", robloxId: "12761286504" },

  // ── Hakari ───────────────────────────────────────────────────────────────
  { id: "h1",  title: "Jackpot!",               category: "Hakari", robloxId: "6644505962" },
  { id: "h2",  title: "Jackpot Music",          category: "Hakari", robloxId: "1841443579" },
  { id: "h3",  title: "Domain Travel",          category: "Hakari", robloxId: "16943255415" },
  { id: "h4",  title: "Domain Roll",            category: "Hakari", robloxId: "3299794881" },
  { id: "h5",  title: "Shutter Doors Spawn",    category: "Hakari", robloxId: "9125644321" },
  { id: "h6",  title: "Shutter Doors Slam",     category: "Hakari", robloxId: "9116684884" },
  { id: "h7",  title: "Shutter Doors Hit",      category: "Hakari", robloxId: "9118614717" },
  { id: "h8",  title: "Fever Breaker Swing",    category: "Hakari", robloxId: "17101065238" },
  { id: "h9",  title: "Fever Breaker Hit",      category: "Hakari", robloxId: "17101065020" },
  { id: "h10", title: "Rough Energy Charge",    category: "Hakari", robloxId: "17046377464" },

  // ── Megumi ───────────────────────────────────────────────────────────────
  { id: "me1",  title: "Rabbit Escape Spawn",   category: "Megumi", robloxId: "17206057016" },
  { id: "me2",  title: "Rabbit Escape Despawn", category: "Megumi", robloxId: "17206056478" },
  { id: "me3",  title: "Nue Spawn",             category: "Megumi", robloxId: "17269358415" },
  { id: "me4",  title: "Nue Hit",               category: "Megumi", robloxId: "17269354824" },
  { id: "me5",  title: "Toad Spawn",            category: "Megumi", robloxId: "17269355559" },
  { id: "me6",  title: "Toad Fly",              category: "Megumi", robloxId: "17269355114" },
  { id: "me7",  title: "Max Elephant Start",    category: "Megumi", robloxId: "17206057404" },
  { id: "me8",  title: "Max Elephant Hit",      category: "Megumi", robloxId: "4086190876" },
  { id: "me9",  title: "Great Serpent Spawn",   category: "Megumi", robloxId: "17513691442" },
  { id: "me10", title: "Shadow Enter",          category: "Megumi", robloxId: "4459057272" },

  // ── Mahoraga ─────────────────────────────────────────────────────────────
  { id: "mh1",  title: "Divine Pummel Swing",   category: "Mahoraga", robloxId: "3755637186" },
  { id: "mh2",  title: "Divine Pummel Grab",    category: "Mahoraga", robloxId: "9105467029" },
  { id: "mh3",  title: "Divine Pummel Hit",     category: "Mahoraga", robloxId: "8595975458" },
  { id: "mh4",  title: "Ground Pitch Wind",     category: "Mahoraga", robloxId: "3848835272" },
  { id: "mh5",  title: "Ground Pitch Throw",    category: "Mahoraga", robloxId: "3932587669" },
  { id: "mh6",  title: "Ground Pitch Break",    category: "Mahoraga", robloxId: "3778609188" },
  { id: "mh7",  title: "Earthquake Startup",    category: "Mahoraga", robloxId: "18205736907" },
  { id: "mh8",  title: "Takedown Startup",      category: "Mahoraga", robloxId: "18440677683" },
  { id: "mh9",  title: "Adaptation Wheel",      category: "Mahoraga", robloxId: "17612867532" },
  { id: "mh10", title: "World Slash Swing",     category: "Mahoraga", robloxId: "4299510555" },

  // ── Mahito ───────────────────────────────────────────────────────────────
  { id: "ma1",  title: "Stockpile Hit 1",           category: "Mahito", robloxId: "9118609396" },
  { id: "ma2",  title: "Stockpile Hit 2",           category: "Mahito", robloxId: "9118614717" },
  { id: "ma3",  title: "Soul Fire Morph",           category: "Mahito", robloxId: "3929463305" },
  { id: "ma4",  title: "Soul Fire",                 category: "Mahito", robloxId: "3742310026" },
  { id: "ma5",  title: "Focus — Black Flash",       category: "Mahito", robloxId: "17520297840" },
  { id: "ma6",  title: "Blade Chains",              category: "Mahito", robloxId: "9113756883" },
  { id: "ma7",  title: "Blade Swing",               category: "Mahito", robloxId: "3751519865" },
  { id: "ma8",  title: "Body Repel Clap",           category: "Mahito", robloxId: "18259558246" },
  { id: "ma9",  title: "Body Repel Fire",           category: "Mahito", robloxId: "18259558562" },
  { id: "ma10", title: "Domain Voice",              category: "Mahito", robloxId: "17866271934" },

  // ── Choso ────────────────────────────────────────────────────────────────
  { id: "ch1",  title: "Piercing Blood Startup",    category: "Choso", robloxId: "9125615451" },
  { id: "ch2",  title: "Piercing Blood Clap",       category: "Choso", robloxId: "18259558246" },
  { id: "ch3",  title: "Piercing Blood Fire",       category: "Choso", robloxId: "124532419231032" },
  { id: "ch4",  title: "Flowing Red Scale Hit",     category: "Choso", robloxId: "16773286330" },
  { id: "ch5",  title: "Supernova Counter",         category: "Choso", robloxId: "9113764330" },
  { id: "ch6",  title: "Supernova Blood Burst",     category: "Choso", robloxId: "3739364168" },
  { id: "ch7",  title: "Blood Edge Knife Summon",   category: "Choso", robloxId: "4086172099" },
  { id: "ch8",  title: "Blood Edge Stab Hit",       category: "Choso", robloxId: "3932142219" },
  { id: "ch9",  title: "Blood Merge",               category: "Choso", robloxId: "9120086654" },
  { id: "ch10", title: "Blood Rain Slash",          category: "Choso", robloxId: "935843979" },

  // ── Todo ─────────────────────────────────────────────────────────────────
  { id: "td1",  title: "Clap (Boogie Woogie)",      category: "Todo", robloxId: "17156034319" },
  { id: "td2",  title: "Swift Kick Dash",            category: "Todo", robloxId: "17101065425" },
  { id: "td3",  title: "Swift Kick Startup",         category: "Todo", robloxId: "9125615451" },
  { id: "td4",  title: "Brute Force Start",          category: "Todo", robloxId: "17725418857" },
  { id: "td5",  title: "Brute Force Swing",          category: "Todo", robloxId: "7978512114" },
  { id: "td6",  title: "Black Flash Sparks",         category: "Todo", robloxId: "12764933067" },
  { id: "td7",  title: "Black Flash Music",          category: "Todo", robloxId: "83892455359949" },
  { id: "td8",  title: "Black Flash Voice",          category: "Todo", robloxId: "92231886696392" },
  { id: "td9",  title: "Idol's Debut Swag",          category: "Todo", robloxId: "9119122635" },
  { id: "td10", title: "Awakening SFX",              category: "Todo", robloxId: "126354519236423" },

  // ── Higurama ─────────────────────────────────────────────────────────────
  { id: "hi1",  title: "Extended Swing",             category: "Higurama", robloxId: "4571259077" },
  { id: "hi2",  title: "Justice Heavy Swing",        category: "Higurama", robloxId: "140527314975641" },
  { id: "hi3",  title: "Justice Explode",            category: "Higurama", robloxId: "4459572763" },
  { id: "hi4",  title: "Judgement Reach Start",      category: "Higurama", robloxId: "87590911386077" },
  { id: "hi5",  title: "Judgement Reach Swing",      category: "Higurama", robloxId: "102880207942198" },
  { id: "hi6",  title: "Twirling Strikes Start",     category: "Higurama", robloxId: "91477583246788" },
  { id: "hi7",  title: "Twirling Strikes Hit",       category: "Higurama", robloxId: "138752442741376" },
  { id: "hi8",  title: "No Escape Recall",           category: "Higurama", robloxId: "117657083645864" },
  { id: "hi9",  title: "Execution Sever",            category: "Higurama", robloxId: "134273082284707" },
  { id: "hi10", title: "Awakening Domain Bang",      category: "Higurama", robloxId: "6404320398" },

  // ── Yuta ─────────────────────────────────────────────────────────────────
  { id: "yt1",  title: "Resolute Slash",             category: "Yuta", robloxId: "14427790767" },
  { id: "yt2",  title: "Sword Grab",                 category: "Yuta", robloxId: "122209095269858" },
  { id: "yt3",  title: "Severing Path Leap",         category: "Yuta", robloxId: "128763907862260" },
  { id: "yt4",  title: "Black Flash Windup (Music)", category: "Yuta", robloxId: "126598851794168" },
  { id: "yt5",  title: "Black Flash Windup 2",       category: "Yuta", robloxId: "85972589629135" },
  { id: "yt6",  title: "Black Flash Land",           category: "Yuta", robloxId: "132472285449398" },
  { id: "yt7",  title: "Black Flash Hit",            category: "Yuta", robloxId: "12764933067" },
  { id: "yt8",  title: "Veilstep",                   category: "Yuta", robloxId: "121354995604661" },
  { id: "yt9",  title: "Veilstep Hit",               category: "Yuta", robloxId: "90439756216771" },
  { id: "yt10", title: "Electric Shock",             category: "Yuta", robloxId: "120458587618994" },

  // ── Items ─────────────────────────────────────────────────────────────────
  { id: "it1",  title: "Gun Fire",                   category: "Items", robloxId: "5735280081" },
  { id: "it2",  title: "Gun Hit",                    category: "Items", robloxId: "3932141920" },
  { id: "it3",  title: "Gun Break",                  category: "Items", robloxId: "1358442317" },
  { id: "it4",  title: "Sniper Fire",                category: "Items", robloxId: "136523485" },
  { id: "it5",  title: "Sniper Recharge",            category: "Items", robloxId: "131265718595511" },
  { id: "it6",  title: "Jet Black Swing",            category: "Items", robloxId: "4085938599" },
  { id: "it7",  title: "Jet Black Hit",              category: "Items", robloxId: "3932145123" },
  { id: "it8",  title: "Playful Cloud Swing",        category: "Items", robloxId: "116901112122156" },
  { id: "it9",  title: "Bowling Ball Hit",           category: "Items", robloxId: "79710336574311" },
  { id: "it10", title: "TNT Explode",                category: "Items", robloxId: "90854697257230" },
];

/* =========================================================
   FIRST PC GAMING — SITE DATA
   This is the only file you need to edit to add videos,
   update the championship or change links.
   ========================================================= */

const SITE = {
  name: "First PC Gaming",
  email: "robertbrace2@gmail.com",
  socials: {
    youtube: "https://www.youtube.com/channel/UCBcSsnzO36SSn1gM9AgXeDw",
    facebook: "https://www.facebook.com/FirstPCGaming/",
    twitter: "https://twitter.com/FPC_Gaming"
  }
};

/* ---------------------------------------------------------
   VIDEO CHANNELS
   New uploads are pulled from YouTube automatically every hour
   for any channel with a channelUrl — you don't need to add them.
   The lists below are a backup, and where you can add a
   video length or keep older videos showing.
   To add a video by hand: copy a line like
     { id: "z3Ha5D9jECE", title: "Golf", length: "3:05:31" },
   The id is the bit after "watch?v=" in the YouTube link.
   Newest videos go at the TOP of each list.
   --------------------------------------------------------- */
const CHANNELS = [
  {
    key: "fpc",
    name: "First PC Gaming",
    owner: "Rob",
    blurb: "Sim racing, golf sims and whatever else is on the rig this week.",
    channelUrl: "https://www.youtube.com/channel/UCBcSsnzO36SSn1gM9AgXeDw",
    videos: [
      { id: "z3Ha5D9jECE", title: "Golf", length: "3:05:31" },
      { id: "3tHzvdSzYmM", title: "Golf", length: "1:54:47" },
      { id: "qBiRcIbv5-w", title: "Golfoo", length: "1:15:19" }
    ]
  },
  {
    key: "andy",
    name: "Andy's Channel",
    owner: "Andrew Lees",
    blurb: "Golf with the lads, Cricket 19 and the odd Ashes series.",
    /* Paste Andy's channel link here (any YouTube channel link works, e.g.
       https://www.youtube.com/@hisname). Leave "" to hide the button. */
    channelUrl: "https://www.youtube.com/@ajl182",
    videos: [
      { id: "kc-ZJEqHFDo", title: "Golf for Nigel", length: "50:52" },
      { id: "mmVE4aDYfPA", title: "Nigel go again!", length: "" },
      { id: "VBgK-b1R2XY", title: "Lets try the Ashes, Cricket 19", length: "29:29" },
      { id: "ioMGra_3hws", title: "Bit of Cricket", length: "28:57" },
      { id: "DfFQlF2nAMU", title: "Golf for Spencer", length: "8:10" },
      { id: "O5amlRxe0T8", title: "Thursday Golf with the boys", length: "2:36" },
      { id: "f90X4cc6vFM", title: "Bit of Golf", length: "1:24:32" },
      { id: "IOnBbvGSn3o", title: "Cricket 19 for Windows 10", length: "1:16:21" }
    ]
  }
];

/* ---------------------------------------------------------
   CHAMPIONSHIP
   Add drivers to "standings" as the season runs, e.g.
     { driver: "Rob", team: "Red Bull", points: 43, wins: 1 },
   The table sorts itself by points.
   Rounds: status can be "done", "next" or "" (upcoming).
   --------------------------------------------------------- */
const CHAMPIONSHIP = {
  title: "FPC F1 League",
  season: "Next season — dates to be announced",
  points: [25, 18, 15, 12, 10, 8, 6, 4, 2, 1],
  rounds: [
    // { round: 1, track: "Bahrain", date: "2027-01-10", status: "next" },
  ],
  standings: [
    // { driver: "Rob", team: "Red Bull", points: 0, wins: 0 },
  ],
  /* Example rules — change these to your league's actual rules */
  rules: [
    "Clean racing first — avoidable contact earns a warning, repeat offences cost points.",
    "Three warnings in a season equals a one-point deduction.",
    "Track limits: three strikes per race, then a 5-second penalty.",
    "Disconnects aren't penalised, but re-joining mid-race isn't allowed.",
    "Stewards' decisions are final — have a laugh, it's a game."
  ]
};

/* ---------------------------------------------------------
   PARTNERS (shown on the home page)
   Replace the url with your own affiliate/referral link.
   --------------------------------------------------------- */
const PARTNERS = [
  {
    name: "GTXGaming",
    text: "UK game server hosting — what we use for our own servers.",
    url: "https://www.gtxgaming.co.uk/"
  },
  {
    name: "Kryptex",
    text: "Put your graphics card to work while you're not gaming and earn a bit back.",
    url: "https://www.kryptex.org/"
  }
];

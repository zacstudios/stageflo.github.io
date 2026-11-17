// Step-by-step guides. Each step's picture is taken from the real app by
// `npm run docs:guides` in the StageFlo repo, which also writes images.json (their sizes).
// Text marked **like this** is shown in bold.

export type GuideStep = {
  title: string;
  text: string;
  /** Picture name in public/guides/<slug>/, without .png. */
  image: string;
  alt: string;
  tip?: string;
};

export type Guide = {
  slug: string;
  group: GuideGroup;
  title: string;
  /** One line for the list of guides. */
  summary: string;
  /** Where in StageFlo this happens, shown above the title. */
  where: string;
  lede: string;
  before?: { title: string; items: string[] };
  steps: GuideStep[];
  footer?: string;
  /** The step picture shown on the guide's card in the list. */
  cover: string;
};

export const GUIDE_GROUPS = [
  "Screens and looks",
  "Plans and services",
  "The team on their phones",
  "Livestream",
  "Your library",
] as const;
export type GuideGroup = (typeof GUIDE_GROUPS)[number];

export const guides: Guide[] = [
  // ── Screens and looks ──
  {
    slug: "set-up-screens",
    cover: "3-add-screen-sheet",
    group: "Screens and looks",
    title: "Set up your screens",
    summary: "Put the Audience and Stage outputs on the right screens, once for your room.",
    where: "StageFlo · Settings → Outputs",
    lede: "Tell StageFlo which screen is the projector and which is the stage monitor. You do this once; StageFlo remembers it, and finds the screens again when they're plugged back in.",
    before: {
      title: "Before you start",
      items: [
        "Connect the projector and monitors, and set them up in your computer's display settings as **separate displays**, not mirrored.",
        "Open **Settings → Outputs**.",
      ],
    },
    steps: [
      {
        title: "Find out which screen is which",
        text: "Click **Identify screens**, beside **Your setup**. Every screen shows its number in large type. Click it again to hide the numbers.",
        image: "1-identify",
        alt: "The Your setup cards with the Identify screens button circled",
      },
      {
        title: "Open the output and click Add Screen…",
        text: "Click the **Stage** card (or Audience, Lower Third, Center Stage), then **Add Screen…** in its Screens list.",
        image: "2-add-screen",
        alt: "The Stage output page with the Add Screen button circled",
      },
      {
        title: "Choose what it shows and which screen",
        text: "Under **Shows**, pick the output; under **Screen**, pick the screen by the number you saw. Then click **Add Screen**.",
        image: "3-add-screen-sheet",
        alt: "The Add Screen window with Stage and the screen list circled",
        tip: "Adding a second Audience screen also asks whether both show the **Same picture** or **One wide picture** across them.",
      },
      {
        title: "Press Apply",
        text: "Changes on the Outputs page wait until you press **Apply**: the top of the page says **Changes not applied** until then, so nothing jumps between screens while you set up.",
        image: "4-apply",
        alt: "Changes not applied, with the Apply button circled",
      },
      {
        title: "Check Your setup",
        text: "Each card now shows its screen and its look. A yellow note appears if two outputs share a screen, as one would cover the other.",
        image: "5-your-setup",
        alt: "Your setup with the Stage card showing its new screen",
      },
    ],
    footer: "With two or more screens on one output, How the screens are used offers Only the selected screen (press Show here on the one to use), Same picture, One wide picture or Edge blend.",
  },
  {
    slug: "livestream-look",
    cover: "2-templates",
    group: "Screens and looks",
    title: "Give the livestream its own look",
    summary: "Show only the main language, low on a transparent background, on the stream.",
    where: "StageFlo · Settings → Looks and Outputs",
    lede: "The hall can keep both languages in the middle of the screen while the livestream shows one line low down, over the camera. A look changes how one output shows the slides; the slides themselves stay the same everywhere.",
    steps: [
      {
        title: "Click + New look",
        text: "In **Settings → Looks**, click **+ New look**, next to **Standard**.",
        image: "1-new-look",
        alt: "The Looks page with the + New look button circled",
      },
      {
        title: "Pick the Livestream template",
        text: "Each template shows the slide on the screens in that look. **Livestream** puts the main language low on the screen over a transparent background, for keying over a camera.",
        image: "2-templates",
        alt: "The New look templates with Livestream circled",
      },
      {
        title: "Change it as you like",
        text: "The new look opens. Every setting reads **Same as Standard** until you change it, such as a bigger size or a different font.",
        image: "3-the-look",
        alt: "The Livestream look open in Settings → Looks",
      },
      {
        title: "Open the Audience output's NDI settings",
        text: "In **Settings → Outputs**, click **Audience**, then **NDI settings** in the NDI Output row.",
        image: "4-ndi-settings",
        alt: "The Audience page with NDI settings circled",
      },
      {
        title: "Choose Livestream under Look on NDI",
        text: "The NDI stream now uses the Livestream look while the hall keeps Standard. Turn on NDI Output to start streaming.",
        image: "5-look-on-ndi",
        alt: "Look on NDI set to Livestream",
        tip: "To use a look on a screen instead, choose it in the output's **Look** section.",
      },
    ],
  },
  {
    slug: "stage-layout",
    cover: "3-chords",
    group: "Screens and looks",
    title: "Give the band its own stage screen",
    summary: "A stage layout with chords for the band, and another for the pulpit.",
    where: "StageFlo · Settings → Looks → Stage layouts",
    lede: "Each stage screen can have its own layout: chords and the key for the band, the next slide for the preacher. Make the layout once, then choose it for a screen.",
    steps: [
      {
        title: "Click + New under Stage layouts",
        text: "In **Settings → Looks**, click **+ New** next to **Stage layouts**. It starts as a copy of the Stage layout.",
        image: "1-new-layout",
        alt: "The Looks tabs with + New under Stage layouts circled",
      },
      {
        title: "Name it",
        text: "Type a name such as **Band monitor** and press Enter. Choose a **Template** below: Classic, Focus or Compact.",
        image: "2-name",
        alt: "The new stage layout named Band monitor",
      },
      {
        title: "Turn on what the band needs",
        text: "Switch on **Show Chords**, and check **Show Song Key & Tempo** and **Show BPM Pulse**. Turn off what they don't need.",
        image: "3-chords",
        alt: "The stage layout settings with Show Chords circled",
      },
      {
        title: "Use it on the stage screen",
        text: "In **Settings → Outputs → Stage**, choose **Band monitor** under **Layout**, then press **Apply**.",
        image: "4-choose",
        alt: "The Stage output's Layout set to Band monitor",
        tip: "With two stage screens on **Same picture**, select a screen first to give it its own layout.",
      },
    ],
  },
  {
    slug: "standby",
    cover: "3-check-cleared",
    group: "Screens and looks",
    title: "Choose what shows when the screen is cleared",
    summary: "A colour, pictures that take turns, or a moving visualizer between items.",
    where: "StageFlo · Settings → Outputs → Audience",
    lede: "When you clear the screen between songs, the Audience screens show the standby background. Pick something calm that fits your service.",
    steps: [
      {
        title: "Choose a Standby Background",
        text: "On the **Audience** output's page, under **When cleared**, pick **None**, **Color**, **Pictures & Videos** or **Visualizer**.",
        image: "1-standby-background",
        alt: "Standby Background with Visualizer circled",
      },
      {
        title: "Pick its look",
        text: "For a visualizer, choose a style and its colours. For pictures and videos, tick the ones to use: several take turns.",
        image: "2-visualizer",
        alt: "The visualizer styles and colours",
      },
      {
        title: "Check it with Cleared",
        text: "Click **Cleared** above the preview to see exactly what the screens show when cleared.",
        image: "3-check-cleared",
        alt: "The output preview set to Cleared, showing the standby visualizer",
        tip: "A look with a colour or transparent background, such as Livestream, can keep its own background instead.",
      },
    ],
  },

  // ── Plans and services ──
  {
    slug: "sections",
    cover: "2-section-menu",
    group: "Plans and services",
    title: "Organise a plan into sections",
    summary: "Worship, Message, Offering: give each part of the service a time and a note.",
    where: "StageFlo · Plan tab",
    lede: "Sections turn a plan into the order of service. Each one can have a planned time, a colour and a note for the team, and every screen shows which section the service is in.",
    steps: [
      {
        title: "Add a section",
        text: "Open the **+ Section** list in the plan toolbar and pick a name, such as **Message**, or **Other name…** for your own.",
        image: "1-add-section",
        alt: "The plan toolbar with + Section circled",
      },
      {
        title: "Right-click it for its settings",
        text: "Right-click the section for a colour, **Rename…**, **Duplicate**, **Add note…**, **Count down the planned time** and **Planned time…**.",
        image: "2-section-menu",
        alt: "The section menu with Planned time circled",
      },
      {
        title: "Give it a planned time",
        text: "Type the minutes, such as **35**, and click **Set Time**. While the service is in it, its clock shows on the stage screen, the stage link and the phone remote.",
        image: "3-planned-time",
        alt: "The Planned time window with Set Time circled",
        tip: "Use **Add note…** for a line the team sees under the section's name, such as *Pastor John, 35 minutes*.",
      },
      {
        title: "Click the section, then Add to Plan",
        text: "With the section selected, open a song, verse or slide and click **Add to Plan**: it goes at the end of that section. You can also drag it from the library onto the section.",
        image: "4-add-to-plan",
        alt: "The Message section and Add to Plan both circled",
      },
      {
        title: "It lands in the section",
        text: "The song sits under **Message**. Drag items to move them; Cmd-click (Ctrl-click on Windows) or Shift-click to move several at once.",
        image: "5-result",
        alt: "The Message section with its time, note and new song",
      },
    ],
  },
  {
    slug: "sunday-template",
    cover: "5-start-with",
    group: "Plans and services",
    title: "Save your Sunday service as a template",
    summary: "Start each week with the sections, timers and weekly slides already in place.",
    where: "StageFlo · Plan tab",
    lede: "Set up one plan the way every Sunday starts, save it once, then start each new week from it with the sections, timers and weekly slides already in place.",
    before: {
      title: "Before you start, open the plan you want to copy",
      items: [
        "**Sections** in order (Welcome, Worship, Announcements, Message, Offering…)",
        "**Timers**: right-click a section → **Planned time…**, and **Count down the planned time** for ones like Message",
        "**Weekly items** in their sections: countdown slide, welcome slide, announcements, offering video",
        "**Remove this week's songs and readings**, so they don't come back every week",
      ],
    },
    steps: [
      {
        title: "Click the Templates button",
        text: "It is the **last button** at the right end of the plan toolbar, after **+ Section**, the close-all arrows and the crosshair.",
        image: "1-templates-button",
        alt: "The plan toolbar with the Templates button circled",
      },
      {
        title: "Choose “Save sections and items as a template…”",
        text: "The second choice keeps the items too. The first one only keeps the section names and their timers.",
        image: "2-menu",
        alt: "The Templates menu with Save sections and items as a template circled",
      },
      {
        title: "Give it a name and click Save Template",
        text: "The box lists what will be kept, such as the sections and **3 items**. Type a name like **Our Sunday Service**.",
        image: "3-name",
        alt: "The Save as template window with Save Template circled",
        tip: "Use a name other than “Sunday Service”: that one is built in, so the same name would show twice.",
      },
      {
        title: "Each week, click New Plan (+)",
        text: "The **+** button next to the plan name starts a new plan.",
        image: "4-new-plan",
        alt: "The plan toolbar with the New Plan button circled",
      },
      {
        title: "Pick your template under “Start with” and click Create",
        text: "Type the title and date, then set **Start with** to your template. Below it you'll see its sections and how many items come with it.",
        image: "5-start-with",
        alt: "The New Service Plan window with Start with and Create circled",
      },
      {
        title: "The new plan opens ready to fill",
        text: "Sections, planned times, count-downs and weekly items are all in place. Add this week's songs into Worship and the readings, and you're set.",
        image: "6-result",
        alt: "The new plan with its sections and weekly items",
      },
    ],
    footer: "To change the template later, edit a plan and save it again with the same name; it replaces the old one. Rename or delete templates from the same Templates button.",
  },
  {
    slug: "run-service",
    cover: "5-section-timer",
    group: "Plans and services",
    title: "Run the service from the plan",
    summary: "Go live, move through the plan with →, and keep each section on time.",
    where: "StageFlo · Plan tab and preview",
    lede: "Once the plan is ready, you can run the whole service with the arrow keys or a presenter clicker, and see where you are against the clock.",
    steps: [
      {
        title: "Double-click the first item",
        text: "Double-click an item to open it and put it on the screens in one step. A single click only opens it in the preview.",
        image: "1-double-click",
        alt: "The first song in the plan circled",
      },
      {
        title: "It's live",
        text: "The item turns green in the plan and the preview shows what's on the screens. Press **→** or **Space** for the next slide.",
        image: "2-live",
        alt: "StageFlo with the first song live",
      },
      {
        title: "→ again moves on to the next item",
        text: "On an item's last slide, → shows **End · → again for …** above the slides. Press → again to open the next item, into the next section when that's where it is.",
        image: "3-next-item",
        alt: "The End, → again for Amazing Grace message circled",
      },
      {
        title: "Turn on Focus",
        text: "The crosshair keeps only the section the service is in open, and follows the service as it moves on.",
        image: "4-focus",
        alt: "The plan toolbar with the Focus crosshair circled",
      },
      {
        title: "Keep the section on time",
        text: "The **Timers** panel shows the section's time so far against its plan, with pause, restart and **−1 / +1** minute. **Show on** chooses Stage, Audience or both.",
        image: "5-section-timer",
        alt: "The section timer in the Timers panel circled",
      },
      {
        title: "The stage sees it too",
        text: "The stage screen and the stage link show the section, such as **WORSHIP · 1 of 2 · Next: Bible Reading**, with its clock.",
        image: "6-stage-link",
        alt: "The stage link showing the live song and the Worship section",
      },
    ],
  },
  {
    slug: "share-plan",
    cover: "2-import",
    group: "Plans and services",
    title: "Move a plan to another computer",
    summary: "Prepare at home, run it at church: everything the plan uses comes along.",
    where: "StageFlo · Plan tab",
    lede: "A plan file (.sfplan) carries the songs, slides, pictures, videos, overlays and Bible look it uses, so it opens the same on the church computer.",
    steps: [
      {
        title: "Click Export",
        text: "With the plan open, click **Export** in the plan toolbar and save the file, for example to a USB stick or a shared folder.",
        image: "1-export",
        alt: "The plan toolbar with Export circled",
      },
      {
        title: "On the other computer, click Import",
        text: "Click **Import** in the plan toolbar and choose the .sfplan file. If a plan with that name and date is already there, StageFlo asks whether to replace it or keep both.",
        image: "2-import",
        alt: "The plan toolbar with Import circled",
      },
      {
        title: "Read the message",
        text: "The message under the toolbar says what needed care. A song already there with different lyrics is added as a new version, so the screens show what you planned and the old copy is left alone.",
        image: "3-message",
        alt: "Plan imported, with a new version of Amazing Grace added",
        tip: "A verse whose Bible version isn't installed uses one that is, and the message says which.",
      },
    ],
  },

  // ── The team ──
  {
    slug: "team-phones",
    cover: "3-phone-home",
    group: "The team on their phones",
    title: "Connect the team's phones",
    summary: "One QR code for the stage link, the music director and the phone remote.",
    where: "StageFlo · Settings → Remote",
    lede: "Singers can read the words on their phones, the band leader can set keys, and the operator can run slides from a phone. They all start from one address.",
    before: {
      title: "Before you start",
      items: [
        "Phones on the **same Wi-Fi** as the computer use **Local Network**.",
        "For phones anywhere, use **Public Internet** for a link such as mac1.stageflo.app.",
      ],
    },
    steps: [
      {
        title: "Show the team Scan to join",
        text: "In **Settings → Remote**, each person scans the **Scan to join** code with their phone camera. **Direct links** under it copy each page's address.",
        image: "1-scan-to-join",
        alt: "Settings → Remote with Scan to join circled",
      },
      {
        title: "Decide who needs a PIN",
        text: "The **Phone remote PIN** protects the controls. **Stage link PIN** can be the same, **No PIN** for the singers, or its own PIN. The stage link can only read.",
        image: "2-stage-link-pin",
        alt: "The Security settings with Stage link PIN circled",
      },
      {
        title: "Each person picks their page",
        text: "The address opens a page with **Stage link** for singers and band, **Music director** and **Phone remote**. Add it to the phone's home screen to open it like an app.",
        image: "3-phone-home",
        alt: "The phone page with the three links",
      },
      {
        title: "The stage link follows the screens",
        text: "Singers see the live words, with chords if they're on, and the next slide. It follows the screens, not what the operator has open.",
        image: "4-stage-link",
        alt: "The stage link on a phone showing Amazing Grace",
      },
    ],
  },
  {
    slug: "music-director",
    cover: "3-chart",
    group: "The team on their phones",
    title: "Set up the music director's phone",
    summary: "The band leader changes key and BPM, live or ahead of time.",
    where: "StageFlo · Settings → Remote → Music director",
    lede: "The music director page shows the live song as a chart with chords, and lets the band leader set the key and BPM, live or for songs later in the plan. It can't change slides or the plan.",
    steps: [
      {
        title: "Set a Music director PIN",
        text: "In **Settings → Remote**, under **Music director**, type a PIN and click **Save**. Leaving it blank turns the page off.",
        image: "1-pin",
        alt: "The Music director PIN field circled",
      },
      {
        title: "Open the page and enter the PIN",
        text: "The band leader scans **Scan to join**, picks **Music director**, and types the PIN.",
        image: "2-enter-pin",
        alt: "The music director page asking for its PIN",
      },
      {
        title: "Play from the chart",
        text: "The live song shows with its chords. The bar at the bottom changes the key and BPM, and **Tap** sets the tempo. The **Plan** tab sets them for later songs.",
        image: "3-chart",
        alt: "The music director page showing Amazing Grace with chords",
      },
    ],
  },

  // ── Livestream ──
  {
    slug: "lower-third",
    cover: "1-style",
    group: "Livestream",
    title: "Put the words on your livestream with OBS",
    summary: "Add the lower third to OBS once; it follows every service.",
    where: "StageFlo · Settings → Outputs → Lower Third",
    lede: "The lower third puts the lyrics and verses along the bottom of your stream. OBS shows it as a browser source, over your camera.",
    steps: [
      {
        title: "Choose a style",
        text: "On the **Lower Third** output's page, pick the **Style** that's live, such as Glass. **Edit style…** opens it in Looks.",
        image: "1-style",
        alt: "The Lower Third style selection",
      },
      {
        title: "Copy the Static link",
        text: "Under **Browser source URLs**, copy the **Static** link. In OBS, add a **Browser** source and paste it. It follows the style you choose, so you only do this once.",
        image: "2-static-link",
        alt: "The static lower third link circled",
      },
      {
        title: "Set the background for keying",
        text: "In **Settings → Looks → Lower Third styles**, **Background for keying** is **Transparent** for OBS, or a solid colour for a switcher that keys a colour.",
        image: "3-keying",
        alt: "Background for keying circled",
      },
    ],
  },
  {
    slug: "timers",
    cover: "4-stage-message",
    group: "Livestream",
    title: "Keep time, and send a note to the stage",
    summary: "Countdowns for the preacher, and quiet messages only the stage sees.",
    where: "StageFlo · Preview panel",
    lede: "Timers show on the stage screen so the preacher and band can see the time. A stage message is a short note to the stage the congregation never sees.",
    steps: [
      {
        title: "Click + under Timers",
        text: "In the preview panel on the right, click **+** next to **Timers**.",
        image: "1-add-timer",
        alt: "The Timers panel with the add button circled",
      },
      {
        title: "Choose the kind of timer",
        text: "**Countdown** (a set length), **Countdown to Time** (until a time of day, such as 10:30), **Elapsed Time** or **Clock**.",
        image: "2-kind",
        alt: "The timer kinds with Countdown circled",
      },
      {
        title: "Set it and start it",
        text: "Open the timer to set its name and time. **▶** starts it, **−1 / +1** change it by a minute, and **Show on** picks Stage, Audience or both.",
        image: "3-timer",
        alt: "A countdown timer with its controls",
        tip: "A section with a planned time has its own timer while the service is in it. See Run the service from the plan.",
      },
      {
        title: "Send a note to the stage",
        text: "Click the speech bubble at the top of the preview panel, type the note and click **Send To Stage**. **Popup** shows it as a large banner that's hard to miss.",
        image: "4-stage-message",
        alt: "The stage message box with Send To Stage circled",
      },
    ],
  },

  // ── Library ──
  {
    slug: "bible",
    cover: "4-paste-dialog",
    group: "Your library",
    title: "Put Bible passages in the plan",
    summary: "Search a verse, add it to the plan, or paste the sermon's whole list.",
    where: "StageFlo · Bible tab",
    lede: "Find a verse by reference or by its words, then add it to the plan, or paste every reference from the sermon notes at once.",
    before: {
      title: "Before you start",
      items: ["Download or import a Bible in **Settings → Bible**."],
    },
    steps: [
      {
        title: "Search for the passage",
        text: "In the **Bible** tab, type a reference such as **John 3:16**, or a few words of the verse, and press Enter.",
        image: "1-search",
        alt: "The Bible tab with John 3:16 searched",
      },
      {
        title: "Click Add to Plan",
        text: "**Add to Plan**, above the slides, adds the passage to the open plan, at the end of the selected section.",
        image: "2-add-to-plan",
        alt: "Add to Plan above the slides circled",
      },
      {
        title: "Or paste the sermon's references",
        text: "The clipboard button beside the search box takes a whole list at once.",
        image: "3-paste-list",
        alt: "The paste references button circled",
      },
      {
        title: "Paste and add them all",
        text: "Paste references such as **John 3:16; Rom 8:28-30; Ps 23**, or one per line, and click **Add … to plan** (it counts them). They go in the order you pasted them.",
        image: "4-paste-dialog",
        alt: "The Paste references window",
      },
    ],
  },
  {
    slug: "songs",
    cover: "1-add-song",
    group: "Your library",
    title: "Add songs to your library",
    summary: "Type a new song, download a song pack, or import OpenLyrics files.",
    where: "StageFlo · Songs tab and Settings → Songs",
    lede: "Build your song library one song at a time, or bring in many at once.",
    steps: [
      {
        title: "Add one song",
        text: "In the **Songs** tab, click **+** beside the search box to type or paste a song, with its verses, choruses and languages.",
        image: "1-add-song",
        alt: "The Songs tab with the add song button circled",
      },
      {
        title: "Or download a song pack",
        text: "In **Settings → Songs**, choose a **Song Pack** and click **Download & Import Song Pack**.",
        image: "2-song-pack",
        alt: "Download & Import Song Pack circled",
      },
      {
        title: "Or import OpenLyrics files",
        text: "**Import…** under **OpenLyrics file** brings songs from other presentation apps that export OpenLyrics XML.",
        image: "3-openlyrics",
        alt: "The OpenLyrics Import button circled",
        tip: "**On duplicate title** in the same page chooses whether a song you already have is skipped, replaced or merged.",
      },
    ],
  },
];

export function guideBySlug(slug: string): Guide | undefined {
  return guides.find((guide) => guide.slug === slug);
}

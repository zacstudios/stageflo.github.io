import type { VisualGuideProps } from "./visualGuide";

type SectionVisual = Omit<VisualGuideProps, "alt"> & { alt: string };

const desktop = { width: 2880, height: 1760 } as const;
const settings = { width: 1920, height: 1400 } as const;
const stage = { width: 2560, height: 1440 } as const;

/** Visuals for topics that do not already have a dedicated figure later in their section. */
export const sectionVisuals: Record<string, SectionVisual> = {
  "whats-new": {
    src: "/screenshots/docs/workspace.png",
    alt: "StageFlo 2.1.80 workspace showing the plan, slides, library and output preview.",
    caption: "The 2.1.80 workspace brings the plan, content and live output together.",
    ...desktop,
    markers: [
      { x: 17, y: 27, label: "Find songs, Bibles and media in the library" },
      { x: 48, y: 66, label: "Organise the service into plan sections" },
      { x: 82, y: 28, label: "Check the audience preview before going live" },
    ],
  },
  "set-up-screens": {
    src: "/screenshots/docs/settings-screens.png",
    alt: "StageFlo Outputs settings with setup cards and the Audience output controls.",
    caption: "Set up screens from one Outputs page, then apply the changes when ready.",
    ...settings,
    markers: [
      { x: 38, y: 21, label: "Identify connected screens" },
      { x: 63, y: 44, label: "Choose the Audience, Stage or stream output" },
      { x: 80, y: 78, label: "Press Apply after checking the setup" },
    ],
  },
  "plan-workflow": {
    src: "/screenshots/docs/workspace.png",
    alt: "StageFlo service plan divided into Worship, Bible Reading and Response sections.",
    caption: "Build the running order in sections, then move through it during the service.",
    ...desktop,
    markers: [
      { x: 41, y: 69, label: "Add and arrange plan sections" },
      { x: 51, y: 75, label: "Place songs and scripture inside each section" },
      { x: 68, y: 68, label: "Use the plan toolbar for templates and focus mode" },
    ],
  },
  "service-plans": {
    src: "/screenshots/docs/workspace.png",
    alt: "StageFlo operator workspace with a structured Sunday service plan.",
    caption: "The plan is the service running order: sections contain the songs, readings and media.",
    ...desktop,
    markers: [
      { x: 39, y: 64, label: "Select a section before adding content" },
      { x: 46, y: 73, label: "Drag items to change their order" },
    ],
  },
  overlays: {
    src: "/screenshots/operator-workspace.png",
    alt: "StageFlo operator workspace where the Overlay tab is available below the slide preview.",
    caption: "Open Overlay below the slides to place a logo or graphic over the live output.",
    ...desktop,
    markers: [{ x: 58, y: 55, label: "Open the Overlay tab and choose the graphic" }],
  },
  "live-inputs": {
    src: "/screenshots/operator-workspace.png",
    alt: "StageFlo workspace with the Live input tab beside Background and Visualizer.",
    caption: "The Live tab lists cameras and NDI sources that can sit behind lyrics.",
    ...desktop,
    markers: [{ x: 61, y: 55, label: "Open Live, preview a source, then select it" }],
  },
  "slide-transitions": {
    src: "/screenshots/operator-workspace.png",
    alt: "StageFlo workspace showing the slide toolbar and audience preview.",
    caption: "Choose a transition in the workspace toolbar and preview it before the service.",
    ...desktop,
    markers: [
      { x: 66, y: 12, label: "Choose the transition" },
      { x: 83, y: 30, label: "Preview the result" },
    ],
  },
  "ai-semantic-search": {
    src: "/screenshots/docs/songs.png",
    alt: "StageFlo song library and search area.",
    caption: "Use the library search to find songs by title, lyrics, number or meaning.",
    ...desktop,
    markers: [{ x: 16, y: 18, label: "Type a phrase or idea in the search box" }],
  },
  "bitfocus-presenter-remotes": {
    src: "/screenshots/docs/settings-remote.png",
    alt: "StageFlo Remote settings with the local control address.",
    caption: "Companion and presenter controls use the same StageFlo remote service.",
    ...settings,
    markers: [{ x: 61, y: 27, label: "Use the shown local address for Companion" }],
  },
  "remote-stage-view-over-internet": {
    src: "/screenshots/docs/settings-remote.png",
    alt: "StageFlo Remote settings showing local and public-link controls.",
    caption: "Turn on a public link only when people need to connect outside the local network.",
    ...settings,
    markers: [
      { x: 31, y: 23, label: "Choose Local Network or Public Link" },
      { x: 69, y: 59, label: "Share the stage link, protected by its PIN" },
    ],
  },
  timers: {
    src: "/screenshots/docs/stage-view.png",
    alt: "StageFlo stage view showing the clock and service timing information.",
    caption: "Timers and the current plan section stay visible to the people on stage.",
    ...stage,
    markers: [
      { x: 88, y: 11, label: "Watch the clock and active timer" },
      { x: 51, y: 16, label: "Follow the current plan section" },
    ],
  },
  "stage-message": {
    src: "/screenshots/docs/stage-view.png",
    alt: "StageFlo confidence display with space for operator messages.",
    caption: "Stage messages appear only on the confidence display and team devices.",
    ...stage,
    markers: [{ x: 51, y: 88, label: "The operator message appears here" }],
  },
  "settings-lowerthird": {
    src: "/screenshots/projector-stage.png",
    alt: "StageFlo live lyrics output suitable for a screen or livestream source.",
    caption: "Lower Third sends the live words to a browser source or dedicated screen.",
    width: 1600,
    height: 900,
    markers: [{ x: 50, y: 72, label: "Position the lower-third text inside the safe area" }],
  },
  "settings-bible": {
    src: "/screenshots/docs/bible.png",
    alt: "StageFlo Bible browser with installed translations shown together.",
    caption: "Install translations in Settings, then select and combine them in the Bible browser.",
    ...desktop,
    markers: [{ x: 17, y: 27, label: "Choose the translation and version set" }],
  },
  "song-editing": {
    src: "/screenshots/docs/songs.png",
    alt: "StageFlo song workspace with the selected song and slide previews.",
    caption: "Open a song from the library, edit its sections, then check the generated slides.",
    ...desktop,
    markers: [
      { x: 16, y: 32, label: "Choose the song in the library" },
      { x: 48, y: 31, label: "Check how lyrics split across slides" },
    ],
  },
  "slide-editor": {
    src: "/screenshots/slide-editor.png",
    alt: "StageFlo slide editor with canvas, layers and formatting controls.",
    caption: "Use the editor to place text, media, shapes, web content and timers.",
    ...desktop,
    markers: [
      { x: 50, y: 47, label: "Arrange content on the slide canvas" },
      { x: 88, y: 34, label: "Change the selected layer's properties" },
    ],
  },
  chords: {
    src: "/screenshots/docs/stage-view.png",
    alt: "StageFlo stage view displaying song information for the band.",
    caption: "Chord markers stay off the audience output and appear on the stage view for musicians.",
    ...stage,
    markers: [{ x: 50, y: 58, label: "Chords align above the lyrics on stage" }],
  },
  "media-web-links": {
    src: "/screenshots/slide-editor.png",
    alt: "StageFlo slide editor used to add media and embedded web layers.",
    caption: "Add pictures, videos and embeddable web pages as layers in the slide editor.",
    ...desktop,
    markers: [
      { x: 12, y: 14, label: "Choose the layer type to add" },
      { x: 50, y: 47, label: "Resize and position it on the canvas" },
    ],
  },
  "service-safety-tools": {
    src: "/screenshots/operator-workspace.png",
    alt: "StageFlo operator workspace with preview and live-output controls.",
    caption: "Preview first, then use Go Live, Black, Clear and output lock during the service.",
    ...desktop,
    markers: [
      { x: 82, y: 31, label: "Check the preview before going live" },
      { x: 82, y: 60, label: "Use the live safety controls" },
    ],
  },
  outputs: {
    src: "/screenshots/docs/settings-screens.png",
    alt: "StageFlo Outputs settings for Audience, Stage, Lower Third and Center Stage.",
    caption: "Each output can have its own screens, look, cleared state and NDI stream.",
    ...settings,
    markers: [
      { x: 39, y: 34, label: "Choose the output to configure" },
      { x: 65, y: 56, label: "Assign its screen and appearance" },
    ],
  },
  "first-service": {
    src: "/screenshots/docs/workspace.png",
    alt: "A complete StageFlo workspace ready to run a first service.",
    caption: "Before the first service, confirm the library, plan, preview and outputs are ready.",
    ...desktop,
    markers: [
      { x: 16, y: 30, label: "Content is in the library" },
      { x: 48, y: 70, label: "The running order is in the plan" },
      { x: 82, y: 30, label: "The audience preview is correct" },
    ],
  },
  updates: {
    src: "/screenshots/operator-workspace.png",
    alt: "StageFlo operator workspace where update status appears along the bottom.",
    caption: "StageFlo reports update progress in the status bar without interrupting a service.",
    ...desktop,
    markers: [{ x: 50, y: 96, label: "Check update status here" }],
  },
  "installation-troubleshooting": {
    src: "/screenshots/docs/workspace.png",
    alt: "StageFlo running successfully after installation.",
    caption: "When StageFlo opens to this workspace, installation is complete.",
    ...desktop,
  },
  troubleshooting: {
    src: "/screenshots/docs/settings-backup.png",
    alt: "StageFlo Backup settings used to inspect and recover the active library.",
    caption: "Start from the affected Settings page; Backup helps recover library and media issues.",
    ...settings,
    markers: [
      { x: 31, y: 30, label: "Confirm the active library location" },
      { x: 66, y: 69, label: "Use backup and recovery actions when needed" },
    ],
  },
};

import { Images } from "../../../assets/images";

/**
 * A project panel. Adding a new product to the carousel is just a matter of
 * pushing another entry here — track width, pagination and navigation all
 * derive from this array.
 */
export type ProjectImage = { src: string; alt: string };
export type ProjectArtwork = {
  layout: "layers" | "phones";
  main: ProjectImage;
  detail?: ProjectImage;
  mobile?: ProjectImage;
};

export type Project = {
  title: string;
  subtitle: string;
  client: string;
  role: string;
  year: string;
  description: string;
  link?: string;
  img: string;
  artwork?: ProjectArtwork;
  published?: boolean;
  /** Original outcome copy, retained until its measurement context is supplied. */
  outcomeDraft?: string;
  linkLabel?: string;
  featuredRank?: number;
  contribution?: string;
  stack?: string;
  outcome?: string;
};

const PROJECT_CATALOG: Project[] = [
  {
    title: "Serenity UI",
    subtitle: "Design system / React UI",
    client: "Giovany Cruz",
    role: "Product Designer & Frontend Developer",
    year: "2026",
    description:
      "A self-initiated design system created to make minimalist dashboards and management software more affordable to build, with a clean corporate visual language and subtle motion.",
    contribution:
      "Designed the system and developed reusable interface components, connecting consistent UX/UI foundations with a React and Tailwind CSS implementation.",
    stack: "React · Tailwind CSS",
    link: "https://www.figma.com/community/file/1699162497166159650/beta-serenity-ui-design-system",
    linkLabel: "View on Figma Community",
    featuredRank: 0,
    img: Images.serenityCover,
    artwork: {
      layout: "layers",
      main: { src: Images.workArtwork.serenity[0], alt: "Serenity UI workspace in light and dark themes" },
      detail: { src: Images.workArtwork.serenity[1], alt: "Serenity UI component library and interface states" },
    },
  },
  {
    title: "Compra Today",
    subtitle: "E-commerce / Web",
    client: "Híper Logística",
    role: "Web Designer",
    year: "2023",
    description:
      "An online store for Híper Logística, bringing product discovery and purchasing into a single web experience.",
    link: "https://compratoday.com/",
    img: Images.projectImages[0],
    artwork: {
      layout: "layers",
      main: { src: Images.workArtwork.compra[0], alt: "CompraToday desktop marketplace" },
      mobile: { src: Images.workArtwork.compra[1], alt: "CompraToday mobile shopping experience" },
    },
    outcomeDraft: "CompraToday provides Híper Logística customers with an easy-to-use platform, boosting online sales by 32% and expanding their market reach across Cuba.",
  },
  {
    title: "La Papeleta",
    subtitle: "Culture & events / Mobile",
    client: "Avangenio",
    role: "Mobile App Designer",
    year: "2023",
    description:
      "A cultural events app for Avangenio and Cubarte, focused on discovering events and navigating ticket purchases.",
    link: "https://www.apklis.cu/application/cu.avangenio.lapapeleta.app",
    img: Images.projectImages[1],
    artwork: {
      layout: "phones",
      main: { src: Images.workArtwork.papeleta[0], alt: "La Papeleta festival details and booking action" },
      detail: { src: Images.workArtwork.papeleta[1], alt: "La Papeleta reservations screen" },
      mobile: { src: Images.workArtwork.papeleta[2], alt: "La Papeleta sign-in screen" },
    },
    outcomeDraft: "Designed for Avangenio S.R.L. and Cubarte, the Ticket increases event attendance and revenue by 42% by providing a seamless ticket purchasing experience for both locals and tourists.",
    linkLabel: "View app",
  },
  {
    title: "Cuba Adventures",
    subtitle: "Travel / Web",
    client: "Cuba Adventures",
    role: "Product Designer",
    year: "2024",
    description:
      "A travel website for exploring Cuba through its destinations, culture, and experiences.",
    img: Images.projectImages[2],
    artwork: {
      layout: "layers",
      main: { src: Images.workArtwork.cuba[0], alt: "Cuba Adventures desktop travel experience" },
      detail: { src: Images.workArtwork.cuba[1], alt: "Cuba Adventures tour and destination details" },
      mobile: { src: Images.workArtwork.cuba[2], alt: "Cuba Adventures mobile destination screen" },
    },
  },
  {
    title: "SocIA",
    subtitle: "Customer support / SaaS",
    client: "Avangenio",
    role: "Product Designer",
    year: "2024",
    description:
      "A customer-support platform that brings AI services into a coherent product interface.",
    link: "https://socia.avangenio.com/",
    img: Images.projectImages[3],
    artwork: {
      layout: "layers",
      main: { src: Images.workArtwork.socia[0], alt: "SocIA desktop product website" },
      mobile: { src: Images.workArtwork.socia[1], alt: "SocIA mobile chat interface" },
    },
    outcomeDraft: "SocIA offers a seamless AI experience, boosting user engagement by 40% and reducing customer support costs by 25%. Its intuitive design and smart features have increased overall satisfaction and optimized business operations.",
  },
  {
    title: "eTravel-Beyond",
    subtitle: "Travel booking / Web",
    client: "Avangenio",
    role: "Web Designer",
    year: "2025",
    description:
      "Travel booking platform. Project details and an original preview are being prepared.",
    img: "",
    published: false,
  },
  {
    title: "Habana Cultural",
    subtitle: "Culture & events / Web",
    client: "Avangenio",
    role: "Product Designer",
    year: "2025",
    description:
      "A cultural guide to Havana, organizing the city's programming into a clear browsing experience.",
    link: "https://habanacultural.ohc.cu/",
    img: Images.projectImages[4],
    artwork: {
      layout: "layers",
      main: { src: Images.workArtwork.habana[0], alt: "Habana Cultural news and events website" },
      mobile: { src: Images.workArtwork.habana[1], alt: "Habana Cultural mobile article reading experience" },
    },
    outcomeDraft: "Habana Cultural was designed to provide citizens with easy access to the cultural newsletter of Havana. The site's design resulted in a user traffic increase of up to 18% compared to previous years.",
  },
  {
    title: "Avancode Challenge",
    link: "https://avancode.yareytech.com/",
    subtitle: "Technology event / Web",
    client: "Avangenio",
    role: "Product design & UI development",
    year: "2025",
    description:
      "A website bringing annual company events and their participant journeys together in one place.",
    contribution: "Gathered client requirements, designed the complete experience, and implemented the frontend layouts.",
    outcome: "Event registrations more than doubled year over year across the company's events.",
    featuredRank: 1,
    img: Images.projectImages[5],
    artwork: {
      layout: "layers",
      main: { src: Images.workArtwork.avancode[0], alt: "Avancode Challenge desktop event website" },
      detail: { src: Images.workArtwork.avancode[1], alt: "Avancode Challenge website on a laptop and phone" },
      mobile: { src: Images.workArtwork.avancode[2], alt: "Avancode Challenge mobile event website" },
    },
  },
  {
    title: "Noches de gloria",
    subtitle: "Event management / Web",
    client: "Nexolife",
    role: "Requirements analyst & UX/UI designer",
    year: "2025 · 2026",
    description:
      "A platform for managing international events for the Word and Power ministry.",
    contribution: "Gathered and analysed requirements, then translated them into the system's screen designs.",
    featuredRank: 3,
    img: Images.projectImages[6],
    artwork: {
      layout: "layers",
      main: { src: Images.workArtwork.noches[0], alt: "Noches de Gloria event management dashboard" },
      detail: { src: Images.workArtwork.noches[1], alt: "Noches de Gloria event listing and management" },
      mobile: { src: Images.workArtwork.noches[2], alt: "Noches de Gloria mobile event screen" },
    },
  },
  {
    title: "Avangenio's Website",
    subtitle: "Corporate website / Web",
    client: "Avangenio",
    role: "Project lead, UX/UI & frontend",
    year: "2026",
    description:
      "A corporate website redesign that presents Avangenio's services, products, and career opportunities.",
    contribution: "Led requirements, site structure, team tasks, and timelines. Designed the responsive website and contributed to its frontend and motion.",
    stack: "Next.js · Headless WordPress · GSAP",
    outcome: "Client enquiries rose approximately 25–35% in the semester after launch, compared with the previous semester.",
    featuredRank: 2,
    link: "https://avangenio.com/",
    img: Images.projectImages[7],
  },
  {
    title: "Q'Hay",
    subtitle: "Price comparison / Web",
    client: "Avangenio",
    role: "Web Designer",
    year: "2026",
    description:
      "A product-comparison experience that helps people explore prices and make purchasing decisions.",
    link: "https://qhay.avangenio.com/es",
    img: Images.projectImages[8],
    artwork: {
      layout: "phones",
      main: { src: Images.workArtwork.qhay[0], alt: "Q'Hay mobile price comparison in dark mode" },
      detail: { src: Images.workArtwork.qhay[1], alt: "Q'Hay mobile price comparison in light mode" },
      mobile: { src: Images.workArtwork.qhay[2], alt: "Q'Hay product recommendations screen" },
    },
    outcomeDraft: "The complete redesign of the platform increased product visibility and usability by 28%, reducing customer effort to access different products in the market.",
  },
];

// Incomplete records stay in the catalog without appearing in the portfolio.
export const PROJECTS = PROJECT_CATALOG
  .filter((project) => project.published !== false && project.img)
  .sort((a, b) => (a.featuredRank ?? 99) - (b.featuredRank ?? 99));

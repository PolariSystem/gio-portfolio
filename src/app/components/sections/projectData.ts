import { Images } from "../../../assets/images";

/**
 * A project panel. Adding a new product to the carousel is just a matter of
 * pushing another entry here — track width, pagination and navigation all
 * derive from this array.
 */
export type Project = {
  title: string;
  subtitle: string;
  client: string;
  role: string;
  year: string;
  description: string;
  link?: string;
  img: string;
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
    title: "Compra Today",
    subtitle: "E-commerce / Web",
    client: "Híper Logística",
    role: "Web Designer",
    year: "2023",
    description:
      "An online store for Híper Logística, bringing product discovery and purchasing into a single web experience.",
    link: "https://compratoday.com/",
    img: Images.projectImages[0],
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
    outcomeDraft: "Habana Cultural was designed to provide citizens with easy access to the cultural newsletter of Havana. The site's design resulted in a user traffic increase of up to 18% compared to previous years.",
  },
  {
    title: "Avancode Challenge",
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
    outcomeDraft: "The complete redesign of the platform increased product visibility and usability by 28%, reducing customer effort to access different products in the market.",
  },
];

// Incomplete records stay in the catalog without appearing in the portfolio.
export const PROJECTS = PROJECT_CATALOG
  .filter((project) => project.published !== false && project.img)
  .sort((a, b) => (a.featuredRank ?? 99) - (b.featuredRank ?? 99));

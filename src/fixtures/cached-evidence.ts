import type { CitationSource, Finding, ResearchTask } from "../lib/schemas";

export interface DemoVenturePreset {
  ideaId: string;
  title: string;
  rawDescription: string;
  targetUsers: string;
  countryOrRegion: string;
  tasks: ResearchTask[];
  sources: CitationSource[];
  findings: Finding[];
}

export const YOUTH_PRESETS: DemoVenturePreset[] = [
  {
    ideaId: "preset-eco-route-uae",
    title: "EcoRoute UAE — AI Micro-Hub Delivery for Young Urban Couriers",
    rawDescription: "An AI agent that aggregates last-mile parcel batches in Dubai Downtown and Marina for young electric-scooter couriers, cutting transit emissions and increasing courier earnings.",
    targetUsers: "Urban delivery couriers aged 18-24 and local green logistics operators",
    countryOrRegion: "Dubai, United Arab Emirates",
    tasks: [
      {
        id: "task-1",
        goal: "Analyze Dubai green mobility & delivery regulations",
        query: "Dubai RTA commercial delivery motorcycle scooter regulations 2026",
        tool: "regulatory_check",
        expectedEvidence: "RTA licensing criteria and micro-mobility permits in designated zones",
        dependencies: [],
        status: "completed",
        budgetCost: 1,
      },
      {
        id: "task-2",
        goal: "Evaluate competitor dispatch density in Dubai Marina & Downtown",
        query: "Dubai last mile courier dispatch platforms market share competitors",
        tool: "competitor_lookup",
        expectedEvidence: "Current dispatch leaders (Talabat, Careem Box, Quiqup) and their commission rates",
        dependencies: ["task-1"],
        status: "completed",
        budgetCost: 1,
      },
      {
        id: "task-3",
        goal: "Verify courier willingness to adopt batch routing app",
        query: "last mile delivery courier unit economics earnings per delivery UAE",
        tool: "web_search",
        expectedEvidence: "Courier hourly yields and route inefficiency reports",
        dependencies: [],
        status: "completed",
        budgetCost: 1,
      },
    ],
    sources: [
      {
        id: "src-rta-gov",
        url: "https://www.rta.ae/wps/portal/rta/ae/home/about-rta/smart-mobility",
        title: "Dubai Autonomous & Green Transportation Strategy — RTA Official",
        publisher: "Roads and Transport Authority Dubai",
        publicationDate: "2026-02-15",
        accessDate: "2026-10-13",
        excerpt: "RTA supports zero-emission delivery pilots in designated high-density urban clusters including Downtown Dubai and Dubai Internet City.",
        relevanceScore: 0.95,
        isCachedEvidence: true,
        validationStatus: "cached",
      },
      {
        id: "src-wam-logistics",
        url: "https://www.wam.ae/en/article/b3n7y8-dubai-e-commerce-and-logistics-growth",
        title: "Dubai e-Commerce and Last-Mile Sector Expands by 14% Annually",
        publisher: "Emirates News Agency (WAM)",
        publicationDate: "2026-05-10",
        accessDate: "2026-10-13",
        excerpt: "The Dubai Chamber of Digital Economy reports sustained acceleration in e-commerce fulfillment with urban parcel consolidation being a top priority.",
        relevanceScore: 0.91,
        isCachedEvidence: true,
        validationStatus: "cached",
      },
      {
        id: "src-mena-logistics-report",
        url: "https://www.statista.com/outlook/dmo/ecommerce/united-arab-emirates",
        title: "United Arab Emirates eCommerce Market & Courier Unit Economics",
        publisher: "Statista Research",
        publicationDate: "2026-01-20",
        accessDate: "2026-10-13",
        excerpt: "Average courier delivery cost in dense urban UAE sectors averages 14-18 AED, with 28% of courier time spent idling or searching for building concierge access.",
        relevanceScore: 0.88,
        isCachedEvidence: true,
        validationStatus: "cached",
      },
      {
        id: "src-chamber-digital",
        url: "https://www.dubaichamberdigital.com/en/create-ai-agents",
        title: "Create AI Agents Championship — Guidelines for Logistics & Urban Agents",
        publisher: "Dubai Chamber of Digital Economy",
        publicationDate: "2026-10-07",
        accessDate: "2026-10-13",
        excerpt: "Solutions demonstrating measurable economic value and urban efficiency in Dubai receive high evaluation priority.",
        relevanceScore: 0.94,
        isCachedEvidence: true,
        validationStatus: "cached",
      },
      {
        id: "src-tech-bench",
        url: "https://developers.google.com/maps/documentation/routes",
        title: "Routes API & Vehicle Routing Problem Optimization Limits",
        publisher: "Google Cloud Documentation",
        publicationDate: "2026-03-01",
        accessDate: "2026-10-13",
        excerpt: "Dynamic clustered routing for 20-stop batches executes under 400ms latency with multi-waypoint constraints.",
        relevanceScore: 0.84,
        isCachedEvidence: true,
        validationStatus: "cached",
      },
    ],
    findings: [
      {
        id: "find-1",
        claim: "Dubai RTA actively encourages micro-mobility consolidation in high-density commercial zones, providing regulatory tailwinds.",
        sourceIds: ["src-rta-gov", "src-wam-logistics"],
        category: "regulatory",
        confidence: "high",
      },
      {
        id: "find-2",
        claim: "Courier idle time (28%) is predominantly caused by individual building drop-offs, making consolidated drop hubs highly economical.",
        sourceIds: ["src-mena-logistics-report"],
        category: "market_need",
        confidence: "high",
      },
      {
        id: "find-3",
        claim: "INCUMBENTS (Talabat/Careem) charge 20-30% platform fees; an independent batching tool can operate on an 8% coordination fee.",
        sourceIds: ["src-mena-logistics-report"],
        category: "competitor",
        confidence: "medium",
      },
      {
        id: "find-4",
        claim: "Routing complexity is technically manageable for a student/youth team using standard multi-stop open APIs.",
        sourceIds: ["src-tech-bench"],
        category: "feasibility",
        confidence: "high",
      },
    ],
  },
];

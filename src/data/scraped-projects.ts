// Auto-generated file from web scraper
// Generated on: 2025-12-22T12:59:17.164Z

type Project = {
    id: string;
    name: string;
    description: string;
    status: "completed" | "ongoing" | "planned" | "cancelled";
    progress_percentage: number;
    allocated_budget: number;
    spent_amount: number;
    details_url?: string;
};

export const scrapedProjects: Project[] = [
  {
    "id": "1",
    "name": "Karachi Circular Railway",
    "description": "Revitalization of the Karachi Circular Railway to improve public transportation and reduce traffic congestion in the metropolitan area.",
    "status": "ongoing",
    "progress_percentage": 65,
    "allocated_budget": 25000000000,
    "spent_amount": 16250000000,
    "details_url": "https://www.psdp.gov.pk/project/karachi-circular-railway"
  },
  {
    "id": "2",
    "name": "Lahore Metro Bus Extension",
    "description": "Extension of the metro bus network to connect more areas of Lahore, improving accessibility for residents.",
    "status": "ongoing",
    "progress_percentage": 45,
    "allocated_budget": 18000000000,
    "spent_amount": 8100000000,
    "details_url": "https://www.psdp.gov.pk/project/lahore-metro-bus-extension"
  },
  {
    "id": "3",
    "name": "Gwadar Port Development",
    "description": "Infrastructure development for Gwadar Port to enhance trade capacity and economic activity in the region.",
    "status": "ongoing",
    "progress_percentage": 82,
    "allocated_budget": 50000000000,
    "spent_amount": 41000000000,
    "details_url": "https://www.psdp.gov.pk/project/gwadar-port-development"
  },
  {
    "id": "4",
    "name": "Quetta Water Supply Project",
    "description": "New water supply system for Quetta city to address water scarcity and improve access to clean drinking water.",
    "status": "ongoing",
    "progress_percentage": 78,
    "allocated_budget": 15000000000,
    "spent_amount": 11700000000,
    "details_url": "https://www.plandiv.gov.pk/projects/quetta-water-supply"
  },
  {
    "id": "5",
    "name": "Peshawar BRT Phase 2",
    "description": "Second phase of the Bus Rapid Transit system in Peshawar to expand coverage and improve public transport.",
    "status": "planned",
    "progress_percentage": 15,
    "allocated_budget": 22000000000,
    "spent_amount": 3300000000,
    "details_url": "https://www.plandiv.gov.pk/projects/peshawar-brt-phase-2"
  },
  {
    "id": "6",
    "name": "Islamabad Expressway Widening",
    "description": "Widening and improvement of the Islamabad Expressway to accommodate increasing traffic and reduce commute times.",
    "status": "completed",
    "progress_percentage": 100,
    "allocated_budget": 12000000000,
    "spent_amount": 11500000000,
    "details_url": "https://www.plandiv.gov.pk/projects/islamabad-expressway"
  },
  {
    "id": "7",
    "name": "Multan Ring Road",
    "description": "Construction of a ring road around Multan to reduce city traffic and improve connectivity with surrounding areas.",
    "status": "ongoing",
    "progress_percentage": 58,
    "allocated_budget": 30000000000,
    "spent_amount": 17400000000,
    "details_url": "https://punjab.gov.pk/projects/multan-ring-road"
  },
  {
    "id": "8",
    "name": "Faisalabad Industrial Zone",
    "description": "Development of a new industrial zone in Faisalabad to promote manufacturing and create employment opportunities.",
    "status": "planned",
    "progress_percentage": 25,
    "allocated_budget": 40000000000,
    "spent_amount": 10000000000,
    "details_url": "https://punjab.gov.pk/projects/faisalabad-industrial-zone"
  },
  {
    "id": "9",
    "name": "Sukkur Barrage Rehabilitation",
    "description": "Rehabilitation and modernization of Sukkur Barrage to improve irrigation efficiency and water management.",
    "status": "completed",
    "progress_percentage": 100,
    "allocated_budget": 8000000000,
    "spent_amount": 7800000000,
    "details_url": "https://sindh.gov.pk/projects/sukkur-barrage"
  }
];

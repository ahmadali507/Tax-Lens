import { scrapedProjects } from "@/data/scraped-projects";

export async function GET() {
    return Response.json(scrapedProjects);
}

import type { Metadata } from "next";
import { TrackExpenditureClient } from "@/components/track-expenditure/track-expenditure-client";

export const metadata: Metadata = {
    title: "Track Expenditure - TaxLens",
    description: "Analyze tax collection and government spending within a custom time range. View total taxes collected, project budgets allocated and spent.",
};

export default async function TrackExpenditurePage() {
    return <TrackExpenditureClient />;
}

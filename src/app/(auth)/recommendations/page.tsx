import { Header } from "@/components/layout/header";
import { RecommendationClient } from "@/components/recommendations/recommendation-client";

export default function RecommendationsPage() {
  return (
    <div className="flex flex-col h-full">
      <Header 
        title="For You"
        description="AI-powered recommendations to help you find the perfect skill swap."
      />
      <div className="p-6 flex-1 overflow-auto">
        <RecommendationClient />
      </div>
    </div>
  );
}

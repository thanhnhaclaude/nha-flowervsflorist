import { InfoPageView } from "@/components/info-page";
import { infoPages } from "@/data/pages";
import { pageMeta } from "@/lib/seo";

const page = infoPages["privacy-policy"];
export const metadata = pageMeta({ title: page.seoTitle, description: page.description, path: "/privacy-policy" });

export default function Page() {
  return <InfoPageView page={page} />;
}

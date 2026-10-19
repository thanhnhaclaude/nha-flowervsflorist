import { InfoPageView } from "@/components/info-page";
import { infoPages } from "@/data/pages";
import { pageMeta } from "@/lib/seo";

const page = infoPages["refund-policy"];
export const metadata = pageMeta({ title: page.seoTitle, description: page.description, path: "/refund-policy" });

export default function Page() {
  return <InfoPageView page={page} />;
}

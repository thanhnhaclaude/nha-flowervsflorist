import { InfoPageView } from "@/components/info-page";
import { infoPages } from "@/data/pages";
import { pageMeta } from "@/lib/seo";

const page = infoPages["terms"];
export const metadata = pageMeta({ title: page.seoTitle, description: page.description, path: "/terms" });

export default function Page() {
  return <InfoPageView page={page} />;
}

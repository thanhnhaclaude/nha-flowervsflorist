import { InfoPageView } from "@/components/info-page";
import { infoPages } from "@/data/pages";
import { pageMeta } from "@/lib/seo";

const page = infoPages["delivery-information"];
export const metadata = pageMeta({ title: page.seoTitle, description: page.description, path: "/delivery-information" });

export default function Page() {
  return <InfoPageView page={page} />;
}

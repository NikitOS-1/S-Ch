import { SuccessPage } from "@/widgets/success-page";

interface PageProps {
  searchParams: Promise<{ session_id?: string }>;
}

export default function Page(props: PageProps) {
  return <SuccessPage searchParams={props.searchParams} />;
}

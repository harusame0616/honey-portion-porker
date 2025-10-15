import { Skeleton } from "@/components/ui/skeleton";
import { Section } from "../section";

export function NoteSkeleton() {
	return (
		<Section title="Note">
			<Skeleton className="h-6 w-full" />
		</Section>
	);
}

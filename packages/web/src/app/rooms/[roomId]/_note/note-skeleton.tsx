import { Section } from "@/components/section";
import { Skeleton } from "@/components/ui/skeleton";

export function NoteSkeleton() {
	return (
		<Section title="Note">
			<Skeleton className="h-6 w-full" />
		</Section>
	);
}

import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "./card";

const choices = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89, -1];

export function PokerSkeleton() {
	return (
		<div className="flex flex-col gap-4">
			{/* Your choices section */}
			<section>
				<h2 className="font-bold">Your choices</h2>
				<div className="bg-muted p-4 rounded-md">
					<ul className="flex flex-wrap gap-4 opacity-50 animate-pulse">
						{choices.map((card) => (
							<li key={card}>
								<Card isOpen selected={false}>
									{card}
								</Card>
							</li>
						))}
					</ul>
				</div>
			</section>

			{/* Member's cards section */}
			<section>
				<h2 className="font-bold">Member's cards</h2>
				<div className="bg-muted p-4 rounded-md">
					<div className="flex gap-2 flex-wrap opacity-50 animate-pulse">
						{[1].map((id) => (
							<Card isOpen={false} key={id} selected={false}>
								{0}
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* Result section */}
			<section>
				<h2 className="font-bold">Result</h2>
				<div className="bg-muted p-4 rounded-md text-sm space-y-2">
					<Skeleton className="h-5 w-32" />
					<Skeleton className="h-5 w-32" />
					<Skeleton className="h-5 w-32" />
				</div>
			</section>
		</div>
	);
}

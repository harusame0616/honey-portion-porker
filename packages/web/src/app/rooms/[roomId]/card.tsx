import { cn } from "@/lib/utils";
import { CoffeeIcon } from "lucide-react";
import type { PropsWithChildren } from "react";

import { Itim } from "next/font/google";
import Image from "next/image";
import cardIcon from "../../_resources/icon.svg";

const cuteFont = Itim({
	subsets: ["latin"],
	display: "swap",
	weight: "400",
	style: "normal",
});

type Props = PropsWithChildren<{
	isOpen: boolean;
	selected: boolean;
}>;
export function Card({ children, isOpen, selected }: Props) {
	return (
		<div
			className={cn(
				"h-20 w-12 border-gray-500 border-2 rounded-md flex items-center justify-center text-4xl font-bold bg-white",
				cuteFont.className,
				selected ? "bg-primary" : "",
			)}
		>
			{isOpen ? (
				children === -1 ? (
					<CoffeeIcon
						className="size-10 text-2xl"
						role="img"
						aria-label={`${selected ? "選択済み" : "未選択"}のコーヒーカード`}
						width={30}
					/>
				) : (
					<>
						<span className="sr-only">
							{selected ? "選択済み" : "未選択"}の
						</span>
						{children}
						<span className="sr-only">のカード</span>
					</>
				)
			) : (
				<Image
					alt={`${selected ? "選択済み" : "未選択"}の裏向きのカード`}
					src={cardIcon}
					width={30}
				/>
			)}
		</div>
	);
}

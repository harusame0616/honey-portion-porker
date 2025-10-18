import { CoffeeIcon } from "lucide-react";
import { Itim } from "next/font/google";
import Image from "next/image";
import type { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";
import cardIcon from "../../../_resources/icon.svg";

const cuteFont = Itim({
	display: "swap",
	style: "normal",
	subsets: ["latin"],
	weight: "400",
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
						aria-label={`${selected ? "選択済み" : "未選択"}のコーヒーカード`}
						className="size-10 text-2xl"
						role="img"
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
				<div className="size-8">
					<Image
						alt={`${selected ? "選択済み" : "未選択"}の裏向きのカード`}
						decoding="sync"
						loading="eager"
						priority
						src={cardIcon}
					/>
				</div>
			)}
		</div>
	);
}

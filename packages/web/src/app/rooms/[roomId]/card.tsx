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
					<CoffeeIcon className="size-10 text-2xl" />
				) : (
					children
				)
			) : (
				<Image alt="" src={cardIcon} width={30} />
			)}
		</div>
	);
}

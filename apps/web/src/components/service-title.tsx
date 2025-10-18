import { Itim } from "next/font/google";
import Image from "next/image";
import icon from "@/app/_resources/icon.svg";
import { cn } from "@/lib/utils";

const titleFont = Itim({
	display: "swap",
	style: "normal",
	subsets: ["latin"],
	weight: "400",
});

export function ServiceTitle() {
	return (
		<div className="flex items-end gap-1">
			<div className="size-10 shrink-0">
				<Image alt="" decoding="sync" loading="eager" priority src={icon} />
			</div>
			<span className={cn(titleFont.className, "text-3xl font-bold ")}>
				Honey Portion Poker
			</span>
		</div>
	);
}

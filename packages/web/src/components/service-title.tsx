import icon from "@/app/_resources/icon.svg";
import { cn } from "@/lib/utils";
import { Itim } from "next/font/google";
import Image from "next/image";

const titleFont = Itim({
	subsets: ["latin"],
	display: "swap",
	weight: "400",
	style: "normal",
});

export function ServiceTitle() {
	return (
		<div className="flex items-end gap-1">
			<div className="size-10 shrink-0">
				<Image src={icon} alt="" priority loading="eager" />
			</div>
			<span className={cn(titleFont.className, "text-3xl font-bold ")}>
				Honey Portion Poker
			</span>
		</div>
	);
}

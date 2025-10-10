import Link from "next/link";
import type { ReactNode } from "react";
import { ServiceTitle } from "@/components/service-title";

export default function Layout({ children }: { children: ReactNode }) {
	return (
		<div>
			<header className="bg-primary p-4 shadow-md flex">
				<Link href="/">
					<ServiceTitle />
				</Link>
			</header>
			<div className="p-8">
				<main>{children}</main>
			</div>
		</div>
	);
}

import Link from "next/link";
import { ServiceTitle } from "@/components/service-title";

export default function Layout({ children }: LayoutProps<"/rooms/[roomId]">) {
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

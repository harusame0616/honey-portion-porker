import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
	src: "./fonts/GeistVF.woff",
	variable: "--font-geist-sans",
	weight: "100 900",
});
const geistMono = localFont({
	src: "./fonts/GeistMonoVF.woff",
	variable: "--font-geist-mono",
	weight: "100 900",
});

export const metadata: Metadata = {
	description:
		"登録不要で設定を保持できるシンプルで簡単なオンライン・プランニングポーカー",
	metadataBase: new URL("https://honey-portion-poker.harusame.dev"),
	openGraph: {
		description:
			"登録不要で設定を保持できるシンプルで簡単なオンライン・プランニングポーカー",
		siteName: "Honey Portion Poker",
		title: "Honey Portion Poker",
		type: "website",
		url: "https://honey-portion-poker.harusame.dev",
	},
	title: "Honey Portion Poker",
	twitter: {
		card: "summary_large_image",
		description:
			"登録不要で設定を保持できるシンプルで簡単なオンライン・プランニングポーカー",
		title: "Honey Portion Poker",
	},
};

export default function RootLayout({ children }: LayoutProps<"/">) {
	return (
		<html lang="ja">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				{children}
			</body>
		</html>
	);
}

/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "next/og";

export const runtime = "edge";

// Image metadata
export const size = {
	height: 630,
	width: 1200,
};

export const contentType = "image/png";

export default async function Image() {
	const iconUrl = (await (
		await fetch(new URL("./ogp-icon.png", import.meta.url))
	).arrayBuffer()) as unknown as string; // arraybuffer のままだと img の src に指定したときに型エラーになる。暫定対応
	const font = await (
		await fetch(new URL("./Itim-Regular.ttf", import.meta.url))
	).arrayBuffer();

	try {
		return new ImageResponse(
			<div
				style={{
					alignItems: "center",
					background: "#DED5BA",
					border: "8px solid #000",
					borderRadius: "15px",
					display: "flex",
					flexDirection: "column",
					height: "100%",
					justifyContent: "center",
					width: "100%",
				}}
			>
				<div
					style={{
						display: "flex",
						flexDirection: "row",
						gap: "0.5rem",
					}}
				>
					{/* biome-ignore lint/performance/noImgElement: OG image generation requires native img tag */}
					<img alt="" height="80" src={iconUrl} width="80" />
					<div
						style={{
							fontSize: "4rem",
							paddingTop: "0.8rem",
						}}
					>
						Honey Portion Porker
					</div>
				</div>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						fontSize: "2rem",
						marginLeft: "-3.5rem",
						marginTop: "2rem",
					}}
				>
					<div
						style={{
							color: "#FACC15",
							textShadow: "0 1px 3px rgb(122, 113, 86)",
						}}
					>
						すぐに使えて設定が保存できる
					</div>
					<div>シンプルな</div>
					<div>プランニングポーカー</div>
				</div>
			</div>,
			{
				...size,
				fonts: [
					{
						data: font,
						name: "Itim",
						style: "normal",
						weight: 400,
					},
				],
			},
		);
	} catch (error) {
		console.log(error);
		return null;
	}
}

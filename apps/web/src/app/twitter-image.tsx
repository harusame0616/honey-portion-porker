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
					background:
						"linear-gradient(135deg, #F5E6C8 0%, #E8DCC4 50%, #D4C5A0 100%)",
					display: "flex",
					flexDirection: "column",
					height: "100%",
					justifyContent: "center",
					position: "relative",
					width: "100%",
				}}
			>
				{/* 背景の装飾的なグラフィック要素 */}
				<div
					style={{
						background:
							"radial-gradient(circle, rgba(250, 204, 21, 0.12) 0%, transparent 70%)",
						borderRadius: "50%",
						filter: "blur(80px)",
						height: "600px",
						left: "-150px",
						position: "absolute",
						top: "-100px",
						width: "600px",
					}}
				/>
				<div
					style={{
						background:
							"radial-gradient(circle, rgba(250, 204, 21, 0.08) 0%, transparent 70%)",
						borderRadius: "50%",
						bottom: "-150px",
						filter: "blur(80px)",
						height: "500px",
						position: "absolute",
						right: "-100px",
						width: "500px",
					}}
				/>

				{/* 上側エリア - アイコンとサービス名 */}
				<div
					style={{
						alignItems: "center",
						display: "flex",
						flexDirection: "row",
						gap: "2rem",
						marginBottom: "4rem",
						position: "relative",
					}}
				>
					{/* biome-ignore lint/performance/noImgElement: OG 画像生成では next/image が使用できないため */}
					<img
						alt=""
						height="160"
						src={iconUrl}
						style={{
							filter: "drop-shadow(0 20px 40px rgba(0, 0, 0, 0.2))",
						}}
						width="160"
					/>
					<div
						style={{
							fontSize: "5.5rem",
							fontWeight: "bold",
							letterSpacing: "-0.02em",
							lineHeight: 1.1,
							textShadow: "3px 3px 6px rgba(0, 0, 0, 0.15)",
						}}
					>
						Honey Portion Porker
					</div>
				</div>

				{/* 下側エリア - キャッチフレーズ */}
				<div
					style={{
						backdropFilter: "blur(20px)",
						background: "rgba(255, 255, 255, 0.7)",
						border: "2px solid rgba(255, 255, 255, 0.5)",
						borderRadius: "32px",
						boxShadow:
							"0 24px 48px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.8)",
						display: "flex",
						flexDirection: "column",
						gap: "0.8rem",
						padding: "50px 70px",
						position: "relative",
					}}
				>
					{/* キャッチコピー */}
					<div
						style={{
							background: "linear-gradient(135deg, #FACC15 0%, #F59E0B 100%)",
							backgroundClip: "text",
							color: "transparent",
							fontSize: "4rem",
							fontWeight: "900",
							letterSpacing: "-0.02em",
							lineHeight: 1.3,
							textAlign: "center",
							WebkitBackgroundClip: "text",
						}}
					>
						ログイン不要、URL共有だけ
					</div>

					{/* サブテキスト */}
					<div
						style={{
							color: "#2D2D2D",
							display: "flex",
							flexDirection: "column",
							fontSize: "3.2rem",
							fontWeight: "700",
							lineHeight: 1.4,
							textAlign: "center",
						}}
					>
						<div>リアルタイムな</div>
						<div>プランニングポーカー</div>
					</div>

					{/* 装飾的なドット */}
					<div
						style={{
							background: "#FACC15",
							borderRadius: "50%",
							height: "14px",
							position: "absolute",
							right: "40px",
							top: "40px",
							width: "14px",
						}}
					/>
					<div
						style={{
							background: "#F59E0B",
							borderRadius: "50%",
							bottom: "40px",
							height: "18px",
							left: "40px",
							position: "absolute",
							width: "18px",
						}}
					/>
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

/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "next/og";

export const runtime = "edge";

// Image metadata
export const size = {
  width: 1200,
  height: 630,
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
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "#DED5BA",
            borderRadius: "15px",
            border: "8px solid #000",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "0.5rem",
            }}
          >
            <img src={iconUrl} width="80" height="80" alt="" />
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
              marginTop: "2rem",
              marginLeft: "-3.5rem",
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
        </div>
      ),
      {
        ...size,
        fonts: [
          {
            name: "Itim",
            data: font,
            weight: 400,
            style: "normal",
          },
        ],
      }
    );
  } catch (error) {
    console.log(error);
    return null;
  }
}

import { ImageResponse } from "next/og";

export const runtime = "edge";

// Image metadata
export const alt = "About Acme";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

// Image generation
export default async function OgpImage() {
  // Font
  const font = await fetch(new URL("./Itim-Regular.ttf", import.meta.url)).then(
    (res) => res.arrayBuffer()
  );
  const logo = await fetch(
    new URL("./_resources/icon.svg", import.meta.url)
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div className="flex items-end">
        <img src={logo} alt="" />
        <div
          style={{
            fontSize: 128,
            background: "white",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Honey Portion Poker
        </div>
      </div>
    ),
    // ImageResponse options
    {
      // For convenience, we can re-use the exported opengraph-image
      // size config to also set the ImageResponse's width and height.
      ...size,
      fonts: [
        {
          name: "Itim",
          data: await font,
          style: "normal",
          weight: 400,
        },
      ],
    }
  );
}

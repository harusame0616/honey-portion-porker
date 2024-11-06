import { Itim } from "next/font/google";
import { NewRoomCreationForm } from "./new-room-creation-form";
import { RoomJoiningForm } from "./room-joining-form";
import { cn } from "@/lib/utils";
import Image from "next/image";
import icon from "@/app/_resources/icon.svg";

const titleFont = Itim({
  subsets: ["latin"],
  display: "swap",
  weight: "400",
  style: "normal",
});

export default function Home() {
  return (
    <div className="flex flex-col items-center p-4">
      <div className="max-w-2xl w-full">
        <header className="text-3xl font-bold flex items-end gap-1">
          <Image src={icon} alt="" width={40} height={40} />
          <h1 className={cn(titleFont.className)}>Honey Portion Poker</h1>
        </header>
        <main>
          <div className="font-bold text-3xl p-4 leading-normal my-4">
            <div className="text-primary">すぐに使えて設定が保持できる</div>
            <div>シンプルな</div>
            <div>プランニングポーカー</div>
          </div>
          <p>
            <span className="text-primary font-bold">Honey Portion Poker</span>{" "}
            はオンライン上でプランニングポーカーを実施できるサービスです。面倒な登録は必要なく、1
            click
            ですぐに見積もりを開始することができます。また、作成したルームは30日間保存されるため、毎回
            URL を発行する必要はありません。
          </p>

          <div className="p-8 flex flex-col items-center w-full gap-4">
            <NewRoomCreationForm />
            <div>or</div>
            <RoomJoiningForm />
          </div>
        </main>
      </div>
    </div>
  );
}

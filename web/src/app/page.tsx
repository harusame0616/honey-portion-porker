import { ServiceTitle } from "@/components/service-title";
import { NewRoomCreationForm } from "./new-room-creation-form";
import { RoomJoiningForm } from "./room-joining-form";

export default function Home() {
  return (
    <div className="flex flex-col items-center p-4">
      <div className="max-w-2xl w-full">
        <header>
          <h1>
            <ServiceTitle />
          </h1>
        </header>
        <main>
          <div className="font-bold text-3xl p-4 leading-normal my-4">
            <div
              className="text-primary"
              style={{
                textShadow: "0 1px 3px rgb(122, 113, 86)",
              }}
            >
              すぐに使えて設定が保持できる
            </div>
            <div>シンプルな</div>
            <div>プランニングポーカー</div>
          </div>
          <p>
            <span className="font-bold">Honey Portion Poker</span>{" "}
            はオンライン上でプランニングポーカーを実施できるサービスです。面倒な登録は必要なく、1
            click
            ですぐに見積もりを開始することができます。また、作成したルームは30日間保存されるため、毎回
            URL を発行する必要はありません。
          </p>

          <div className="flex justify-center">
            <div className="p-8 flex flex-col items-center gap-4 w-60">
              <NewRoomCreationForm />
              <div>or</div>
              <RoomJoiningForm />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

import { NewRoomCreationForm } from "./new-room-creation-form";
import { RoomJoiningForm } from "./room-joining-form";

export default function Home() {
  return (
    <div className="flex flex-col items-center p-4">
      <div className="max-w-2xl w-full">
        <header className="text-lg font-bold">
          <h1>Honey Portion Poker</h1>
        </header>
        <main>
          <div className="font-bold text-3xl p-4 leading-normal my-4">
            <div className="text-primary">すぐに使える・設定が保持できる</div>
            <div>シンプルな</div>
            <div>オンライン・プランニングポーカー</div>
          </div>
          <p>
            <span className="text-primary font-bold">Honey Portion Poker</span>{" "}
            はオンライン上で上でプランニングポーカーを実施できるサービスです。面倒な登録は必要なく、1
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

import { ServiceTitle } from "@/components/service-title";
import { CreateNewRoomButton } from "./create-new-room-button";
import { JoinRoomForm } from "./room-joining-form";

export default function Home() {
	return (
		<div className="flex flex-col items-center">
			<header className="max-w-2xl w-full p-4">
				<h1>
					<ServiceTitle />
				</h1>
			</header>

			<main className="flex flex-col items-center">
				<div className="bg-[hsl(45_35%_60%)] w-svw flex justify-center my-4 p-6">
					<h2 className="max-w-2xl w-full font-bold text-3xl leading-normal">
						<span className="text-primary text-shadow-md">
							すぐ使えて設定を保持できる
						</span>
						<span className="block">シンプルな</span>
						<span className="block">プランニングポーカー</span>
					</h2>
				</div>

				<div className="max-w-2xl w-full p-4">
					<p>
						<span className="font-bold">Honey Portion Poker</span>{" "}
						はオンライン上でプランニングポーカーを実施できる Web
						プラニングポーカーサービスです。登録不要で、1 click
						ですぐに見積もりを開始することができます。また、作成したルームは最終アクセスから30日間保存されるため、毎回
						URL を発行する必要はありません。
					</p>

					<div className="p-8 max-w-96 w-full mx-auto">
						<CreateNewRoomButton />
						<div className="mt-8 mb-2 text-sm">
							または既存のルームに参加する
						</div>
						<JoinRoomForm />
					</div>
				</div>
			</main>
		</div>
	);
}

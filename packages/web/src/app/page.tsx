import { ServiceTitle } from "@/components/service-title";
import { NewRoomCreation } from "./new-room-creation";
import { RoomJoiningForm } from "./room-joining-form";

export default function Home() {
	return (
		<div className="flex flex-col items-center">
			<header className="max-w-2xl w-full p-4">
				<h1>
					<ServiceTitle />
				</h1>
			</header>

			<main className="flex flex-col items-center">
				<div className="font-bold text-3xl leading-normal bg-[hsl(45_35%_60%)] w-svw flex justify-center my-4">
					<div className="max-w-2xl w-full p-6">
						<div
							className="text-primary"
							style={{
								textShadow: "0 1px 3px rgb(122, 113, 86)",
							}}
						>
							すぐ使えて設定を保持できる
						</div>
						<div>シンプルな</div>
						<div>プランニングポーカー</div>
					</div>
				</div>

				<div className="max-w-2xl w-full p-4">
					<p>
						<span className="font-bold">Honey Portion Poker</span>{" "}
						はオンライン上でプランニングポーカーを実施できる Web
						プラニングポーカーサービスです。登録不要で、1 click
						ですぐに見積もりを開始することができます。また、作成したルームは最終アクセスから30日間保存されるため、毎回
						URL を発行する必要はありません。
					</p>

					<div className="flex justify-center">
						<div className="p-8 max-w-96 w-full">
							<NewRoomCreation />
							<div className="mt-8">
								<div className="mb-2 text-sm">または既存のルームに参加する</div>
								<RoomJoiningForm />
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}

import Link from "next/link";
import { RoomJoiningForm } from "@/app/room-joining-form";

export default function NotFoundPage() {
	return (
		<div className="flex flex-col items-center">
			<div className="max-w-2xl w-full">
				<h1 className="font-bold text-xl mb-4">ルームが見つかりません</h1>
				<p>ルーム ID を確認して正しい ルーム ID を入力してください。</p>
				<div className="w-full max-w-96 mt-8">
					<RoomJoiningForm />
				</div>
				<div className="flex justify-center mt-16">
					<Link className="underline" href="/">
						トップへ
					</Link>
				</div>
			</div>
		</div>
	);
}

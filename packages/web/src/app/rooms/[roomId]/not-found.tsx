import { RoomJoiningForm } from "@/app/room-joining-form";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
	title: "ルームが見つかりません",
};

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
					<Link href="/" className="underline">
						トップへ
					</Link>
				</div>
			</div>
		</div>
	);
}

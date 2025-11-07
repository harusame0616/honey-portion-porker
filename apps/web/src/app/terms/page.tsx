import { ServiceTitle } from "@/components/service-title";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "利用規約 - Honey Portion Poker",
	description: "Honey Portion Poker の利用規約",
};

export default function TermsPage() {
	return (
		<div className="flex flex-col items-center min-h-screen">
			<header className="max-w-2xl w-full p-4">
				<h1>
					<Link href="/">
						<ServiceTitle />
					</Link>
				</h1>
			</header>

			<main className="max-w-2xl w-full p-4">
				<h2 className="text-3xl font-bold mb-6">利用規約</h2>

				<p className="mb-6 text-sm text-gray-600">
					最終更新日: {new Date().toLocaleDateString("ja-JP")}
				</p>

				<div className="space-y-8">
					<section>
						<h3 className="text-xl font-bold mb-3">第1条（適用）</h3>
						<p className="mb-2">
							本規約は、◯◯◯（以下「当方」といいます）が提供する Honey Portion
							Poker（以下「本サービス」といいます）の利用条件を定めるものです。
						</p>
						<p>
							本サービスを利用するすべての方（以下「ユーザー」といいます）は、本規約に同意したものとみなされます。
						</p>
					</section>

					<section>
						<h3 className="text-xl font-bold mb-3">第2条（本サービスの内容）</h3>
						<p>
							本サービスは、オンライン上でプランニングポーカーを実施できる Web
							サービスです。登録不要で利用でき、リアルタイムでチームメンバーとの見積もり作業を実施できます。
						</p>
					</section>

					<section>
						<h3 className="text-xl font-bold mb-3">第3条（利用登録）</h3>
						<p>
							本サービスは登録不要で利用できます。ルームを作成し、URL
							を共有することで利用を開始できます。
						</p>
					</section>

					<section>
						<h3 className="text-xl font-bold mb-3">第4条（禁止事項）</h3>
						<p className="mb-2">
							ユーザーは、本サービスの利用にあたり、以下の行為を行ってはならないものとします。
						</p>
						<ul className="list-disc list-inside space-y-1 ml-4">
							<li>法令または公序良俗に違反する行為</li>
							<li>犯罪行為に関連する行為</li>
							<li>
								本サービスの内容等、本サービスに含まれる著作権、商標権その他の知的財産権を侵害する行為
							</li>
							<li>
								当方、他のユーザー、またはその他第三者のサーバーまたはネットワークの機能を破壊したり、妨害したりする行為
							</li>
							<li>本サービスによって得られた情報を商業的に利用する行為</li>
							<li>当方のサービスの運営を妨害するおそれのある行為</li>
							<li>不正アクセスをし、またはこれを試みる行為</li>
							<li>他のユーザーに関する個人情報等を収集または蓄積する行為</li>
							<li>不正な目的を持って本サービスを利用する行為</li>
							<li>
								本サービスの他のユーザーまたはその他の第三者に不利益、損害、不快感を与える行為
							</li>
							<li>他のユーザーに成りすます行為</li>
							<li>◯◯◯</li>
							<li>その他、当方が不適切と判断する行為</li>
						</ul>
					</section>

					<section>
						<h3 className="text-xl font-bold mb-3">
							第5条（本サービスの提供の停止等）
						</h3>
						<p className="mb-2">
							当方は、以下のいずれかの事由があると判断した場合、ユーザーに事前に通知することなく本サービスの全部または一部の提供を停止または中断することができるものとします。
						</p>
						<ul className="list-disc list-inside space-y-1 ml-4">
							<li>
								本サービスにかかるコンピュータシステムの保守点検または更新を行う場合
							</li>
							<li>
								地震、落雷、火災、停電または天災などの不可抗力により、本サービスの提供が困難となった場合
							</li>
							<li>コンピュータまたは通信回線等が事故により停止した場合</li>
							<li>その他、当方が本サービスの提供が困難と判断した場合</li>
						</ul>
						<p className="mt-2">
							当方は、本サービスの提供の停止または中断により、ユーザーまたは第三者が被ったいかなる不利益または損害についても、一切の責任を負わないものとします。
						</p>
					</section>

					<section>
						<h3 className="text-xl font-bold mb-3">第6条（著作権）</h3>
						<p className="mb-2">
							本サービスおよび本サービスに関連する一切の情報についての著作権およびその他の知的財産権はすべて当方または当方にその利用を許諾した権利者に帰属します。
						</p>
						<p>
							ユーザーが本サービス上で投稿または送信したコンテンツ（プランニングポーカーの結果、ルーム設定等）に関する権利はユーザーに帰属します。◯◯◯
						</p>
					</section>

					<section>
						<h3 className="text-xl font-bold mb-3">第7条（データの保存期間）</h3>
						<p>
							作成されたルームは最終アクセスから30日間保存されます。30日間アクセスがない場合、ルームおよび関連データは自動的に削除されます。
						</p>
					</section>

					<section>
						<h3 className="text-xl font-bold mb-3">第8条（免責事項）</h3>
						<p className="mb-2">
							当方は、本サービスに関して、ユーザーと他のユーザーまたは第三者との間において生じた取引、連絡または紛争等について一切責任を負いません。
						</p>
						<p className="mb-2">
							本サービスは現状有姿で提供されるものであり、当方は本サービスについて、特定の目的への適合性、商業的有用性、完全性、継続性等を含め、一切保証を行うものではありません。
						</p>
						<p>◯◯◯</p>
					</section>

					<section>
						<h3 className="text-xl font-bold mb-3">第9条（サービス内容の変更等）</h3>
						<p>
							当方は、ユーザーに通知することなく、本サービスの内容を変更、追加または廃止することがあり、ユーザーはこれをあらかじめ承諾するものとします。
						</p>
					</section>

					<section>
						<h3 className="text-xl font-bold mb-3">第10条（利用規約の変更）</h3>
						<p>
							当方は、必要と判断した場合には、ユーザーに通知することなくいつでも本規約を変更することができるものとします。変更後の本規約は、本サービス上に掲載した時点から効力を生じるものとします。
						</p>
					</section>

					<section>
						<h3 className="text-xl font-bold mb-3">第11条（個人情報の取扱い）</h3>
						<p>
							当方は、本サービスの利用によって取得する個人情報については、当方「
							<Link
								href="/privacy"
								className="text-blue-600 hover:underline"
							>
								プライバシーポリシー
							</Link>
							」に従い適切に取り扱うものとします。
						</p>
					</section>

					<section>
						<h3 className="text-xl font-bold mb-3">第12条（通知または連絡）</h3>
						<p>
							ユーザーと当方との間の通知または連絡は、当方の定める方法によって行うものとします。◯◯◯
						</p>
					</section>

					<section>
						<h3 className="text-xl font-bold mb-3">第13条（権利義務の譲渡の禁止）</h3>
						<p>
							ユーザーは、当方の書面による事前の承諾なく、利用契約上の地位または本規約に基づく権利もしくは義務を第三者に譲渡し、または担保に供することはできません。
						</p>
					</section>

					<section>
						<h3 className="text-xl font-bold mb-3">第14条（準拠法・裁判管轄）</h3>
						<p className="mb-2">本規約の解釈にあたっては、日本法を準拠法とします。</p>
						<p>
							本サービスに関して紛争が生じた場合には、◯◯◯地方裁判所を第一審の専属的合意管轄裁判所とします。
						</p>
					</section>

					<div className="mt-12 pt-6 border-t border-gray-200">
						<p className="text-sm text-gray-600">以上</p>
					</div>
				</div>
			</main>
		</div>
	);
}

import { ServiceTitle } from "@/components/service-title";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "利用規約 | Honey Portion Poker",
	description: "Honey Portion Pokerの利用規約です。",
};

export default function TermsPage() {
	return (
		<div className="flex flex-col items-center">
			<header className="max-w-2xl w-full p-4">
				<h1>
					<Link href="/">
						<ServiceTitle />
					</Link>
				</h1>
			</header>

			<main className="max-w-2xl w-full p-4">
				<h1 className="text-3xl font-bold mb-8">利用規約</h1>

				<div className="prose prose-slate max-w-none">
					<p className="mb-4">
						この利用規約(以下「本規約」といいます。)は、◯◯◯(以下「当方」といいます。)が提供するHoney Portion Poker(以下「本サービス」といいます。)の利用条件を定めるものです。
					</p>

					<section className="mb-8">
						<h2 className="text-2xl font-bold mb-4">第1条(適用)</h2>
						<ol className="list-decimal pl-6 space-y-2">
							<li>
								本規約は、本サービスの提供条件及び本サービスの利用に関する当方と利用者との間の権利義務関係を定めることを目的とし、利用者と当方との間の本サービスの利用に関わる一切の関係に適用されます。
							</li>
							<li>
								利用者は、本サービスを利用することによって、本規約に同意したものとみなされます。
							</li>
						</ol>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl font-bold mb-4">第2条(定義)</h2>
						<p className="mb-2">本規約において使用する以下の用語は、各々以下に定める意味を有するものとします。</p>
						<ol className="list-decimal pl-6 space-y-2">
							<li>
								「本サービス」とは、当方が提供するHoney Portion Poker及びこれに関連するサービスを意味します。
							</li>
							<li>
								「利用者」とは、本サービスを利用するすべての方を意味します。
							</li>
							<li>
								「利用データ」とは、利用者が本サービスを利用する際に入力、送信、または保存する情報を意味します。
							</li>
						</ol>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl font-bold mb-4">第3条(本サービスの内容)</h2>
						<ol className="list-decimal pl-6 space-y-2">
							<li>
								本サービスは、オンライン上でプランニングポーカーを実施できるWebサービスです。
							</li>
							<li>
								利用者は、登録不要で本サービスを利用することができます。
							</li>
							<li>
								作成されたルームは最終アクセスから30日間保存されますが、当方は保存を保証するものではありません。
							</li>
						</ol>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl font-bold mb-4">第4条(禁止事項)</h2>
						<p className="mb-2">利用者は、本サービスの利用にあたり、以下の行為をしてはなりません。</p>
						<ol className="list-decimal pl-6 space-y-2">
							<li>法令または公序良俗に違反する行為</li>
							<li>犯罪行為に関連する行為</li>
							<li>当方、本サービスの他の利用者、またはその他第三者のサーバーまたはネットワークの機能を破壊したり、妨害したりする行為</li>
							<li>当方のサービスの運営を妨害するおそれのある行為</li>
							<li>他の利用者に関する個人情報等を収集または蓄積する行為</li>
							<li>不正アクセスをし、またはこれを試みる行為</li>
							<li>他の利用者に成りすます行為</li>
							<li>当方のサービスに関連して、反社会的勢力に対して直接または間接に利益を供与する行為</li>
							<li>◯◯◯</li>
							<li>その他、当方が不適切と判断する行為</li>
						</ol>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl font-bold mb-4">第5条(本サービスの提供の停止等)</h2>
						<ol className="list-decimal pl-6 space-y-2">
							<li>
								当方は、以下のいずれかの事由があると判断した場合、利用者に事前に通知することなく本サービスの全部または一部の提供を停止または中断することができるものとします。
								<ol className="list-decimal pl-6 mt-2 space-y-1">
									<li>本サービスにかかるコンピュータシステムの保守点検または更新を行う場合</li>
									<li>地震、落雷、火災、停電または天災などの不可抗力により、本サービスの提供が困難となった場合</li>
									<li>コンピュータまたは通信回線等が事故により停止した場合</li>
									<li>その他、当方が本サービスの提供が困難と判断した場合</li>
								</ol>
							</li>
							<li>
								当方は、本サービスの提供の停止または中断により、利用者または第三者が被ったいかなる不利益または損害についても、一切の責任を負わないものとします。
							</li>
						</ol>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl font-bold mb-4">第6条(利用データの取扱い)</h2>
						<ol className="list-decimal pl-6 space-y-2">
							<li>
								利用者が本サービスを通じて入力、送信、または保存する情報については、利用者が自己の責任において管理するものとします。
							</li>
							<li>
								当方は、利用データの内容を監視する義務を負いません。
							</li>
							<li>
								当方は、利用データの正確性、完全性、有用性等について、いかなる保証も行いません。
							</li>
							<li>
								利用データは最終アクセスから30日間保存されますが、当方は、利用データの保存または維持について一切の責任を負いません。
							</li>
						</ol>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl font-bold mb-4">第7条(利用制限)</h2>
						<p className="mb-2">
							当方は、利用者が以下のいずれかに該当する場合には、事前の通知なく、利用者に対して、本サービスの全部もしくは一部の利用を制限することができるものとします。
						</p>
						<ol className="list-decimal pl-6 space-y-2">
							<li>本規約のいずれかの条項に違反した場合</li>
							<li>本サービスの運営を妨害した場合</li>
							<li>その他、当方が本サービスの利用を適当でないと判断した場合</li>
						</ol>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl font-bold mb-4">第8条(免責事項)</h2>
						<ol className="list-decimal pl-6 space-y-2">
							<li>
								当方は、本サービスに事実上または法律上の瑕疵(安全性、信頼性、正確性、完全性、有効性、特定の目的への適合性、セキュリティなどに関する欠陥、エラーやバグ、権利侵害などを含みます。)がないことを保証するものではありません。
							</li>
							<li>
								当方は、本サービスに起因して利用者に生じたあらゆる損害について、◯◯◯の範囲で責任を負います。
							</li>
							<li>
								本サービスは無料で提供されるサービスであり、当方は可能な限りの努力を行いますが、サービスの継続的な提供、品質、または特定の目的への適合性について保証するものではありません。
							</li>
						</ol>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl font-bold mb-4">第9条(サービス内容の変更等)</h2>
						<p>
							当方は、利用者への事前の告知をもって、本サービスの内容を変更、追加または廃止することがあり、利用者はこれを承諾するものとします。
						</p>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl font-bold mb-4">第10条(利用規約の変更)</h2>
						<ol className="list-decimal pl-6 space-y-2">
							<li>
								当方は、必要と判断した場合には、利用者に通知することなくいつでも本規約を変更することができるものとします。
							</li>
							<li>
								変更後の本規約は、本サービス上に掲載した時点より効力を生じるものとします。
							</li>
							<li>
								利用者は、本規約の変更後も本サービスを利用し続けることにより、変更後の本規約に同意したものとみなされます。
							</li>
						</ol>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl font-bold mb-4">第11条(個人情報の取扱い)</h2>
						<p>
							本サービスにおける個人情報の取扱いについては、別途定める
							<Link href="/privacy" className="text-blue-600 hover:underline">
								プライバシーポリシー
							</Link>
							に従うものとします。
						</p>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl font-bold mb-4">第12条(通知または連絡)</h2>
						<p>
							利用者と当方との間の通知または連絡は、当方の定める方法によって行うものとします。◯◯◯
						</p>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl font-bold mb-4">第13条(権利義務の譲渡の禁止)</h2>
						<p>
							利用者は、当方の書面による事前の承諾なく、利用契約上の地位または本規約に基づく権利もしくは義務を第三者に譲渡し、または担保に供することはできません。
						</p>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl font-bold mb-4">第14条(準拠法・裁判管轄)</h2>
						<ol className="list-decimal pl-6 space-y-2">
							<li>本規約の解釈にあたっては、日本法を準拠法とします。</li>
							<li>
								本サービスに関して紛争が生じた場合には、◯◯◯を専属的合意管轄とします。
							</li>
						</ol>
					</section>

					<p className="mt-8 text-sm text-gray-600">制定日: ◯◯◯◯年◯◯月◯◯日</p>
					<p className="text-sm text-gray-600">最終更新日: ◯◯◯◯年◯◯月◯◯日</p>
				</div>
			</main>
		</div>
	);
}

import { ServiceTitle } from "@/components/service-title";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "プライバシーポリシー | Honey Portion Poker",
	description: "Honey Portion Pokerのプライバシーポリシーです。",
};

export default function PrivacyPage() {
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
				<h1 className="text-3xl font-bold mb-8">プライバシーポリシー</h1>

				<div className="prose prose-slate max-w-none">
					<p className="mb-4">
						◯◯◯(以下「当方」といいます。)は、本サービスにおける利用者の個人情報を含む利用者情報の取扱いについて、以下のとおりプライバシーポリシー(以下「本ポリシー」といいます。)を定めます。
					</p>

					<section className="mb-8">
						<h2 className="text-2xl font-bold mb-4">第1条(収集する情報)</h2>
						<p className="mb-2">当方は、本サービスの提供にあたり、以下の情報を収集することがあります。</p>
						<ol className="list-decimal pl-6 space-y-2">
							<li>
								<strong>アクセス情報</strong>
								<ul className="list-disc pl-6 mt-1">
									<li>IPアドレス</li>
									<li>ブラウザの種類</li>
									<li>アクセス日時</li>
									<li>閲覧ページ</li>
									<li>リファラ情報</li>
								</ul>
							</li>
							<li>
								<strong>利用状況に関する情報</strong>
								<ul className="list-disc pl-6 mt-1">
									<li>ルームの作成・参加状況</li>
									<li>入力された見積もり値</li>
									<li>その他、本サービスの利用に関する情報</li>
								</ul>
							</li>
							<li>
								<strong>Cookie及び類似技術による情報</strong>
								<ul className="list-disc pl-6 mt-1">
									<li>Google Analyticsによるアクセス解析情報</li>
									<li>◯◯◯</li>
								</ul>
							</li>
						</ol>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl font-bold mb-4">第2条(情報収集の目的)</h2>
						<p className="mb-2">当方が情報を収集する目的は、以下のとおりです。</p>
						<ol className="list-decimal pl-6 space-y-2">
							<li>本サービスの提供、維持、保護及び改善のため</li>
							<li>本サービスの利用状況の分析及び統計データの作成のため</li>
							<li>本サービスに関する不正行為の防止及び検出のため</li>
							<li>本サービスに関する重要なお知らせ等の配信のため</li>
							<li>サーバーやシステムの保守、障害対応のため</li>
							<li>◯◯◯</li>
						</ol>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl font-bold mb-4">第3条(個人情報の管理)</h2>
						<ol className="list-decimal pl-6 space-y-2">
							<li>
								当方は、利用者の個人情報を正確かつ最新の状態に保ち、個人情報への不正アクセス・紛失・破損・改ざん・漏洩などを防止するため、必要かつ適切な措置を講じます。
							</li>
							<li>
								当方は、個人情報の取扱いを外部に委託する場合には、委託先に対して適切な監督を行います。
							</li>
						</ol>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl font-bold mb-4">第4条(個人情報の第三者提供)</h2>
						<ol className="list-decimal pl-6 space-y-2">
							<li>
								当方は、次に掲げる場合を除いて、あらかじめ利用者の同意を得ることなく、第三者に個人情報を提供することはありません。
								<ol className="list-decimal pl-6 mt-2 space-y-1">
									<li>法令に基づく場合</li>
									<li>人の生命、身体または財産の保護のために必要がある場合であって、本人の同意を得ることが困難であるとき</li>
									<li>公衆衛生の向上または児童の健全な育成の推進のために特に必要がある場合であって、本人の同意を得ることが困難であるとき</li>
									<li>国の機関もしくは地方公共団体またはその委託を受けた者が法令の定める事務を遂行することに対して協力する必要がある場合であって、本人の同意を得ることにより当該事務の遂行に支障を及ぼすおそれがあるとき</li>
								</ol>
							</li>
						</ol>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl font-bold mb-4">第5条(Cookie及びアクセス解析ツール)</h2>
						<ol className="list-decimal pl-6 space-y-2">
							<li>
								本サービスでは、サービスの利用状況を把握し、サービス向上のためにGoogle Analyticsを使用しています。
							</li>
							<li>
								Google Analyticsは、Cookieを使用して利用者の情報を収集します。この情報は匿名で収集されており、個人を特定するものではありません。
							</li>
							<li>
								Google Analyticsによるデータ収集を無効にするには、
								<a
									href="https://tools.google.com/dlpage/gaoptout"
									target="_blank"
									rel="noopener noreferrer"
									className="text-blue-600 hover:underline"
								>
									Google アナリティクス オプトアウト アドオン
								</a>
								をご利用ください。
							</li>
							<li>
								Google Analyticsの利用規約及びプライバシーポリシーについては、Google Analyticsのサイトをご確認ください。
							</li>
						</ol>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl font-bold mb-4">第6条(データの保存期間)</h2>
						<ol className="list-decimal pl-6 space-y-2">
							<li>
								ルームデータ及び関連情報は、最終アクセスから30日間保存されます。
							</li>
							<li>
								30日間アクセスがなかったルームのデータは、自動的に削除されます。
							</li>
							<li>
								アクセスログ等のデータは、◯◯◯の期間保存されます。
							</li>
						</ol>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl font-bold mb-4">第7条(利用者の権利)</h2>
						<p className="mb-2">
							利用者は、当方に対して以下の権利を有します。ただし、本サービスは登録不要のサービスであるため、個人を特定できない場合があります。
						</p>
						<ol className="list-decimal pl-6 space-y-2">
							<li>個人情報の開示を求める権利</li>
							<li>個人情報の訂正、追加または削除を求める権利</li>
							<li>個人情報の利用の停止を求める権利</li>
							<li>◯◯◯</li>
						</ol>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl font-bold mb-4">第8条(子どもの個人情報)</h2>
						<p>
							当方は、13歳未満の子どもから意図的に個人情報を収集することはありません。◯◯◯
						</p>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl font-bold mb-4">第9条(プライバシーポリシーの変更)</h2>
						<ol className="list-decimal pl-6 space-y-2">
							<li>
								当方は、必要に応じて、本ポリシーを変更することがあります。
							</li>
							<li>
								本ポリシーの変更は、変更後のプライバシーポリシーが本サービス上に掲載された時点で効力を生じるものとします。
							</li>
							<li>
								本ポリシーの変更後も本サービスを利用し続けることにより、利用者は変更後のプライバシーポリシーに同意したものとみなされます。
							</li>
						</ol>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl font-bold mb-4">第10条(お問い合わせ)</h2>
						<p>
							本ポリシーに関するお問い合わせは、以下の窓口までお願いいたします。
						</p>
						<div className="mt-4 pl-4">
							<p>◯◯◯</p>
							<p>メールアドレス: ◯◯◯</p>
						</div>
					</section>

					<p className="mt-8 text-sm text-gray-600">制定日: ◯◯◯◯年◯◯月◯◯日</p>
					<p className="text-sm text-gray-600">最終更新日: ◯◯◯◯年◯◯月◯◯日</p>
				</div>
			</main>
		</div>
	);
}

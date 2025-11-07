import { ServiceTitle } from "@/components/service-title";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "プライバシーポリシー - Honey Portion Poker",
	description: "Honey Portion Poker のプライバシーポリシー",
};

export default function PrivacyPage() {
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
				<h2 className="text-3xl font-bold mb-6">プライバシーポリシー</h2>

				<p className="mb-6 text-sm text-gray-600">
					最終更新日: {new Date().toLocaleDateString("ja-JP")}
				</p>

				<div className="space-y-8">
					<section>
						<h3 className="text-xl font-bold mb-3">基本方針</h3>
						<p>
							◯◯◯（以下「当方」といいます）は、Honey Portion
							Poker（以下「本サービス」といいます）において、ユーザーの個人情報の保護を重要な責務と考え、個人情報保護法その他の関係法令を遵守し、本プライバシーポリシーに従って適切に取り扱います。
						</p>
					</section>

					<section>
						<h3 className="text-xl font-bold mb-3">1. 収集する情報</h3>

						<div className="ml-4 space-y-4">
							<div>
								<h4 className="font-bold mb-2">1.1 サービス利用時の情報</h4>
								<p className="mb-2">
									本サービスでは、以下の情報を収集する場合があります：
								</p>
								<ul className="list-disc list-inside space-y-1 ml-4">
									<li>ルーム名、参加者名など、ユーザーが入力した情報</li>
									<li>
										プランニングポーカーの投票結果、タスク名など、サービス利用に関する情報
									</li>
									<li>ルームの作成日時、最終アクセス日時</li>
									<li>◯◯◯</li>
								</ul>
							</div>

							<div>
								<h4 className="font-bold mb-2">
									1.2 自動的に収集される情報（アクセス解析ツール）
								</h4>
								<p className="mb-2">
									本サービスでは、Google
									Analyticsを使用してアクセス解析を行っています。Google
									Analyticsは、Cookieを使用して以下の情報を収集します：
								</p>
								<ul className="list-disc list-inside space-y-1 ml-4">
									<li>IPアドレス（匿名化されています）</li>
									<li>ブラウザの種類とバージョン</li>
									<li>デバイスの種類</li>
									<li>アクセス日時</li>
									<li>閲覧ページ</li>
									<li>リファラ情報</li>
								</ul>
								<p className="mt-2">
									Google Analyticsの利用規約およびプライバシーポリシーについては、
									<a
										href="https://marketingplatform.google.com/about/analytics/terms/jp/"
										target="_blank"
										rel="noopener noreferrer"
										className="text-blue-600 hover:underline"
									>
										Google Analyticsの利用規約
									</a>
									および
									<a
										href="https://policies.google.com/privacy"
										target="_blank"
										rel="noopener noreferrer"
										className="text-blue-600 hover:underline"
									>
										Googleプライバシーポリシー
									</a>
									をご確認ください。
								</p>
							</div>
						</div>
					</section>

					<section>
						<h3 className="text-xl font-bold mb-3">2. 情報の利用目的</h3>
						<p className="mb-2">収集した情報は、以下の目的で利用します：</p>
						<ul className="list-disc list-inside space-y-1 ml-4">
							<li>本サービスの提供、運営、維持のため</li>
							<li>本サービスの改善、新機能の開発のため</li>
							<li>利用状況の分析、統計データの作成のため</li>
							<li>問い合わせへの対応のため</li>
							<li>規約違反行為への対応のため</li>
							<li>◯◯◯</li>
						</ul>
					</section>

					<section>
						<h3 className="text-xl font-bold mb-3">3. 情報の第三者提供</h3>
						<p className="mb-2">
							当方は、以下の場合を除き、ユーザーの同意なく第三者に個人情報を提供しません：
						</p>
						<ul className="list-disc list-inside space-y-1 ml-4">
							<li>法令に基づく場合</li>
							<li>
								人の生命、身体または財産の保護のために必要がある場合であって、本人の同意を得ることが困難である場合
							</li>
							<li>
								公衆衛生の向上または児童の健全な育成の推進のために特に必要がある場合であって、本人の同意を得ることが困難である場合
							</li>
							<li>
								国の機関もしくは地方公共団体またはその委託を受けた者が法令の定める事務を遂行することに対して協力する必要がある場合であって、本人の同意を得ることにより当該事務の遂行に支障を及ぼすおそれがある場合
							</li>
						</ul>
						<p className="mt-2">
							なお、前述のGoogle
							Analyticsの利用により、Googleに対して情報が提供されます。
						</p>
					</section>

					<section>
						<h3 className="text-xl font-bold mb-3">4. データの保存と削除</h3>
						<p className="mb-2">
							本サービスで作成されたルームおよび関連データは、最終アクセスから30日間保存されます。
						</p>
						<p>
							30日間アクセスがない場合、該当ルームおよび関連データは自動的に削除されます。
						</p>
					</section>

					<section>
						<h3 className="text-xl font-bold mb-3">5. Cookieの使用について</h3>
						<p className="mb-2">
							本サービスでは、以下の目的でCookieを使用しています：
						</p>
						<ul className="list-disc list-inside space-y-1 ml-4">
							<li>Google Analyticsによるアクセス解析</li>
							<li>◯◯◯</li>
						</ul>
						<p className="mt-2">
							ブラウザの設定でCookieを無効にすることも可能ですが、その場合、本サービスの一部機能が利用できなくなる可能性があります。
						</p>
					</section>

					<section>
						<h3 className="text-xl font-bold mb-3">6. セキュリティ</h3>
						<p>
							当方は、収集した情報の漏洩、滅失または毀損の防止その他の安全管理のために必要かつ適切な措置を講じます。◯◯◯
						</p>
					</section>

					<section>
						<h3 className="text-xl font-bold mb-3">7. 個人情報の開示・訂正・削除</h3>
						<p>
							ユーザーは、当方に対して、個人情報の開示、訂正、削除等を求めることができます。◯◯◯
						</p>
					</section>

					<section>
						<h3 className="text-xl font-bold mb-3">8. お問い合わせ</h3>
						<p>
							本プライバシーポリシーに関するお問い合わせは、以下の連絡先までお願いいたします。
						</p>
						<p className="mt-2 ml-4">◯◯◯</p>
					</section>

					<section>
						<h3 className="text-xl font-bold mb-3">
							9. プライバシーポリシーの変更
						</h3>
						<p>
							当方は、必要に応じて本プライバシーポリシーを変更することがあります。変更後のプライバシーポリシーは、本サービス上に掲載した時点から効力を生じるものとします。
						</p>
					</section>

					<section>
						<h3 className="text-xl font-bold mb-3">10. 適用範囲</h3>
						<p>
							本プライバシーポリシーは、本サービスにおいてのみ適用されます。本サービスからリンクされている外部サイトにおける個人情報の取り扱いについては、当方は一切の責任を負いません。
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

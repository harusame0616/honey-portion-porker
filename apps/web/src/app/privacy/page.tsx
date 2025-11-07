import { ServiceTitle } from "@/components/service-title";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
	description: "Honey Portion Pokerのプライバシーポリシー",
	title: "プライバシーポリシー | Honey Portion Poker",
};

export default function PrivacyPage() {
	return (
		<div className="flex flex-col min-h-screen">
			<header className="max-w-4xl w-full mx-auto p-4">
				<h1>
					<Link href="/">
						<ServiceTitle />
					</Link>
				</h1>
			</header>

			<main className="flex-1 max-w-4xl w-full mx-auto p-4">
				<h1 className="text-3xl font-bold mb-8">プライバシーポリシー</h1>

				<div className="prose prose-slate max-w-none space-y-6">
					<p className="text-sm text-gray-600">
						最終更新日：◯◯◯◯年◯◯月◯◯日
					</p>

					<section>
						<p>
							◯◯◯◯（以下「当方」といいます）は、本ウェブサイト上で提供するサービス（以下「本サービス」といいます）における、ユーザーの個人情報の取扱いについて、以下のとおりプライバシーポリシー（以下「本ポリシー」といいます）を定めます。
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-bold mt-8 mb-4">第1条（個人情報）</h2>
						<p>
							「個人情報」とは、個人情報保護法にいう「個人情報」を指すものとし、生存する個人に関する情報であって、当該情報に含まれる氏名、生年月日、住所、電話番号、連絡先その他の記述等により特定の個人を識別できる情報及び容貌、指紋、声紋にかかるデータ、及び健康保険証の保険者番号などの当該情報単体から特定の個人を識別できる情報（個人識別情報）を指します。
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-bold mt-8 mb-4">
							第2条（個人情報の収集方法）
						</h2>
						<p>
							当方は、本サービスの利用状況を把握するため、以下の情報を取得する場合があります。
						</p>
						<ul className="list-disc pl-6 space-y-2">
							<li>
								アクセス情報（IPアドレス、ブラウザの種類、オペレーティングシステム、リファラー情報、閲覧したページ、滞在時間など）
							</li>
							<li>Cookie及び類似技術を用いて収集される情報</li>
						</ul>
					</section>

					<section>
						<h2 className="text-2xl font-bold mt-8 mb-4">
							第3条（個人情報を収集・利用する目的）
						</h2>
						<p>当方が個人情報を収集・利用する目的は、以下のとおりです。</p>
						<ol className="list-decimal pl-6 space-y-2">
							<li>本サービスの提供・運営のため</li>
							<li>
								ユーザーからのお問い合わせに回応するため（本人確認を行うことを含む）
							</li>
							<li>
								本サービスの利用状況を分析し、サービスの維持、改善、新機能の開発のため
							</li>
							<li>
								メンテナンス、重要なお知らせなど必要に応じたご連絡のため
							</li>
							<li>
								利用規約に違反したユーザーや、不正・不当な目的でサービスを利用しようとするユーザーの特定をし、ご利用をお断りするため
							</li>
							<li>上記の利用目的に付随する目的</li>
						</ol>
					</section>

					<section>
						<h2 className="text-2xl font-bold mt-8 mb-4">第4条（利用目的の変更）</h2>
						<ol className="list-decimal pl-6 space-y-2">
							<li>
								当方は、利用目的が変更前と関連性を有すると合理的に認められる場合に限り、個人情報の利用目的を変更するものとします。
							</li>
							<li>
								利用目的の変更を行った場合には、変更後の目的について、当方所定の方法により、ユーザーに通知し、または本ウェブサイト上に公表するものとします。
							</li>
						</ol>
					</section>

					<section>
						<h2 className="text-2xl font-bold mt-8 mb-4">
							第5条（個人情報の第三者提供）
						</h2>
						<ol className="list-decimal pl-6 space-y-2">
							<li>
								当方は、次に掲げる場合を除いて、あらかじめユーザーの同意を得ることなく、第三者に個人情報を提供することはありません。ただし、個人情報保護法その他の法令で認められる場合を除きます。
								<ol className="list-decimal pl-6 mt-2 space-y-1">
									<li>
										人の生命、身体または財産の保護のために必要がある場合であって、本人の同意を得ることが困難であるとき
									</li>
									<li>
										公衆衛生の向上または児童の健全な育成の推進のために特に必要がある場合であって、本人の同意を得ることが困難であるとき
									</li>
									<li>
										国の機関もしくは地方公共団体またはその委託を受けた者が法令の定める事務を遂行することに対して協力する必要がある場合であって、本人の同意を得ることにより当該事務の遂行に支障を及ぼすおそれがあるとき
									</li>
								</ol>
							</li>
							<li>
								前項の定めにかかわらず、次に掲げる場合には、当該情報の提供先は第三者に該当しないものとします。
								<ol className="list-decimal pl-6 mt-2 space-y-1">
									<li>
										当方が利用目的の達成に必要な範囲内において個人情報の取扱いの全部または一部を委託する場合
									</li>
									<li>
										合併その他の事由による事業の承継に伴って個人情報が提供される場合
									</li>
								</ol>
							</li>
						</ol>
					</section>

					<section>
						<h2 className="text-2xl font-bold mt-8 mb-4">
							第6条（個人情報の開示）
						</h2>
						<ol className="list-decimal pl-6 space-y-2">
							<li>
								当方は、本人から個人情報の開示を求められたときは、本人に対し、遅滞なくこれを開示します。ただし、開示することにより次のいずれかに該当する場合は、その全部または一部を開示しないこともあり、開示しない決定をした場合には、その旨を遅滞なく通知します。
								<ol className="list-decimal pl-6 mt-2 space-y-1">
									<li>
										本人または第三者の生命、身体、財産その他の権利利益を害するおそれがある場合
									</li>
									<li>当方の業務の適正な実施に著しい支障を及ぼすおそれがある場合</li>
									<li>その他法令に違反することとなる場合</li>
								</ol>
							</li>
							<li>
								前項の定めにかかわらず、履歴情報および特性情報などの個人情報以外の情報については、原則として開示いたしません。
							</li>
						</ol>
					</section>

					<section>
						<h2 className="text-2xl font-bold mt-8 mb-4">
							第7条（個人情報の訂正および削除）
						</h2>
						<ol className="list-decimal pl-6 space-y-2">
							<li>
								ユーザーは、当方の保有する自己の個人情報が誤った情報である場合には、当方が定める手続きにより、当方に対して個人情報の訂正、追加または削除（以下「訂正等」といいます）を請求することができます。
							</li>
							<li>
								当方は、ユーザーから前項の請求を受けてその請求に応じる必要があると判断した場合には、遅滞なく、当該個人情報の訂正等を行うものとします。
							</li>
							<li>
								当方は、前項の規定に基づき訂正等を行った場合、または訂正等を行わない旨の決定をしたときは遅滞なく、これをユーザーに通知します。
							</li>
						</ol>
					</section>

					<section>
						<h2 className="text-2xl font-bold mt-8 mb-4">
							第8条（個人情報の利用停止等）
						</h2>
						<ol className="list-decimal pl-6 space-y-2">
							<li>
								当方は、本人から、個人情報が、利用目的の範囲を超えて取り扱われているという理由、または不正の手段により取得されたものであるという理由により、その利用の停止または消去（以下「利用停止等」といいます）を求められた場合には、遅滞なく必要な調査を行います。
							</li>
							<li>
								前項の調査結果に基づき、その請求に応じる必要があると判断した場合には、遅滞なく、当該個人情報の利用停止等を行います。
							</li>
							<li>
								当方は、前項の規定に基づき利用停止等を行った場合、または利用停止等を行わない旨の決定をしたときは、遅滞なく、これをユーザーに通知します。
							</li>
							<li>
								前2項にかかわらず、利用停止等に多額の費用を有する場合その他利用停止等を行うことが困難な場合であって、ユーザーの権利利益を保護するために必要なこれに代わるべき措置をとれる場合は、この代替策を講じるものとします。
							</li>
						</ol>
					</section>

					<section>
						<h2 className="text-2xl font-bold mt-8 mb-4">第9条（Cookie及びアクセス解析ツール）</h2>
						<ol className="list-decimal pl-6 space-y-2">
							<li>
								本サービスでは、サービスの利用状況を把握するために、Google
								Analyticsを使用しています。Google
								Analyticsは、Cookieを使用して利用者の情報を収集します。
							</li>
							<li>
								Google Analyticsにより収集された情報は、Google
								社のプライバシーポリシーに基づいて管理されます。Google
								Analyticsの利用規約及びプライバシーポリシーに関する説明については、Google
								Analyticsのサイトをご覧ください。
							</li>
							<li>
								Google Analyticsについて、詳しくは
								<a
									href="https://marketingplatform.google.com/about/analytics/terms/jp/"
									target="_blank"
									rel="noopener noreferrer"
									className="text-blue-600 hover:underline"
								>
									こちら
								</a>
								をご参照ください。
							</li>
							<li>
								ユーザーは、ブラウザの設定によりCookieの受け取りを拒否することができます。ただし、Cookieを拒否した場合、本サービスの一部機能がご利用いただけなくなる場合があります。
							</li>
						</ol>
					</section>

					<section>
						<h2 className="text-2xl font-bold mt-8 mb-4">
							第10条（プライバシーポリシーの変更）
						</h2>
						<ol className="list-decimal pl-6 space-y-2">
							<li>
								本ポリシーの内容は、法令その他本ポリシーに別段の定めのある事項を除いて、ユーザーに通知することなく、変更することができるものとします。
							</li>
							<li>
								当方が別途定める場合を除いて、変更後のプライバシーポリシーは、本ウェブサイトに掲載したときから効力を生じるものとします。
							</li>
						</ol>
					</section>

					<section>
						<h2 className="text-2xl font-bold mt-8 mb-4">第11条（お問い合わせ窓口）</h2>
						<p>本ポリシーに関するお問い合わせは、下記の窓口までお願いいたします。</p>
						<div className="bg-gray-50 p-4 rounded mt-4">
							<p>連絡先：◯◯◯◯</p>
							<p>メールアドレス：◯◯◯◯@◯◯◯◯</p>
						</div>
					</section>
				</div>
			</main>

			<footer className="max-w-4xl w-full mx-auto p-4 mt-8 border-t text-center text-sm text-gray-600">
				<p>© ◯◯◯◯ Honey Portion Poker</p>
			</footer>
		</div>
	);
}

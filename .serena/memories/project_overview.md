# プロジェクト概要

## プロジェクトについて

**Honey Portion Porker** は、アジャイル開発においてチケットの見積もりを行うためのプランニングポーカーツールです。

### 主な特徴

- **ログイン不要**: ページにアクセスするだけで簡単にプランニングポーカーが開始できる
- **URL 共有だけで参加可能**: ルーム URL を共有するだけでチームメンバーが参加できる
- **設定の保存**: ルームの設定（カードの種類、ルール等）は自動で保存される
- **リアルタイム同期**: ユーザーが選択したカードや操作は全参加者にリアルタイムで反映される
- **シンプルな UX**: 直感的な操作で誰でもすぐに使い始められる

### ユースケース

チームでアジャイル開発を行う際、ユーザーストーリーやタスクの相対的な作業量を見積もるためのセッションで使用します。各メンバーがカードを選択し、全員が選択し終わったら一斉に公開することで、バイアスのない見積もりを実現します。

## 技術スタック

| カテゴリ               | 技術                        |
| ---------------------- | --------------------------- |
| パッケージマネージャー | pnpm@10.18.2                |
| モノレポ管理           | Turbo Repo & pnpm workspace |
| フレームワーク         | Next.js 15 App Router       |
| CSS                    | Tailwind CSS                |
| UI ライブラリ          | shadcn/ui                   |
| バリデーション         | Valibot                     |
| フォーム               | React Hook Form             |
| テストランナー         | Vitest                      |
| コンポーネントテスト   | Testing Library             |
| E2E テスト             | Playwright                  |
| 認証・DB               | Supabase                    |
| Linter/Formatter       | Biome                       |
| 時刻ライブラリ         | date-fns                    |
| アイコン               | lucide-react                |
| アニメーション         | Motion                      |
| Result 型              | @harusame0616/result        |

## ワークスペース構成

Turborepo によるモノレポ構成:

```
honey-portion-porker/
├── packages/
│   ├── web/                    # Next.js 15 アプリケーション
│   │   ├── src/
│   │   │   ├── app/           # App Router のページとレイアウト
│   │   │   │   ├── rooms/     # ルーム関連のページ
│   │   │   │   │   └── [roomId]/  # 動的ルート: 個別ルームページ
│   │   │   │   ├── _actions/  # Server Actions
│   │   │   │   ├── _resources/ # リソース（画像など）
│   │   │   │   └── api/       # API Routes
│   │   │   ├── components/    # 共通コンポーネント
│   │   │   │   └── ui/        # shadcn/ui コンポーネント
│   │   │   ├── lib/           # ユーティリティ・ライブラリ
│   │   │   │   └── supabase/  # Supabase クライアント
│   │   │   └── tests/         # テストファイル
│   │
│   └── e2e/                    # Playwright E2E テスト
│       ├── tests/             # E2E テストファイル
│       └── playwright.config.ts
│
├── docs/                       # プロジェクトドキュメント
├── supabase/                   # Supabase 設定・マイグレーション
└── .serena/                    # Serena MCP メモリ
```

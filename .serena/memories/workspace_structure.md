# ワークスペース構成

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
│   │   ├── database.types.ts  # Supabase 型定義
│   │   ├── next.config.ts     # Next.js 設定
│   │   └── vitest.config.ts   # Vitest 設定
│   │
│   └── e2e/                    # Playwright E2E テスト
│       ├── tests/             # E2E テストファイル
│       └── playwright.config.ts
│
├── supabase/                   # Supabase 設定・マイグレーション
├── .serena/                    # Serena MCP メモリ
├── turbo.json                  # Turborepo 設定
└── pnpm-workspace.yaml         # pnpm ワークスペース設定
```

## 主要ディレクトリの説明

- **`packages/web/src/app`**: Next.js の App Router によるページ定義。各ディレクトリがルートに対応
- **`packages/web/src/app/rooms/[roomId]`**: プランニングポーカーのルーム画面（動的ルート）
- **`packages/web/src/app/_actions`**: Server Actions（データの作成・更新・削除）
- **`packages/web/src/components`**: 複数ページで使用される共通コンポーネント
- **`packages/web/src/lib`**: ユーティリティ関数やライブラリ設定
- **`packages/e2e/tests`**: Playwright による E2E テスト

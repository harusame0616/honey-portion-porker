# よく使うコマンド

## 必須コマンド（タスク完了前に実行）

```bash
# コード修正後・コミット前に必ず実行（lint + format の統合コマンド）
pnpm validate:fix
```

## 開発コマンド

```bash
# 開発サーバー起動
pnpm dev

# ビルド
pnpm build
```

## テストコマンド

```bash
# すべてのテスト実行（Vitest）
pnpm test

# テスト UI モードで実行
pnpm test:ui

# テスト Watch モードで実行
pnpm test:watch

# E2E テスト実行（Playwright）
cd apps/e2e
pnpm test
```

## Linting / Formatting コマンド

```bash
# Lint チェック
pnpm lint:check

# Lint 自動修正
pnpm lint:write

# Format チェック
pnpm format:check

# Format 自動修正
pnpm format:write

# Lint + Format チェック
pnpm lint-format:check

# Lint + Format 自動修正
pnpm lint-format:write

# 統合検証＆修正（推奨）
pnpm validate:fix
```

## システムユーティリティコマンド（macOS）

```bash
# ファイル一覧
ls -la

# ディレクトリ移動
cd <path>

# ファイル検索
find . -name "*.tsx"

# 文字列検索
grep -r "search-term" .

# Git 操作
git status
git add .
git commit -m "message"
git push
```

## Turborepo について

- すべてのコマンドは `turbo run` 経由で各パッケージに委譲される
- ルートの `package.json` で定義されたコマンドを使用
- キャッシュ機能により、変更がない場合は高速に完了

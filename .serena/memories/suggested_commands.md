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

## Linting / Formatting / Type Check コマンド

```bash
# Lint チェック
pnpm lint:check

# Lint 自動修正
pnpm lint:fix

# Format チェック
pnpm format:check

# Format 自動修正
pnpm format:fix

# Type チェック
pnpm type:check

# 統合チェック（lint + format + type）
pnpm validate:check

# 統合修正（lint + format の自動修正）
pnpm validate:fix
```

## npm スクリプト統一仕様

以下の命名規則で統一されています：

- `format:check` - フォーマットチェック
- `format:fix` - フォーマット自動修正
- `lint:check` - Lint チェック
- `lint:fix` - Lint 自動修正
- `type:check` - 型チェック（Next.js の web パッケージでは警告メッセージのみ）
- `validate:check` - lint & format & type のチェック
- `validate:fix` - lint & format の自動修正

**重要**: 以前の `*:write` 形式は廃止され、`*:fix` に統一されました。

## パフォーマンス

Turborepo のキャッシュ機能により、変更がない場合は高速に完了：
- チェック系タスクはキャッシュ有効（例: lint:check: 447ms → 51ms）
- 修正系タスクはキャッシュ無効（確実に実行）

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

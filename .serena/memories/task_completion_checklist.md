# タスク完了時のチェックリスト

## 必須タスク

### 1. コード品質チェック

```bash
# lint + format の自動修正を実行
pnpm validate:fix
```

- エラーが無くなるまで修正を行う
- 3 回修正を試みて治らなかったらユーザーに確認

### 2. テスト実行（該当する場合）

```bash
# ユニット/統合テスト
pnpm test

# E2E テスト（必要に応じて）
cd apps/e2e
pnpm test
```

### 3. ビルド確認（必要に応じて）

```bash
pnpm build
```

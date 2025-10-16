# クイックリファレンス

## 必須コマンド

```bash
# コード修正後・コミット前に必ず実行
pnpm validate:fix

# 開発サーバー起動
pnpm dev

# テスト実行
pnpm test
```

## 重要な設計原則

1. **RSC ファースト**: Server Components を最優先、インタラクションが必要な場合のみ Client Components
2. **コロケーション**: 関連ファイルは同じディレクトリに配置、複数箇所で使う場合のみ分離
3. **型安全性**: Valibot で searchParams/params を必ずバリデーション
4. **エラーハンドリング**: Result 型（`@harusame0616/result`）を使用
5. **テスト**: Fixture パターンを優先、統合テストを重視

## ファイル命名規則

- **ファイル名**: kebab-case（例: `user-profile.tsx`）
- **Server Actions**: `do-entity-action.ts`（例: `create-user-action.ts`）
- **関数名**: camelCase（例: `createUserAction`）

## Container/Presenter パターン

- **Container**: データフェッチ、データ加工、ビジネスロジック、条件分岐
- **Presenter**: 表示ロジックのみ（props で受け取ったデータを表示）

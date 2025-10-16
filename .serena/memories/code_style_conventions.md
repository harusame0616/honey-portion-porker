# コードスタイル・規約

## 開発原則

- You Aren't Gonna Need It (YAGNI)
- Single Responsibility Principle
- Keep it Simple, Stupid (KISS)
- Avoid Hasty Abstractions (AHA)
- Don't repeat yourself (DRY) - ただし、AHA を優先

## ファイル命名規則

- **ファイル名**: kebab-case（例: `user-profile.tsx`）
- **関数名**: camelCase（例: `createUserAction`）
- **Server Actions**: `do-entity-action.ts`（例: `create-user-action.ts`）

## コンポーネント設計

### 基本方針

1. **RSC ファースト**: Server Components を最優先に実装
2. **Container/Presenter パターン**: データフェッチとプレゼンテーションを分離
3. **コロケーション**: 関連ファイルは同じディレクトリに配置、複数箇所で使う場合のみ分離

### Container の責務

- データフェッチ
- データ加工（ソート、フィルタリング、集計など）
- ビジネスロジック
- 条件分岐（0件判定、エラーハンドリング、認証チェックなど）

### Presenter の責務

- props で受け取ったデータを表示するだけ
- 純粋なプレゼンテーション層

### Client Component を使う場合

- ユーザーインタラクションが必要な場合
- ブラウザ API が必要な場合
- React hooks が必要な場合

## 型定義

- **型の定義**: `type` で定義する
- **Enum を避ける**: const Object で定義（バンドルサイズ削減のため）
- **関数の戻り値**: 必ず明示する

```typescript
// ✅ 推奨: const Object
const UserRole = {
  Admin: "admin",
  User: "user",
  Guest: "guest",
} as const;

type UserRole = (typeof UserRole)[keyof typeof UserRole];
```

## バリデーション

- すべての入力データを Valibot でバリデーション
- `v.safeParse` を使用してエラーハンドリング
- エラーメッセージは日本語で具体的に記述

## データ操作

### 3つのパターン

1. **Server Action (`"use server"`)**: データの作成・更新・削除（Mutation）
2. **Route Handler**: Client Component からのデータ取得
3. **通常のサーバー関数**: Server Component からのデータ取得

### 認証・認可

- データ取得やデータ更新では必ず適切な認証、認可チェックを行う

## Biome 設定

- **インデントスタイル**: タブ
- **クォートスタイル**: ダブルクォート
- **自動整理**: インポート、属性、キーの自動ソート有効

## タイムゾーン処理

- `@date-fns/tz` の `TZDate` を使用してタイムゾーンを明示的に指定
- サーバーは UTC、ユーザー環境は JST のため、明示的な指定が必要

```typescript
import { TZDate } from "@date-fns/tz";

// JST での現在日時を取得
const now = new TZDate(new Date(), "Asia/Tokyo");
```

## その他の規約

- **useEffect を避ける**: エスケープハッチとして極力避ける
- **コメント**: コードで自明なことは避け、「なぜ」そうしているのかを説明

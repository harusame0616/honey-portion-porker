# 開発ガイドライン

## 原則の遵守

- You Aren't Gonna Need It(YAGNI)
- Single Responsibility Principle
- Keep it Simple, Stupid(KISS)
- Avoid Hasty Abstractions(AHA)
- Don't repeat yourself(DRY)
  - ただし、Avoid Hasty Abstractions を優先する。

## コンポーネント設計

### 設計方針

#### Server Component ファースト

- Server Component を最優先に実装する
- RSC の末端のコンポーネントでデータフェッチを行う

#### Client Component

以下の場合に Client Component を活用する

- ユーザーインタラクションが必要な場合（クリック、フォーム入力など）
- ブラウザ API が必要な場合（localStorage、geolocation など）
- React hooks（useState、useEffect など）が必要な場合

#### Container/Presenter パターン

**Container の責務:**

- データフェッチ
- データ加工（ソート、フィルタリング、集計など）
- ビジネスロジック
- 条件分岐（0 件判定、エラーハンドリング、認証チェックなど）

**Presenter の責務:**

- props で受け取ったデータを表示するだけ
- 純粋なプレゼンテーション層

**Container の分割パターン:**

サーバーでの処理とクライアントでの処理が必要になる場合は、Container を分割することも可能：

- **ServerContainer**: データフェッチ、データ加工などのサーバーサイド処理
- **ClientContainer**: インタラクティブなロジック、状態管理などのクライアントサイド処理

```tsx
// users-server-container.tsx
export async function UsersServerContainer() {
  const user = await getUsers();

  return <UserDetailClientContainer user={user} />;
}

// users-client-container.tsx (RCC)
("use client");

export function UsersClientContainer({ user }: { user: User }) {
  const { filteredUsers, filter } = useFilteredUser();

  return <UsersPresenter user={filteredUsers} onFilterChange={filter} />;
}
```

### コーディング規約

#### Page / Layout コンポーネントの責務と型定義

**Page コンポーネントの責務:**

- searchParams / params の取得とバリデーション
- バリデーション済みのパラメーターを実際のページコンポーネントに渡す
- **実際の表示ロジックは別のページコンポーネント（例: `UsersPage`）に委譲する**

**型定義:**

- **Page コンポーネント**: Next.js 組み込みの `PageProps` を使用
- **Layout コンポーネント**: Next.js 組み込みの `LayoutProps` を使用

```typescript
// page.tsx
import type { PageProps } from "next";
import * as v from "valibot";
import { notFound } from "next/navigation";

// layout の場合は PageProps が LayoutProps に変わるだけで基本的な考え方は同じ
export default async function Page(props: PageProps<"/foos/[fooId]">) {
  const { fooId } = await props.params; // 組み込みの PageProps により正しい型付けがされている
  const rawSearchParams = await props.searchParams;

  const searchParamsParseResult = v.safeParse(
    v.object({
      bar: v.pipe(v.string(), v.regex(/\d+/), v.transform(Number)),
    }),
    rawSearchParams
  );

  if (!searchParamsParseResult.success) {
    return notFound();
  }

  return (
    <UserPage
      userId={paramsResult.output.userId}
      bar={searchParamsParseResult.output.bar}
    />
  );
}
```

#### データフェッチパターン

```typescript
// page.tsx
export default async function Page(props: PageProps<"/">) {
  return <FooPage />;
}

// foo-page.tsx
export default async function FooPage() {
  return (
    <div>
      <Suspense fallback={<BarSkeleton />}>
        <BarContainer />
      </Suspense>
      <Suspense fallback={<HogeSkeleton />}>
        <HogeContainer />
      </Suspense>
    </div>
  );
}

// foo.tsx
export default async function BarContainer() {
  const bar = await getBar();

  return <BarPresenter bar={bar} />;
}
```

#### ファイル分割と配置

**関連するファイルは同一ファイルに配置する:**

Container / Presenter / Skeleton / そのファイルでのみ使用するヘルパー関数、型定義など

ただし以下のような場合はファイルの分離を検討する。

1. Server Component と Client Component の分離が必要な場合
2. Client Component から呼び出す Server Action
3. 複数箇所から呼び出される共通の関数、共通のコンポーネント
4. ファイルが肥大している
   - 目安：500 行以上
5. テスタビリティー確保のため
   - 基本的には結合テストを優先するため、外部に露出する必要のない関数はテストしないが、重要なロジックや複雑なロジックのテストが必要になる場合など

#### ファイル構成パターン

**コロケーション例:**

```
app/rooms/[roomId]/
├── _foo/
│   ├── foo.tsx                    # FooContainer, FooSkeleton
│   ├── foo-presenter.tsx          # Presenter（RCC の場合は分離）
│   ├── foo-presenter.test.tsx
│   ├── use-foo-bar.ts
│   ├── use-foo-bar.test.ts
├── _bar/
│   ├── bar.tsx                   # BarContainer, BarPresenter, BarSkeleton （全て RSC）
│   ├── bar.test.tsx
└── page.tsx                      # Next.js のページファイル
```

**プライベートフォルダ（`_` プレフィックス）の活用:**

- Next.js のルーティング対象から除外される
- ページに関連するコンポーネントをコロケーションできる

#### ファイル命名規則

- **ファイル名**: kebab-case（例: `user-profile.tsx`）
- **関数名**: camelCase（例: `createUserAction`）

### UI 実装ガイドライン

#### アクセシビリティ

- セマンティック HTML を使用する
- 適切な ARIA 属性を設定する
- キーボードナビゲーションを完全にサポートする
- 色のコントラスト比を WCAG AA レベル以上に保つ
- タップターゲットは最小 44x44px

#### レスポンシブデザイン

- モバイルファースト
- Tailwind CSS のレスポンシブユーティリティを活用する
- ブレークポイント: sm(640px), md(768px), lg(1024px), xl(1280px), 2xl(1536px)

#### パフォーマンス最適化

- 不要な再レンダリングを防ぐ（React.memo、useMemo の適切な使用）
- 画像の遅延読み込みと next/image の活用
- Suspense を使用した段階的レンダリング

#### UX 向上施策

**スケルトンスクリーン:**

- CLS（Cumulative Layout Shift）防止を最優先とする
- 実際のコンテンツと同一のレイアウト構造を維持
- Suspense と組み合わせて実装

**楽観的更新:**

- Server Action の実行前に UI を即座に更新する
- エラー時のロールバック処理を実装する
- useOptimistic フックの活用

**マイクロインタラクション:**

- ホバー、フォーカス、アクティブ状態の視覚的フィードバック
- スムーズなトランジション（transition-all duration-200 等）

## データ取得とミューテーション

### 設計方針

#### 認証・認可

**データ取得やデータ更新では必ず適切な認証、認可チェックを行う**

#### データ操作の 3 つのパターン

以下の 3 つのパターンを目的に応じて使い分けます：

| パターン               | 用途                                 | 呼び出し元 | "use server" |
| ---------------------- | ------------------------------------ | ---------- | ------------ |
| **Server Action**      | データの作成・更新・削除（Mutation） | RSC / RCC  | ✅ 必須      |
| **Route Handler**      | Client Component からのデータ取得    | RCC のみ   | ❌ 不要      |
| **通常のサーバー関数** | Server Component からのデータ取得    | RSC のみ   | ❌ 不要      |

#### Server Action（"use server"）: Mutation 専用

- 例: データの作成、更新、削除
- ファイル配置: 使用するファイルと同じファイルに配置（ファイル分割の原則に従う）
  - クライアントコンポーネントから呼び出す場合はファイルを分ける
- 関数名: `doEntityAction`（例: `createUserAction`）
- 必ず `"use server"` ディレクティブを使用

#### Route Handler: Client Component からのデータ取得

- 例: 検索クエリに応じたデータ取得、無限スクロールのデータ読み込み
- ファイル配置: `app/api/` ディレクトリ配下に配置
- 関数名: doEntityRouteHandler として定義し export で as を使って HTTP メソッドとして公開

- `"use server"` ディレクティブは**不要**

**実装例:**

```typescript
// app/api/users/route.ts
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function getUsers(request: Request) {
  // 認証チェック
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  // データ取得
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");

  const { data } = await supabase
    .from("users")
    .select("*")
    .eq("userId", user.id)
    .ilike("name", `%${query}%`);

  return NextResponse.json({ users: data ?? [] });
}

export { getUsers as GET };
```

#### 通常のサーバー関数: Server Component からのデータ取得

- 例: データのフェッチ、検索、集計
- ファイル配置: 使用するファイルと同じファイルに配置（ファイル分割の原則に従う）
- RSC から直接呼び出す
- `"use server"` ディレクティブは**不要**（使用してはいけない）

### コーディング規約

#### データ取得関数の実装

**必ず認証チェックを実装する**

```typescript
// ✅ Good: Container と同一ファイルに配置（1箇所でのみ使用）
// user-list-container.tsx

import { createClient } from "@/lib/supabase/server";
import type { User } from "@/types/user";

// データ取得関数（このファイルでのみ使用）
async function getUsers(): Promise<User[]> {
  // 認証チェック
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return []; // または throw new Error("認証が必要です")
  }

  // データ取得
  const { data } = await supabase
    .from("users")
    .select("*")
    .eq("userId", user.id)
    .order("name", { ascending: true });

  return data ?? [];
}

// Container
export async function UserListContainer() {
  const users = await getUsers();

  return <UserListPresenter users={users} />;
}
```

**別ファイルに分離すべき場合:**

- 複数の Container から呼び出される共通のデータ取得関数
- ファイルが 500 行を超えて可読性が低下する場合

#### Server Actions の実装

**ファイル構造と命名規則:**

- アクションファイル: `do-entity-action.ts`（例: `create-user-action.ts`）
- アクション関数名: `doEntityAction`（例: `createUserAction`）

**Server Action の責務:**

- `"use server"` ディレクティブを使用
- Valibot によるバリデーション
- Next.js 固有の機能を処理（revalidatePath、cookies など）
- try-catch による包括的なエラー処理を実装
- `@harusame0616/result` の Result 型を返す
- FormData または Object を受け取る

**実装例:**

```typescript
// create-user-action.ts
"use server";

import { fail, succeed } from "@harusame0616/result";
import type { Result } from "@harusame0616/result";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import * as v from "valibot";

const createUserSchema = v.object({
  name: v.string(),
  email: v.pipe(v.string(), v.email()),
  role: v.optional(v.string(), "user"),
});

type CreateUserInput = v.InferOutput<typeof createUserSchema>;
type CreateUserResult = Result<{ id: string }, string>;

export async function createUserAction(
  input: CreateUserInput
): Promise<CreateUserResult> {
  try {
    // バリデーション
    const validated = v.parse(createUserSchema, input);

    // Supabase クライアント取得
    const supabase = await createClient();

    // ユーザー作成
    const { data, error } = await supabase
      .from("users")
      .insert({
        name: validated.name,
        email: validated.email,
        role: validated.role,
      })
      .select()
      .single();

    if (error) {
      return fail(`ユーザーの作成に失敗しました: ${error.message}`);
    }

    // キャッシュの再検証
    revalidatePath("/users");

    return succeed({ id: data.id });
  } catch (error) {
    if (error instanceof v.ValiError) {
      return fail("入力値が不正です");
    }
    return fail("予期しないエラーが発生しました");
  }
}
```

## 型定義とバリデーション

### 設計方針

#### Enum を避ける

TypeScript の Enum はランタイムコードを生成しバンドルサイズを増加させるため、const Object で定義する。

#### useEffect を避ける

useEffect はエスケープハッチとして極力避ける。Server Components やデータフェッチライブラリで代替できないか検討する。

### コーディング規約

#### 型定義

- **型の定義**: type で定義する
- **Enum を避ける**: const Object で定義を行う

```typescript
// ✅ 推奨: const Object
const UserRole = {
  Admin: "admin",
  User: "user",
  Guest: "guest",
} as const;

type UserRole = (typeof UserRole)[keyof typeof UserRole];
```

#### 関数の型定義

- **関数の戻り値**: 明示する

```typescript
// ✅ Good
function getUser(userId: string): Promise<User> {
  // ...
}
```

## バリデーション

すべての入力データを Valibot でバリデーションする：

- `v.safeParse` を使用してエラーハンドリング
- エラーメッセージは日本語で具体的に記述

## タイムゾーン処理

### 設計方針

Vercel のサーバーサイドは UTC で動作するが、ユーザー環境は JST で動作する。UTC と JST の間には 9 時間の時差があり、日付の境界で問題が発生するため、明示的にタイムゾーンを指定する。

### コーディング規約

- `@date-fns/tz` の `TZDate` を使用してタイムゾーンを明示的に指定

```typescript
import { TZDate } from "@date-fns/tz";

// JST での現在日時を取得
const now = new TZDate(new Date(), "Asia/Tokyo");

// JST での特定の日時を作成
const startDate = new TZDate(2024, 0, 1, 0, 0, 0, 0, "Asia/Tokyo"); // 2024年1月1日 00:00:00 JST
```

**注意点:**

- date-fns v4 では `toZonedTime` などの従来の関数は非推奨
- `TZDate` コンストラクタを使用することで、サーバー（UTC）でも JST 基準の日付計算が可能
- データベースのクエリで日付範囲を指定する際も `TZDate` を使用してタイムゾーンのズレを防止

## その他の規約

### コメント

- コードで自明なことは避け、「なぜ」そうしているのかを説明

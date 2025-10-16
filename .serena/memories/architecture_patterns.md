# アーキテクチャパターン

## ディレクトリ構造パターン

### コロケーション例

```
app/rooms/[roomId]/
├── _foo/
│   ├── foo.tsx                    # FooContainer, FooSkeleton
│   ├── foo-presenter.tsx          # Presenter（RCC の場合は分離）
│   ├── foo-presenter.test.tsx
│   ├── use-foo-bar.ts
│   ├── use-foo-bar.test.ts
├── _bar/
│   ├── bar.tsx                   # BarContainer, BarPresenter, BarSkeleton（全て RSC）
│   ├── bar.test.tsx
└── page.tsx                      # Next.js のページファイル
```

### プライベートフォルダ（`_` プレフィックス）の活用

- Next.js のルーティング対象から除外される
- ページに関連するコンポーネントをコロケーションできる

## Page / Layout コンポーネントの責務

### Page コンポーネントの責務

- searchParams / params の取得とバリデーション
- バリデーション済みのパラメーターを実際のページコンポーネントに渡す
- **実際の表示ロジックは別のページコンポーネント（例: `UsersPage`）に委譲する**

### 型定義

- **Page コンポーネント**: Next.js 組み込みの `PageProps` を使用
- **Layout コンポーネント**: Next.js 組み込みの `LayoutProps` を使用

```typescript
import type { PageProps } from "next";
import * as v from "valibot";
import { notFound } from "next/navigation";

export default async function Page(props: PageProps<"/foos/[fooId]">) {
  const { fooId } = await props.params;
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

  return <UserPage userId={fooId} bar={searchParamsParseResult.output.bar} />;
}
```

## データフェッチパターン

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

// bar-container.tsx
export default async function BarContainer() {
  const bar = await getBar();
  return <BarPresenter bar={bar} />;
}
```

## Server Action パターン

```typescript
// create-user-action.ts
"use server";

import { fail, succeed } from "@harusame0616/result";
import type { Result } from "@harusame0616/result";
import * as v from "valibot";

export async function createUserAction(
  input: CreateUserInput
): Promise<CreateUserResult> {
  try {
    // バリデーション
    const validated = v.parse(createUserSchema, input);
    
    // 認証チェック
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return fail("認証が必要です");
    }
    
    // データ操作
    // ...
    
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

## ファイル分割の判断基準

関連するファイルは同一ファイルに配置するが、以下の場合はファイル分離を検討:

1. Server Component と Client Component の分離が必要な場合
2. Client Component から呼び出す Server Action
3. 複数箇所から呼び出される共通の関数、共通のコンポーネント
4. ファイルが肥大している（目安：500行以上）
5. テスタビリティー確保のため

# テストガイドライン

## 基本原則

- **振る舞いベース**: 内部実装でなく外部から見える動作をテスト
- **統合テスト優先**: Mock は最小限、実際の依存関係でテスト
- **ユーザー視点**: ユーザーが要素を見つける方法でクエリ
- **テストの独立性**: 各テストが他に依存しない
- **テストの再現性**: 同じ条件で常に同じ結果
- **AHA > DRY**: 早すぎる抽象化を避ける（YAGNI 原則）
- **AAA パターン**: Arrange - Act - Assert
- **Fixture 優先**: beforeEach/afterEach より test.extend を使用
- **日本語で記述**: テストケースの説明は日本語で記述
- **分岐を避ける**: テストコード内で if による条件分岐を避ける

## describe と test の使用

```typescript
// ❌ 避ける: まとめるだけの describe
describe("ユーザー機能", () => {
  test("ユーザーを作成できる", () => {});
});

// ✅ 推奨: フラットな構造
test("ユーザーを作成できる", () => {});

// ✅ OK: 並列処理制御が必要な場合
describe.sequential("データベース操作", () => {
  test("ユーザーを作成する", async () => {});
});
```

## クエリの優先順位

```typescript
// 1. アクセシブルな方法（優先）
getByRole("button", { name: "送信" });
getByLabelText("メールアドレス");
getByPlaceholderText("名前を入力");
getByText("こんにちは");

// 2. 最後の手段
getByTestId("submit-button"); // 避ける
```

## Fixture パターン（優先）

test.extend を使って共通のセットアップを定義する。beforeEach/afterEach は避ける。

### Vitest での Fixture

```typescript
// my-test.ts - fixture 定義
import { test as baseTest } from "vitest";

export const test = baseTest.extend<{
  testUser: { id: string; name: string };
}>({
  testUser: async ({}, use) => {
    const user = await createTestUser({ name: "Test User" });
    await use(user);
    await deleteTestUser(user.id);
  },
});

// user.test.ts - 使用例
import { test } from "./my-test";

test("ユーザーが投稿を作成できる", async ({ testUser }) => {
  const post = await createPost({ userId: testUser.id, content: "Hello" });
  expect(post.userId).toBe(testUser.id);
});
```

### Playwright での Fixture

```typescript
import { test as baseTest } from "@playwright/test";

export const test = baseTest.extend<{
  authenticatedPage: Page;
}>({
  authenticatedPage: async ({ page }, use) => {
    await page.goto("/login");
    await page.getByLabel("メールアドレス").fill("test@example.com");
    await page.getByRole("button", { name: "ログイン" }).click();
    await use(page);
  },
});
```

## テストレベル別の対象

### E2E（Playwright）

主要なユーザーフロー、クリティカルパス、複数ページにまたがる操作

### Integration/Medium（Vitest）

Server Actions、Route Handlers、データベース操作、外部 API 連携

### Component（Testing Library）

クライアントコンポーネント、クライアントコンポーネントと結合したカスタムフック

### Unit/Small（Vitest）

ユーティリティ関数、カスタムフック
ただしいずれもコンポーネントテストや結合テストを優先し、エッジケースや結合テストでテストできない部分のみを実施する

## 実装の詳細をテストしない

```typescript
// ❌ 悪い例
expect(component.state.count).toBe(1);
expect(wrapper.find("button").prop("onClick")).toBeDefined();

// ✅ 良い例
await userEvent.click(screen.getByRole("button", { name: "増加" }));
expect(screen.getByText("カウント: 1")).toBeInTheDocument();
```

## 非同期処理

```typescript
// ✅ findBy を優先（自動待機）
const element = await screen.findByText("読み込み完了");

// 複雑な条件のみ waitFor
await waitFor(() => {
  expect(screen.getByText("複雑な条件")).toBeInTheDocument();
});
```

## モック

外部 API やバックエンドのモックには MSW を使用。Mock は最小限に。

```typescript
// ❌ 過度なモック
vi.mock("./utils");
vi.mock("./api");
vi.mock("./components/Button");

// ✅ 必要な部分のみ
vi.mock("./api");
```

## デバッグ

```typescript
screen.debug(); // 現在のDOM構造
screen.debug(screen.getByRole("button")); // 特定要素
screen.logTestingPlaygroundURL(); // ブラウザで確認
```

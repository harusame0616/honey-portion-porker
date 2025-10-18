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

基本的にはフラットな構造で `test()` を使用する。並列処理制御が必要な場合のみ `describe.sequential()` を使用する。

```typescript
// ✅ 推奨: フラットな構造
test("ユーザーを作成できる", () => {});

// ✅ OK: 並列処理制御が必要な場合のみ
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
import { test as baseTest, vi } from "vitest";
import userEvent from "@testing-library/user-event";

// モックや userEvent などの共通セットアップを fixture として定義
export const test = baseTest.extend<{
  user: ReturnType<typeof userEvent.setup>;
  mockOnSubmit: ReturnType<typeof vi.fn<() => void>>;
}>({
  user: async ({}, use) => {
    await use(userEvent.setup());
  },
  mockOnSubmit: async ({}, use) => {
    await use(vi.fn<() => void>());
  },
});

// 使用例
test("ボタンをクリックすると onSubmit が呼ばれる", async ({ user, mockOnSubmit }) => {
  render(<MyComponent onSubmit={mockOnSubmit} />);
  await user.click(screen.getByRole("button"));
  expect(mockOnSubmit).toHaveBeenCalled();
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
    await use(page); // use() は await する
  },
});
```

## テストレベル別の対象

### E2E（Playwright）

- 主要なユーザーフロー、クリティカルパス、複数ページにまたがる操作
- E2E テストは実行コストが高いため、効率化のため別の観点でも１つのテストの流れの中でまとめられるのはまとめて実施する
- テストの可読性のため `test.step` で処理のまとまりに名前をつける

```typescript
test("foo チェックボックスがチェックされていない場合、名前入力フィールドが無効", async ({
  page,
}) => {
  await test.step("foo チェックボックスの初期状態が未チェックなことを確認", async () => {
    const fooCheckbox = page.getByRole("checkbox", { name: "foo" });
    await expect(fooCheckbox).not.toBeChecked();
  });

  await test.step("名前入力フィールドが無効なことを確認", async () => {
    const nameInput = page.getByRole("textbox", { name: "名前" });
    await expect(nameInput).toBeDisabled();
  });
});
```

### Component/Small（Testing Library）

- クライアントコンポーネント、クライアントコンポーネントと結合したカスタムフック
- １つのテストにつき１つの観点で実施

### Integration/Medium（Vitest）

- Server Actions、Route Handlers、データベース操作、外部 API 連携
- １つのテストにつき１つの観点で実施

### Unit/Small（Vitest）

- ユーティリティ関数、カスタムフック
- １つのテストにつき１つの観点で実施
- コンポーネントテストや結合テストを優先し、エッジケースや結合テストでテストできない部分のみを実施する

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

Mock は最小限に。必要な部分のみモックする。

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

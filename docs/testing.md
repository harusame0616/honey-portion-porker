# テスト実装ガイドライン

## テスト作成の原則

1. **振る舞いベースのテスト**: 内部実装ではなく、外部から観測可能な振る舞いをテストする
2. **統合テストの優先**: 極力 Mock を避け、実際の依存関係を含めた統合テストを作成する
3. **網羅性と効率性のバランス**: 重要なパスを確実にカバーしつつ、冗長なテストは避ける
4. **可読性の重視**: テストコードは仕様書として機能するよう、明確で理解しやすい記述を心がける
5. **Fixture 優先**: beforeEach/afterEach よりも fixture を使った形を優先する
6. **早すぎる抽象化を避ける**: 必要になるまで抽象化は行わない（YAGNI原則）

## テストの記述方法

### describe と test の使用

- **基本**: `describe` と `test` を使用してテストを記述する
- **describe の使用制限**: まとめるためだけの `describe` によるグループ化は避ける
- **describe を使う場合**: 並列処理の制御などで必要な場合のみ利用する

```typescript
// ❌ 避けるべき: 単にグループ化するためだけの describe
describe("ユーザー機能", () => {
  describe("作成", () => {
    test("ユーザーを作成できる", () => {
      // ...
    });
  });

  describe("更新", () => {
    test("ユーザーを更新できる", () => {
      // ...
    });
  });
});

// ✅ 推奨: フラットな構造
test("ユーザーを作成できる", () => {
  // ...
});

test("ユーザーを更新できる", () => {
  // ...
});

// ✅ OK: 並列処理制御が必要な場合
describe.sequential("データベース操作", () => {
  test("ユーザーを作成する", async () => {
    // ...
  });

  test("作成したユーザーを更新する", async () => {
    // ...
  });
});
```

## テスト作成プロセス

### 1. 対象の分析

- テスト対象のコードを詳細に分析
- 入力と出力の仕様を明確化
- 依存関係と副作用の特定

### 2. テストケースの設計

- 正常系のテストケース
- 異常系のテストケース
- 境界値のテストケース
- エッジケースとコーナーケース

### 3. テストの実装

- Arrange-Act-Assert パターンの適用
- 適切なテストダブル（Mock、Stub、Spy）の選択と使用
- データ駆動テストの活用（test.each）
- 非同期処理の適切なハンドリング

### 4. 品質保証

- テストの独立性を確保（各テストが他のテストに依存しない）
- テストの再現性を確保（同じ条件で常に同じ結果）
- テストの実行速度を考慮
- エラーメッセージの明確化

## テストレベル別の指針

### E2E（Playwright）

- 主要なユーザーフロー
- クリティカルパスのみ
- 複数ページにまたがる操作
- 例: ユーザー登録 → 一覧表示 → 詳細確認

### Component（Testing Library + Vitest）

- クライアントコンポーネントの振る舞い
- ユーザーインタラクション
- e2e でカバーされない細かい動作
- 状態管理
- イベントハンドリング

### Integration/Medium（Vitest）

- Server Actions
- Route Handlers
- 外部 API 連携
- データベース操作

### Unit/Small（Vitest）

- ユーティリティ関数
- カスタムフック
- ビジネスロジック
- 純粋関数

## Fixture パターン（優先）

### Vitest での Fixture 使用

```typescript
import { describe, it, expect, test } from "vitest";

describe("テスト対象名", () => {
  // test.extend を使った fixture の定義を優先
  const myTest = test.extend<{
    testUser: User;
    testDb: Database;
  }>({
    testUser: async ({}, use) => {
      // セットアップ
      const user = await createTestUser();

      // テストでの使用
      await use(user);

      // クリーンアップ
      await deleteTestUser(user);
    },
    testDb: async ({}, use) => {
      const db = await setupTestDatabase();
      await use(db);
      await cleanupTestDatabase(db);
    },
  });

  myTest("期待される振る舞いの説明", async ({ testUser, testDb }) => {
    // Arrange
    // Act
    // Assert
  });
});
```

### Playwright での Fixture 使用

```typescript
import { test as base, expect } from "@playwright/test";

// カスタムfixtureの型定義
type MyFixtures = {
  authenticatedPage: Page;
  testData: TestData;
};

// fixture を拡張
const test = base.extend<MyFixtures>({
  authenticatedPage: async ({ page }, use) => {
    // ログイン処理
    await page.goto("/login");
    await page.fill("#email", "test@example.com");
    await page.fill("#password", "password");
    await page.click('button[type="submit"]');

    await use(page);

    // 必要に応じてクリーンアップ
  },

  testData: async ({}, use) => {
    const data = await createTestData();
    await use(data);
    await cleanupTestData(data);
  },
});

test("ユーザーフローのテスト", async ({ authenticatedPage, testData }) => {
  // fixture を使ったテスト実装
  await authenticatedPage.goto("/dashboard");
  // ...
});
```

## モック戦略

### MSW (Mock Service Worker) の活用

外部 API やバックエンドのモックには MSW を使用する：

```typescript
// mocks/handlers.ts
import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("/api/users/:id", ({ params }) => {
    return HttpResponse.json({
      id: params.id,
      name: "Test User",
      email: "test@example.com",
    });
  }),

  http.post("/api/users", async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ id: "123", ...body }, { status: 201 });
  }),
];

// test-setup.ts
import { setupServer } from "msw/node";
import { handlers } from "./handlers";

export const server = setupServer(...handlers);

// テストファイル内
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// 特定のテストでハンドラをオーバーライド
it("エラーレスポンスのテスト", () => {
  server.use(
    http.get("/api/users/:id", () => {
      return HttpResponse.json({ error: "User not found" }, { status: 404 });
    })
  );
  // テスト実行
});
```

## カバレッジ目標

### 推奨カバレッジ率

- **全体**: 80%以上
- **ビジネスロジック**: 90%以上
- **ユーティリティ関数**: 95%以上
- **UI コンポーネント**: 70%以上
- **E2E テスト**: クリティカルパスの 100%

## テストの注意事項

- テストコードにも format と lint を実行し、エラーが無くなるまで修正を行う
- 日本語でテストケースの説明を記述する
- 既存のテストパターンとの一貫性を保つ
- テストの保守性を考慮し、過度に複雑なテストは避ける

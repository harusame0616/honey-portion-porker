# テスト実装ガイドライン

## テスト作成の原則

1. **振る舞いベースのテスト**: 内部実装ではなく、外部から観測可能な振る舞いをテストする
2. **統合テストの優先**: 極力 Mock を避け、実際の依存関係を含めた統合テストを作成する
3. **Fixture 優先**: beforeEach/afterEach よりも fixture を使った形を優先する
4. **早すぎる抽象化を避ける**: 必要になるまで抽象化は行わない（YAGNI原則）

## テストレベル別の指針

### E2E（Playwright）

- 主要なユーザーフロー
- クリティカルパスのみ
- 複数ページにまたがる操作

### Component（Testing Library + Vitest）

- クライアントコンポーネントの振る舞い
- ユーザーインタラクション
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

## describe と test の使用

- **基本**: `describe` と `test` を使用
- **describe の使用制限**: まとめるためだけの `describe` によるグループ化は避ける
- **describe を使う場合**: 並列処理の制御などで必要な場合のみ利用

```typescript
// ❌ 避けるべき: 単にグループ化するためだけの describe
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

## Fixture パターン

### Vitest での Fixture 使用

```typescript
const myTest = test.extend<{
  testUser: User;
}>({
  testUser: async ({}, use) => {
    const user = await createTestUser();
    await use(user);
    await deleteTestUser(user);
  },
});

myTest("期待される振る舞いの説明", async ({ testUser }) => {
  // テスト実装
});
```

### Playwright での Fixture 使用

```typescript
type MyFixtures = {
  authenticatedPage: Page;
};

const test = base.extend<MyFixtures>({
  authenticatedPage: async ({ page }, use) => {
    // ログイン処理
    await use(page);
  },
});
```

## MSW (Mock Service Worker) の活用

外部 API やバックエンドのモックには MSW を使用する

## カバレッジ目標

- **全体**: 80%以上
- **ビジネスロジック**: 90%以上
- **ユーティリティ関数**: 95%以上
- **UI コンポーネント**: 70%以上
- **E2E テスト**: クリティカルパスの 100%

## その他

- テストコードにも format と lint を実行
- 日本語でテストケースの説明を記述
- 既存のテストパターンとの一貫性を保つ

# TDD 규칙 — React Component Generator

## 원칙

테스트는 **비즈니스 가치가 있는 코드만** 작성합니다. 불필요한 테스트는 유지보수 비용만 증가시킵니다.

1. **Red → Green → Refactor** 사이클 준수
2. **컴포넌트별 테스트:** 단위 테스트 + 통합 테스트 분리
3. **실제 동작 테스트:** Mock 남용 금지. 특히 `fetch`, `react-live` 실행은 통합 테스트에서 정확히 검증

---

## 테스트 대상 우선순위

### Tier 1: 필수 (반드시 테스트)

- **server/index.ts (API 로직)**
  - callAnthropic() → 성공/실패/에러 처리
  - callGoogle() → 성공/실패/MAX_TOKENS 처리
  - stripCodeFences() / ensureRenderCall() → 정확한 코드 정제
  - resolveApiKey() → env vs 클라이언트 키 우선순위
  - /api/generate 엔드포인트 → 요청/응답 검증

- **src/hooks/useComponentGenerator.ts**
  - generate() → API 호출, 상태 업데이트, 에러 처리
  - removeComponent() → 특정 ID 삭제
  - clearAll() → 초기화

### Tier 2: 추천 (시간 여유 시)

- **src/components 각 컴포넌트**
  - 상태 변화 (click, input 이벤트)
  - prop 변경 시 렌더링
  - 조건부 렌더링 (로딩, 에러, 빈 상태)

### Tier 3: 선택 (선택적)

- 스타일 테스트 (변경 빈도 낮음, 직관적 검증 가능)
- 접근성 테스트 (아직 요구사항 명확하지 않음)

---

## 테스트 프레임워크

### 현재 설정

- **Bun 내장:** `bun test` (기본 제공, 별도 설치 불필요)
- **Optional:** Vitest (필요 시 추후 도입)

### 초기 설정

```bash
# package.json에 추가
"test": "bun test src/**/*.test.ts server/**/*.test.ts"
```

---

## 테스트 작성 패턴

### Server 테스트 (server/index.test.ts)

```typescript
import { describe, it, expect, beforeEach, afterEach } from 'bun:test';

describe('callAnthropic', () => {
  it('should return code when API succeeds', async () => {
    const prompt = 'button component';
    const apiKey = 'test-key';
    
    // 실제 API 호출은 E2E 테스트로, 단위 테스트에서는 fetch mock
    const code = await callAnthropic(prompt, apiKey);
    expect(code).toContain('render(');
  });

  it('should throw on API error', async () => {
    const prompt = 'test';
    const apiKey = 'invalid';
    
    expect(async () => {
      await callAnthropic(prompt, apiKey);
    }).toThrow();
  });
});

describe('stripCodeFences', () => {
  it('should remove markdown code fences', () => {
    const input = '```jsx\nconst Btn = () => <button />\n```';
    const expected = 'const Btn = () => <button />';
    expect(stripCodeFences(input)).toBe(expected);
  });
});
```

### Hook 테스트 (src/hooks/useComponentGenerator.test.ts)

```typescript
import { renderHook, act } from '@testing-library/react';
import { useComponentGenerator } from './useComponentGenerator';

describe('useComponentGenerator', () => {
  it('should initialize with empty components', () => {
    const { result } = renderHook(() => useComponentGenerator());
    expect(result.current.components).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });

  it('should add component after generate', async () => {
    const { result } = renderHook(() => useComponentGenerator());
    
    await act(async () => {
      await result.current.generate('button', 'api-key', 'anthropic');
    });

    expect(result.current.components.length).toBeGreaterThan(0);
  });

  it('should remove component by id', () => {
    const { result } = renderHook(() => useComponentGenerator());
    // setup: 컴포넌트 추가
    // then: removeComponent(id)
    // expect: components에서 제거됨
  });
});
```

---

## Test-First Workflow

1. **테스트 작성** (실패해야 함)
   ```typescript
   it('should handle 429 rate limit error', async () => {
     // 아직 구현 안 됨
   });
   ```

2. **최소 코드 구현** (테스트 통과)
   ```typescript
   if (status === 429) {
     throw new Error('Rate limited');
   }
   ```

3. **리팩토링** (테스트 유지, 코드 정리)

---

## Mock 규칙

- **fetch:** Bun의 `bun:test` 내 mock 또는 `globalThis.fetch` 오버라이드
- **react-live:** 실제 실행은 통합 테스트에서. 코드 생성 로직만 단위 테스트
- **타이머:** React hooks (useState, useEffect)는 테스트 시 동기 처리

---

## CI/CD 연동

```bash
# GitHub Actions 예시
- name: Run tests
  run: bun test

- name: Build
  run: bun run build
```

---

## 규칙 유지

- 테스트 작성 후 **반드시 `bun test` 통과 확인**
- 기존 테스트를 깨뜨리는 수정은 금지 (테스트도 함께 수정)
- 테스트 커버리지: 목표 60% 이상 (Tier 1 우선)

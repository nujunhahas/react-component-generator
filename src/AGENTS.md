@CLAUDE.md 링크는 하위에 있습니다.

# Frontend: React Components — AGENTS.md

React 19 + TypeScript + Vite. react-live 런타임 렌더링.

## Module Context

src/는 컴포넌트 기반 아키텍처:
- **App.tsx** — 메인 레이아웃, 상태 관리 (apiKey, provider, components)
- **components/** — UI 컴포넌트 (PromptInput, ComponentCard, LivePreview, CodeView)
- **hooks/useComponentGenerator** — 컴포넌트 생성 로직 (서버 요청, 상태)
- **types/index.ts** — TypeScript 타입 정의 (Provider, Component)
- **App.css** — 스타일 (레트로 테마)

## Tech Stack & Constraints

- **React 19 + TypeScript strict mode.**
- **Vite:** Fast HMR. vite.config.ts는 건드리지 않음.
- **react-live:** 클라이언트 생성 코드 실행. 제약:
  - 생성된 코드는 import 불가, JSX 파일도 불가.
  - React 글로벌로 제공 (React.useState, React.useEffect).
  - inline styles만 사용 (CSS modules, CSS 파일 import 금지).
  - TypeScript 문법 불가 (type annotation, interface, as cast 등).
  - 반드시 render() 호출로 종료.

- **Styling:** CSS-in-JS (inline styles) + App.css (글로벌 스타일).
- **상태 관리:** React hooks (useState, useEffect). Context 불필요.

## Implementation Patterns

**컴포넌트 구조:**
```tsx
interface ComponentProps {
  /* ... */
}

function MyComponent({ }: ComponentProps) {
  const [state, setState] = useState('');
  
  return (
    <div style={{ /* inline */ }}>
      {/* JSX */}
    </div>
  );
}

export default MyComponent;
```

**Server 통신 (hooks/useComponentGenerator.ts):**
- fetch('/api/generate', { method: 'POST', body: JSON.stringify({...}) })
- 응답: { code: string } 또는 { error: string }
- isLoading, error 상태 관리

**react-live 마운팅 (LivePreview.tsx):**
- <LiveProvider code={code}><LiveEditor /> <LivePreview /></LiveProvider>
- 에러 발생 시 error boundary 처리

## Testing Strategy

개발: `bun run dev` → http://localhost:5173

테스트할 흐름:
1. Provider 선택 (Anthropic/Google)
2. API 키 입력 (또는 .env 사용)
3. 프롬프트 입력 (e.g., "파스텔 버튼")
4. 생성된 코드가 react-live에서 렌더링되는지 확인
5. CodeView에서 코드 복사 가능
6. 재생성, 제거 동작 확인

HMR (핫 리로드)가 작동하는지 확인 (파일 변경 시 즉시 반영).

## Local Golden Rules

- **API 키 절대 브라우저 DevTools에 남기지 말 것.** 사용 후 즉시 삭제.
- **환경 변수 (VITE_*):** Vite는 VITE_ 프리픽스만 노출. .env는 보안 주의.
- **useComponentGenerator 훅:** 서버 에러(503, 429)도 처리. 사용자에게 친화적 메시지.
- **react-live 제약:** 생성 시스템 프롬프트(server/SYSTEM_PROMPT)와 일치해야 함. 타입 annotation 불가 강조.
- **CSS 클래스:** App.css에 정의. inline만 사용하는 것이 아니라, 글로벌 스타일(header, app 등)은 CSS 파일에서 관리.
- **TypeScript:** strict mode. any 사용 금지. as cast 없이 타입 안전.

## File Organization

```
src/
  App.tsx             — 메인 레이아웃
  App.css             — 글로벌 스타일 (레트로 테마)
  main.tsx            — React 마운트
  components/
    PromptInput.tsx   — 프롬프트 입력 + 생성 버튼
    ComponentCard.tsx — 컴포넌트 카드 (미리보기 + 코드)
    LivePreview.tsx   — react-live 미리보기
    CodeView.tsx      — 코드 전시 (복사 버튼)
  hooks/
    useComponentGenerator.ts — 상태 로직
  types/
    index.ts          — Provider, Component, 등
```

## Model & Compatibility

생성되는 JSX 코드 대상: react-live 런타임 (모듈 시스템 없음).
- Anthropic: claude-haiku-4-5-20251001 (빠르고 작은 응답)
- Google: gemini-2.5-flash

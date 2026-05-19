@CLAUDE.md 링크는 하위에 있습니다.

# React Component Generator — AGENTS.md

AI가 프롬프트로 React 컴포넌트를 즉시 생성합니다. 실시간 미리보기와 코드 제공.

## Operational Commands

프로젝트는 **Bun** 기반입니다. npm/yarn/pnpm 사용 금지.

- `bun install` — 의존성 설치
- `bun run dev` — API 서버(3002) + Vite(5173) 동시 실행
- `bun run server` — API 서버만 실행 (watch 모드)
- `bun build` — TypeScript 타입 체크 + Vite 빌드
- `bun lint` — ESLint 실행

환경 변수: `.env` 파일 (`.env.example` 기반)
- `ANTHROPIC_API_KEY` — Claude API 키 (선택)
- `GOOGLE_API_KEY` — Gemini API 키 (선택)

## Golden Rules

- **API 키 절대 하드코딩 금지.** 환경 변수 또는 클라이언트 입력만 사용.
- **SYSTEM_PROMPT 수정 시 주의:** react-live 런타임 제약 준수. JSX 코드는 TypeScript, import, 외부 모듈 불가.
- **Provider는 확장 가능하게:** 새로운 AI 모델 추가 시 `callProvider()` 함수 패턴 따를 것.
- **CORS:** server/index.ts의 CORS_HEADERS로 프론트엔드 요청 처리. 로컬 개발은 '*' 허용.
- **Error Handling:** API 실패(503, 429, 기타)는 사용자 친화적 메시지로 응답.

## Project Context

**비즈니스:** 개발자가 자연언어로 UI를 설계하고 즉시 보고 복사할 수 있는 워크벤치.

**Tech Stack:** Bun, React 19, TypeScript, Vite, react-live (런타임 렌더러).

**Key Flow:**
1. 사용자가 프롬프트 입력 (e.g., "파스텔 색 버튼") → PromptInput 컴포넌트
2. POST /api/generate 호출 (prompt, apiKey, provider)
3. server/index.ts가 AI API 호출 (Anthropic 또는 Google)
4. 응답 코드 정제 (stripCodeFences, ensureRenderCall)
5. react-live가 런타임에 코드 실행하여 미리보기 제공
6. 사용자가 코드 복사 또는 재생성

## Standards

**Commit Message:** Conventional Commits (feat, fix, refactor, docs, style, chore) + 한국어 설명.

**Code Style:** ESLint 통과. TypeScript strict mode.

**Maintenance:** 규칙과 코드가 괴리되면 AGENTS.md 업데이트를 제안하세요.

---

## Context Map — 하위 AGENTS.md

- **[server/](./server/AGENTS.md)** — API 프록시 로직, AI 프로바이더 통합
- **[src/](./src/AGENTS.md)** — React 컴포넌트 개발, react-live 제약

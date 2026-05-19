@CLAUDE.md 링크는 하위에 있습니다.

# Server: API Proxy — AGENTS.md

Bun API 서버 (포트 3002). Anthropic Claude / Google Gemini 프록시.

## Module Context

server/index.ts는 단일 파일. 역할:
- AI API 호출 추상화 (callAnthropic, callGoogle)
- CORS 처리 및 클라이언트 요청 라우팅
- 환경 변수 기반 API 키 관리
- 응답 코드 정제 (stripCodeFences, ensureRenderCall)

의존성: Bun 내장 (fetch, JSON, Bun.serve).

## Tech Stack & Constraints

- **Bun 전용:** Node.js 호환, 표준 API만 사용.
- **타입:** TypeScript. Record<Provider, T> 패턴으로 확장 가능하게.
- **API 응답:** JSON. 오류도 { error: string }.

## Implementation Patterns

**API 호출 흐름:**
1. resolveApiKey() → 클라이언트 키 또는 env 키 중 하나 선택
2. call{Provider}() → 실제 AI API 호출 (fetch)
3. stripCodeFences() + ensureRenderCall() → 응답 정제
4. JSON 응답 반환

**새로운 프로바이더 추가:**
```typescript
async function callNewProvider(prompt: string, apiKey: string): Promise<string> {
  const response = await fetch('https://...', { /* ... */ });
  if (!response.ok) throw new Error(`Error: ${response.status}`);
  const data = await response.json();
  return data./* 해당 필드 */;
}

// 루트 fetch 핸들러의 provider 조건문에 추가
provider === 'newprovider' ? await callNewProvider(...) : ...
```

## Testing Strategy

서버는 실제 API 호출이 필요. Bun watch 모드로 개발:
```bash
bun run server
```

테스트할 엔드포인트:
- GET /api/config → { envKeys: { anthropic: bool, google: bool } }
- POST /api/generate → { code: string } 또는 { error: string }

CORS OPTIONS 요청도 정상 처리되어야 함.

## Local Golden Rules

- **API 키는 응답에 포함하지 말 것.** envKeys는 boolean만 반환.
- **stripCodeFences:** ```jsx, ```tsx 등 제거. 마지막 ``` 도 제거.
- **ensureRenderCall:** render() 호출이 없으면 자동 추가. 함수 이름 추출 로직 유지.
- **에러 메시지:** 사용자 친화적. API 상태 코드별 메시지 (503 → 과부하, 429 → 레이트 리밋).
- **CORS_HEADERS:** 모든 응답에 포함. 브라우저가 크로스 오리진 요청 수락하도록.

## Dependencies & Versions

- 의존성 없음. Bun 런타임만 사용.
- Anthropic API v1 (x-api-key 헤더, anthropic-version: 2023-06-01).
- Google Gemini API v1beta (URL 파라미터에 키).

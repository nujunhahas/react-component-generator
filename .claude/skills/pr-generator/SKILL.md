---
name: pr-generator
description: 현재 브랜치에서 GitHub PR을 자동으로 생성합니다
context: fork
allowed-tools:
  - Read
  - Glob
  - Grep
  - Bash
---

# PR 생성기

현재 브랜치의 변경사항을 분석하여 GitHub PR을 자동으로 생성합니다.

## 동작 방식

### 1단계: 브랜치 정보 수집
```bash
git rev-parse --abbrev-ref HEAD          # 현재 브랜치
git rev-parse --short HEAD               # 현재 커밋 해시
git config user.name / user.email        # 사용자 정보
git log --oneline origin/main..HEAD -10  # main 대비 커밋 목록
```

### 2단계: 변경사항 분석
```bash
git diff origin/main --stat              # 변경 파일 요약
git diff origin/main --shortstat         # 삽입/삭제 통계
```

### 3단계: PR 제목/설명 생성

PR 템플릿(`references/pr-template.md`)을 기반으로:
- 브랜치명에서 제목 추출
- 커밋 메시지 분석
- 변경 파일 목록 추가
- 테스트 계획 섹션 작성

### 4단계: PR 생성
```bash
gh pr create \
  --title "생성된 제목" \
  --body "생성된 설명" \
  --base main \
  --draft (선택)
```

## 사용 방법

사용자가 "PR 만들어줘" 또는 "PR 생성해줘" 등으로 요청 시:

1. **현재 상태 확인:**
   - 현재 브랜치 확인
   - origin/main과의 커밋 차이 확인
   - 변경사항 요약

2. **PR 초안 제시:**
   - 제안 제목
   - 제안 설명 (템플릿 기반)
   - 변경 파일 목록

3. **사용자 승인:**
   - 제목/설명 수정 여부 확인
   - draft 모드 여부 확인
   - base 브랜치 확인

4. **PR 생성:**
   - gh pr create 실행
   - PR URL 반환

## 주의사항

- 반드시 현재 브랜치가 main이 아니어야 함
- origin/main이 최신 상태여야 함
- GitHub CLI(`gh`)로 인증된 상태여야 함

## 참고

- PR 템플릿: `./references/pr-template.md`
- 커밋 메시지 기반: Conventional Commits 형식 지원

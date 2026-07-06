# 브랜치 전략

이 저장소는 [GitHub Flow](https://docs.github.com/en/get-started/using-github/github-flow)를 따릅니다. `main`은 항상 배포 가능한 상태를 유지하고, 모든 변경은 짧게 사는 브랜치 + PR로 들어옵니다.

## 규칙

1. **`main`에 직접 push 금지.** 브랜치 보호 규칙으로 강제되어 있습니다 (PR을 통해서만 병합 가능).
2. **브랜치는 `main`에서 분기**하고, 아래 접두사 중 하나를 사용합니다.

   | 접두사 | 용도 | 예시 |
   |---|---|---|
   | `feature/` | 새 기능 추가 | `feature/scene-tag-search` |
   | `fix/` | 버그 수정 | `fix/pdf-export-overflow` |
   | `docs/` | 문서만 수정 | `docs/update-readme` |
   | `refactor/` | 동작 변화 없는 구조 개선 | `refactor/split-prompt-builder` |
   | `chore/` | 의존성/설정 등 잡무 | `chore/bump-next` |

3. **한 브랜치 = 한 PR = 하나의 논리적 변경.** 여러 개의 관련 없는 수정을 한 PR에 섞지 않습니다.
4. **병합은 Squash and merge만 사용**합니다 (`main` 히스토리를 커밋 단위로 깔끔하게 유지). 병합된 브랜치는 자동 삭제됩니다.
5. 커밋 메시지는 `type: 설명` 형식을 권장합니다 (`feat`, `fix`, `docs`, `refactor`, `chore` 등).

## 새 작업 시작하기

```bash
git checkout main
git pull
git checkout -b feature/짧은-설명
# 작업 후
git push -u origin feature/짧은-설명
gh pr create
```

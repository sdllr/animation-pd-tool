# AI 애니메이션 PD 툴 (for Claude.ai)

애니메이션 제작에 필요한 정보(작품·캐릭터·씬·스타일 가이드)를 입력하면, [Claude.ai](https://claude.ai)에 바로 붙여넣을 수 있도록 최적화된 프롬프트를 자동으로 조립해주는 프로덕션 어시스턴트입니다.

## 주요 기능

- **작품/캐릭터/씬 정보 입력**: 장르, 아트 스타일, 등장인물, 씬별 연출 정보를 단계별로 입력
- **프롬프트 자동 생성**: 스토리보드, 캐릭터 디자인, 대사/시나리오, 씬 연출 노트, 전체 패키지, 키 이미지, 배경 시트, 영상 연출 등 다양한 유형의 프롬프트를 조립
- **Gemini API 연동**: 미입력 항목을 AI가 자동으로 보완
- **멀티 프로젝트 관리**: 여러 프로젝트를 저장하고 불러오기
- **내보내기/불러오기**: JSON, Markdown, PDF(한글 폰트 포함) 형식으로 내보내고 JSON으로 다시 불러오기
- 모든 데이터는 브라우저 `localStorage`에 자동 저장

## Getting Started

```bash
npm install
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 을 열어 확인하세요.

### AI 자동 완성 기능 사용 시

Gemini API를 사용하려면 프로젝트 루트에 `.env.local` 파일을 만들고 아래 값을 설정하세요.

```bash
GEMINI_API_KEY=your_gemini_api_key
```

## 기술 스택

- [Next.js](https://nextjs.org) (App Router)
- React / TypeScript
- Tailwind CSS
- [@google/generative-ai](https://ai.google.dev/) (Gemini API)
- [jsPDF](https://github.com/parallax/jsPDF) (PDF 내보내기)

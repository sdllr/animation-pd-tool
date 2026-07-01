import type { ProjectInfo, Character, Scene, StyleGuide, PromptType, SimilarityLevel, ReferenceImageInfo } from '@/types';

export interface PromptBuildOptions {
  selectedSceneId?: string;
  referenceImage?: ReferenceImageInfo;
  styleGuide?: StyleGuide;
  sections?: {
    projectInfo?: boolean;
    characters?: boolean;
    scenes?: boolean;
    styleGuide?: boolean;
    negativeRules?: boolean;
  };
  aiAutoFill?: boolean;
}

// ─── Section builders ─────────────────────────────────────────────────────────

function buildProjectSection(info: ProjectInfo): string {
  const lines = ['## 작품 기본 정보'];
  if (info.title)          lines.push(`- **제목**: ${info.title}`);
  if (info.projectType)    lines.push(`- **유형**: ${{ series: '시리즈물', short_film: '단편물', pilot: '파일럿', etc: '기타' }[info.projectType] ?? info.projectType}`);
  if (info.genre)          lines.push(`- **장르**: ${info.genre}`);
  if (info.tone)           lines.push(`- **톤/분위기**: ${info.tone}`);
  if (info.targetAudience) lines.push(`- **타겟 시청자**: ${info.targetAudience}`);
  if (info.setting)        lines.push(`- **작품 배경**: ${info.setting}`);
  if (info.theme)          lines.push(`- **주제/테마**: ${info.theme}`);
  // Series-specific
  if (info.episodeCount)   lines.push(`- **회차 수**: ${info.episodeCount}`);
  if (info.episodeRuntime) lines.push(`- **회당 러닝타임**: ${info.episodeRuntime}`);
  if (info.recurringStructure) lines.push(`- **반복 구조**: ${info.recurringStructure}`);
  if (info.seasonGoal)     lines.push(`- **시즌 목표**: ${info.seasonGoal}`);
  // Short film
  if (info.runtime)        lines.push(`- **러닝타임**: ${info.runtime}`);
  if (info.emotionalGoal)  lines.push(`- **감정 목표**: ${info.emotionalGoal}`);
  if (info.synopsis)       lines.push(`\n**시놉시스**:\n${info.synopsis}`);
  return lines.join('\n');
}

function buildCharacterSection(characters: Character[]): string {
  if (characters.length === 0) return '';
  const lines = ['## 등장인물'];
  characters.forEach((c) => {
    lines.push(`\n### ${c.name || '(이름 미입력)'}${c.role ? ` — ${c.role}` : ''}`);
    if (c.age || c.gender)  lines.push(`- **기본 정보**: ${[c.age && `${c.age}세`, c.gender].filter(Boolean).join(', ')}`);
    if (c.appearance)       lines.push(`- **외모**: ${c.appearance}`);
    if (c.personality)      lines.push(`- **성격**: ${c.personality}`);
    if (c.speechStyle)      lines.push(`- **말투/어조**: ${c.speechStyle}`);
    if (c.background)       lines.push(`- **배경**: ${c.background}`);
    if (c.relationships)    lines.push(`- **인물 관계**: ${c.relationships}`);
  });
  return lines.join('\n');
}

function buildSceneSection(scene: Scene): string {
  const lines = [`## 씬 정보 — ${scene.number ? `#${scene.number}` : ''} ${scene.title || ''}`];
  if (scene.location)       lines.push(`- **장소**: ${scene.location}`);
  if (scene.timeOfDay)      lines.push(`- **시간대**: ${scene.timeOfDay}`);
  if (scene.season)         lines.push(`- **계절**: ${scene.season}`);
  if (scene.mood)           lines.push(`- **분위기**: ${scene.mood}`);
  if (scene.characters)     lines.push(`- **등장 캐릭터**: ${scene.characters}`);
  if (scene.action)         lines.push(`\n**핵심 액션/사건**:\n${scene.action}`);
  if (scene.cameraWork)     lines.push(`\n**카메라 워크**:\n${scene.cameraWork}`);
  if (scene.specialEffects) lines.push(`\n**특수효과/연출**:\n${scene.specialEffects}`);
  if (scene.dialogue)       lines.push(`\n**대사/감정 흐름**:\n${scene.dialogue}`);
  if (scene.bgm)            lines.push(`\n**BGM/사운드**:\n${scene.bgm}`);
  if (scene.notes)          lines.push(`\n**추가 지시사항**:\n${scene.notes}`);
  return lines.join('\n');
}

function buildStyleSection(sg: StyleGuide): string {
  const lines = ['## 스타일 가이드'];
  if (sg.artStyle)    lines.push(`- **아트 스타일**: ${sg.artStyle}`);
  if (sg.coloring)    lines.push(`- **채색 방식**: ${sg.coloring}`);
  if (sg.lineStyle)   lines.push(`- **선화 스타일**: ${sg.lineStyle}`);
  if (sg.aspectRatio) lines.push(`- **화면비**: ${sg.aspectRatio}`);
  if (sg.mood)        lines.push(`- **분위기**: ${sg.mood}`);
  if (sg.cameraRules) lines.push(`\n**카메라 규칙**:\n${sg.cameraRules}`);
  return lines.length > 1 ? lines.join('\n') : '';
}

function buildNegativeSection(sg: StyleGuide): string {
  const parts: string[] = [];
  if (sg.negativeStyle)  parts.push(`**금지 스타일**: ${sg.negativeStyle}`);
  if (sg.negativePrompt) parts.push(`**네거티브 프롬프트**: ${sg.negativePrompt}`);
  return parts.length > 0 ? ['## 금지사항', ...parts].join('\n') : '';
}

function buildSimilarityInstruction(ref: ReferenceImageInfo): string {
  const levelMap: Record<SimilarityLevel, string> = {
    low:    '전체적인 분위기와 컬러 톤만 참고하고 구도와 내용은 자유롭게 재해석해주세요 (유사도 약 30%)',
    medium: '전반적인 스타일, 구도, 컬러 팔레트를 참고하되 세부 요소는 작품에 맞게 변형해주세요 (유사도 약 60%)',
    high:   '구도, 스타일, 분위기를 최대한 유지하면서 캐릭터와 배경을 작품에 맞게 교체해주세요 (유사도 약 90%)',
    exact:  '구도, 스타일, 컬러, 분위기를 최대한 그대로 재현하되 작품 정보에 맞게 적용해주세요 (유사도 약 100%)',
  };
  const lines: string[] = [];
  if (ref.hasImage)    lines.push(`> 📎 **첨부 레퍼런스 이미지**: ${levelMap[ref.similarityLevel]}`);
  if (ref.description) lines.push(`> 📝 **레퍼런스 설명**: ${ref.description}`);
  return lines.join('\n');
}

function buildAiAutoFillNote(missing: string[]): string {
  if (missing.length === 0) return '';
  return [
    '## AI 보완 요청',
    '아래 정보가 입력되지 않았습니다. 작품의 전반적인 맥락을 참고하여 합리적으로 판단해주세요:',
    ...missing.map((m) => `- ${m}`),
  ].join('\n');
}

// ─── Main builder ─────────────────────────────────────────────────────────────

export function buildPrompt(
  type: PromptType,
  projectInfo: ProjectInfo,
  characters: Character[],
  scenes: Scene[],
  opts: PromptBuildOptions = {}
): string {
  const { selectedSceneId, referenceImage, styleGuide, sections = {}, aiAutoFill = false } = opts;

  // Section flags — default all to true when not specified
  const sec = {
    projectInfo:   sections.projectInfo   !== false,
    characters:    sections.characters    !== false,
    scenes:        sections.scenes        !== false,
    styleGuide:    sections.styleGuide    !== false,
    negativeRules: sections.negativeRules !== false,
  };

  const selectedScene  = selectedSceneId ? scenes.find((s) => s.id === selectedSceneId) : scenes[0];

  const projectSection   = sec.projectInfo                            ? buildProjectSection(projectInfo)                 : '';
  const characterSection = sec.characters && characters.length > 0    ? buildCharacterSection(characters)                : '';
  const sceneSection     = sec.scenes     && selectedScene             ? buildSceneSection(selectedScene)                 : '';
  const allScenesSection = sec.scenes     && scenes.length > 0
    ? '## 씬 목록\n' + scenes.map((s) => buildSceneSection(s)).join('\n\n---\n\n')
    : '';
  const styleSection     = sec.styleGuide    && styleGuide             ? buildStyleSection(styleGuide)                   : '';
  const negativeSection  = sec.negativeRules && styleGuide             ? buildNegativeSection(styleGuide)                : '';

  // AI auto-fill placeholders
  const aiMissing: string[] = [];
  if (aiAutoFill) {
    if (!projectInfo.genre)                   aiMissing.push('장르');
    if (!projectInfo.tone)                    aiMissing.push('전체 톤/분위기');
    if (!styleGuide?.artStyle && sec.styleGuide) aiMissing.push('아트 스타일');
    if (characters.length === 0 && sec.characters) aiMissing.push('캐릭터 정보');
    if (!selectedScene && sec.scenes)         aiMissing.push('씬 정보');
  }
  const autoFillNote = buildAiAutoFillNote(aiMissing);

  switch (type) {
    case 'storyboard':
      return [
        '당신은 경험 많은 애니메이션 PD입니다. 아래 작품 정보를 기반으로 해당 씬의 **스토리보드**를 전문적으로 작성해주세요.',
        '',
        '스토리보드는 다음 형식으로 각 컷(cut)을 상세히 작성해주세요:',
        '- 컷 번호 및 시간(초)',
        '- 구도/앵글 (LS/MS/CU/ECU/POV 등)',
        '- 캐릭터 위치 및 동작',
        '- 카메라 무브먼트 (팬/틸트/줌/트래킹 등)',
        '- 대사 (있을 경우)',
        '- 특수 연출 및 이펙트',
        '',
        '---',
        '',
        projectSection,
        '',
        characterSection,
        '',
        styleSection,
        '',
        sceneSection,
        '',
        negativeSection,
        '',
        autoFillNote,
        '',
        '---',
        '',
        '위 정보를 바탕으로 씬 전체를 커버하는 스토리보드를 컷 단위로 상세히 작성해주세요. 연출 의도와 감정선을 최대한 살려주세요.',
      ].filter(Boolean).join('\n');

    case 'characterDesign':
      return [
        '당신은 전문 애니메이션 캐릭터 디자이너이자 컨셉 아티스트입니다. 아래 정보를 바탕으로 각 캐릭터의 **상세 캐릭터 디자인 가이드**를 작성해주세요.',
        '',
        '다음 항목을 포함해주세요:',
        '- 전신 외형 묘사 (헤어/얼굴/체형/의상/소품)',
        '- 컬러 팔레트 및 색상 코드 (가능하면)',
        '- 표정 시트 가이드 (기본/기쁨/슬픔/분노/놀람)',
        '- 캐릭터 고유 모션/제스처 특성',
        '- 다른 캐릭터와의 비례 비교',
        '- 아트 스타일에 맞는 특수 디자인 포인트',
        '',
        '---',
        '',
        projectSection,
        '',
        characterSection,
        '',
        styleSection,
        '',
        negativeSection,
        '',
        autoFillNote,
        '',
        '---',
        '',
        '위 캐릭터들의 디자인 가이드를 작품의 아트 스타일에 맞게 구체적이고 일관성 있게 작성해주세요.',
      ].filter(Boolean).join('\n');

    case 'dialogue':
      return [
        '당신은 애니메이션 전문 시나리오 작가입니다. 아래 작품과 씬 정보를 바탕으로 **대사 및 씬 시나리오**를 작성해주세요.',
        '',
        '다음을 포함해주세요:',
        '- 씬 슬러그라인 (INT./EXT. 장소 - 시간)',
        '- 씬 묘사 (행동 지문)',
        '- 각 캐릭터의 대사 (성격/말투 반영)',
        '- 감정 지시어 (소리 없이 연기하는 부분 포함)',
        '- 필요 시 내레이션/자막 텍스트',
        '',
        '---',
        '',
        projectSection,
        '',
        characterSection,
        '',
        sceneSection,
        '',
        autoFillNote,
        '',
        '---',
        '',
        '각 캐릭터의 개성과 작품의 톤을 유지하면서 자연스럽고 감동적인 대사를 작성해주세요.',
      ].filter(Boolean).join('\n');

    case 'sceneDirection':
      return [
        '당신은 애니메이션 연출 전문가입니다. 아래 씬을 어떻게 **연출**할지 PD 관점에서 상세한 연출 노트를 작성해주세요.',
        '',
        '다음 관점에서 분석하고 제안해주세요:',
        '- 씬의 감정적 목표 및 서사 기능',
        '- 카메라 연출 전략 (숏 구성/카메라 무브)',
        '- 캐릭터 연기 디렉션',
        '- 색채/조명 연출 방향',
        '- BGM/SE 활용 전략',
        '- 편집 리듬 및 컷 전환 방식',
        '- 레퍼런스 작품 및 씬 추천',
        '',
        '---',
        '',
        projectSection,
        '',
        characterSection,
        '',
        styleSection,
        '',
        sceneSection,
        '',
        autoFillNote,
        '',
        '---',
        '',
        '이 씬이 관객에게 최대한 강한 인상을 남길 수 있도록 구체적이고 실현 가능한 연출 방향을 제시해주세요.',
      ].filter(Boolean).join('\n');

    case 'fullPackage':
      return [
        '당신은 경험 많은 애니메이션 PD이자 크리에이티브 디렉터입니다. 아래 작품 정보를 바탕으로 **종합 프로덕션 패키지**를 작성해주세요.',
        '',
        '다음 항목을 모두 포함해주세요:',
        '1. **작품 분석**: 장르적 특성, 타겟 시청자 분석, 유사 작품 비교',
        '2. **비주얼 콘셉트**: 아트 스타일 가이드, 컬러 팔레트, 배경 아트 방향',
        '3. **캐릭터 정리**: 각 캐릭터 요약 및 관계도',
        '4. **씬별 연출 플랜**: 각 씬의 핵심 연출 포인트',
        '5. **제작 우선순위 제안**: 어떤 씬/요소를 먼저 완성해야 하는지',
        '6. **잠재적 이슈 및 해결방안**: 예상되는 제작 난이도 높은 부분',
        '',
        '---',
        '',
        projectSection,
        '',
        characterSection,
        '',
        styleSection,
        '',
        allScenesSection,
        '',
        negativeSection,
        '',
        autoFillNote,
        '',
        '---',
        '',
        '위 정보를 종합하여 실제 애니메이션 제작에 바로 활용할 수 있는 전문적인 프로덕션 가이드를 작성해주세요.',
      ].filter(Boolean).join('\n');

    case 'keyImage': {
      const refSection = referenceImage && (referenceImage.hasImage || referenceImage.description)
        ? ['### 레퍼런스 이미지 지침', buildSimilarityInstruction(referenceImage), '']
        : [];
      return [
        '당신은 애니메이션 컨셉 아티스트이자 비주얼 디렉터입니다. 아래 작품 정보를 바탕으로 **키 이미지(Key Visual)** 일러스트 디렉션을 작성해주세요.',
        '',
        '키 이미지는 작품의 첫인상을 결정하는 가장 중요한 비주얼입니다. 다음 항목을 포함해주세요:',
        '- 전체 구도 및 캐릭터 배치 (황금비율, 삼분할법 등 활용)',
        '- 주요 캐릭터의 포즈, 표정, 시선 방향',
        '- 배경 요소 및 원근감 (전경/중경/원경 구분)',
        '- 조명 연출 및 광원 위치',
        '- 메인 컬러 팔레트 (3-5색 기준)',
        '- 포인트 이펙트 및 장식 요소',
        '',
        ...refSection,
        '---',
        '',
        projectSection,
        '',
        characterSection,
        '',
        styleSection,
        '',
        negativeSection,
        '',
        autoFillNote,
        '',
        '---',
        '',
        '위 정보를 바탕으로 작품의 핵심 매력을 한 장에 담아낼 수 있는 키 이미지 디렉션을 구체적으로 작성해주세요.',
      ].filter(Boolean).join('\n');
    }

    case 'backgroundSheet': {
      const refSection = referenceImage && (referenceImage.hasImage || referenceImage.description)
        ? ['### 레퍼런스 이미지 지침', buildSimilarityInstruction(referenceImage), '']
        : [];
      return [
        '당신은 애니메이션 배경 미술 디렉터입니다. 아래 정보를 바탕으로 **배경 시트(Background Sheet)** 미술 가이드를 작성해주세요.',
        '',
        '배경 시트에는 다음 항목을 포함해주세요:',
        '- 배경 전체 구성 및 원근법 (전경/중경/원경 분리)',
        '- 주요 오브젝트 및 소품 배치 목록',
        '- 조명 방향 및 그림자 처리',
        '- 메인 컬러 팔레트 및 재질 표현',
        '- 시간대/날씨에 따른 색조 변화 가이드',
        '- 카메라 프레이밍에 따른 배경 커버리지 범위',
        '- 애니메이팅 요소 가이드 (바람, 물, 빛 효과 등)',
        '',
        ...refSection,
        '---',
        '',
        projectSection,
        '',
        styleSection,
        '',
        sceneSection,
        '',
        negativeSection,
        '',
        autoFillNote,
        '',
        '---',
        '',
        '위 정보를 바탕으로 배경 미술 담당자가 즉시 작업할 수 있도록 명확하고 구체적인 배경 시트 가이드를 작성해주세요.',
      ].filter(Boolean).join('\n');
    }

    case 'video':
      return [
        '당신은 애니메이션 영상 연출 전문가입니다. 아래 작품 정보와 씬을 바탕으로 **영상 제작 연출 가이드**를 작성해주세요.',
        '',
        '다음 항목을 포함해주세요:',
        '- **씬 구조**: 인트로/전개/클라이맥스/아웃트로 타임라인 (초 단위)',
        '- **컷 구성**: 각 컷의 앵글, 구도, 지속 시간, 캐릭터 동작',
        '- **카메라 무브먼트**: 패닝/틸팅/줌/트래킹/드론샷 등 구체적 지시',
        '- **캐릭터 연기 디렉션**: 표정 변화, 몸짓, 감정 흐름',
        '- **색채 및 조명**: 씬별 컬러 톤, 광원 방향, 분위기 변화',
        '- **사운드 디렉션**: BGM 장르/템포, 효과음 포인트, 무음 구간',
        '- **편집 리듬**: 컷 전환 방식, 속도감, 강조 연출',
        '',
        '---',
        '',
        projectSection,
        '',
        characterSection,
        '',
        styleSection,
        '',
        sceneSection,
        '',
        negativeSection,
        '',
        autoFillNote,
        '',
        '---',
        '',
        '실제 애니메이션 제작팀이 바로 사용할 수 있도록 구체적이고 실현 가능한 영상 연출 가이드를 작성해주세요.',
      ].filter(Boolean).join('\n');

    default:
      return '';
  }
}

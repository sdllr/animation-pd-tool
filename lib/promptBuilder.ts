import type { ProjectInfo, Character, Scene, PromptType } from '@/types';

function buildProjectSection(info: ProjectInfo): string {
  const lines = ['## 작품 기본 정보'];
  if (info.title) lines.push(`- **제목**: ${info.title}`);
  if (info.genre) lines.push(`- **장르**: ${info.genre}`);
  if (info.artStyle) lines.push(`- **아트 스타일**: ${info.artStyle}`);
  if (info.tone) lines.push(`- **톤/분위기**: ${info.tone}`);
  if (info.targetAudience) lines.push(`- **타겟 시청자**: ${info.targetAudience}`);
  if (info.setting) lines.push(`- **작품 배경**: ${info.setting}`);
  if (info.theme) lines.push(`- **주제/테마**: ${info.theme}`);
  if (info.synopsis) lines.push(`\n**시놉시스**:\n${info.synopsis}`);
  return lines.join('\n');
}

function buildCharacterSection(characters: Character[]): string {
  if (characters.length === 0) return '';
  const lines = ['## 등장인물'];
  characters.forEach((c) => {
    lines.push(`\n### ${c.name || '(이름 미입력)'}${c.role ? ` — ${c.role}` : ''}`);
    if (c.age || c.gender) lines.push(`- **기본 정보**: ${[c.age && `${c.age}세`, c.gender].filter(Boolean).join(', ')}`);
    if (c.appearance) lines.push(`- **외모**: ${c.appearance}`);
    if (c.personality) lines.push(`- **성격**: ${c.personality}`);
    if (c.speechStyle) lines.push(`- **말투/어조**: ${c.speechStyle}`);
    if (c.background) lines.push(`- **배경**: ${c.background}`);
    if (c.relationships) lines.push(`- **인물 관계**: ${c.relationships}`);
  });
  return lines.join('\n');
}

function buildSceneSection(scene: Scene): string {
  const lines = [`## 씬 정보 — ${scene.number ? `#${scene.number}` : ''} ${scene.title || ''}`];
  if (scene.location) lines.push(`- **장소**: ${scene.location}`);
  if (scene.timeOfDay) lines.push(`- **시간대**: ${scene.timeOfDay}`);
  if (scene.season) lines.push(`- **계절**: ${scene.season}`);
  if (scene.mood) lines.push(`- **분위기**: ${scene.mood}`);
  if (scene.characters) lines.push(`- **등장 캐릭터**: ${scene.characters}`);
  if (scene.action) lines.push(`\n**핵심 액션/사건**:\n${scene.action}`);
  if (scene.cameraWork) lines.push(`\n**카메라 워크**:\n${scene.cameraWork}`);
  if (scene.specialEffects) lines.push(`\n**특수효과/연출**:\n${scene.specialEffects}`);
  if (scene.dialogue) lines.push(`\n**대사/감정 흐름**:\n${scene.dialogue}`);
  if (scene.bgm) lines.push(`\n**BGM/사운드**:\n${scene.bgm}`);
  if (scene.notes) lines.push(`\n**추가 지시사항**:\n${scene.notes}`);
  return lines.join('\n');
}

export function buildPrompt(
  type: PromptType,
  projectInfo: ProjectInfo,
  characters: Character[],
  scenes: Scene[],
  selectedSceneId?: string
): string {
  const selectedScene = selectedSceneId
    ? scenes.find((s) => s.id === selectedSceneId)
    : scenes[0];

  const projectSection = buildProjectSection(projectInfo);
  const characterSection = buildCharacterSection(characters);
  const sceneSection = selectedScene ? buildSceneSection(selectedScene) : '';

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
        sceneSection,
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
        sceneSection,
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
        scenes.length > 0 ? '## 씬 목록\n' + scenes.map((s) => buildSceneSection(s)).join('\n\n---\n\n') : '',
        '',
        '---',
        '',
        '위 정보를 종합하여 실제 애니메이션 제작에 바로 활용할 수 있는 전문적인 프로덕션 가이드를 작성해주세요.',
      ].filter(Boolean).join('\n');

    default:
      return '';
  }
}

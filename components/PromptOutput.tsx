'use client';

import { useRef, useState, useEffect } from 'react';
import type { ProjectInfo, Character, Scene, StyleGuide, PromptType, SimilarityLevel, ReferenceImageInfo, ActiveTab } from '@/types';
import { buildPrompt } from '@/lib/promptBuilder';

// ─── Constants ────────────────────────────────────────────────────────────────

const SIMILARITY_LEVELS: { value: SimilarityLevel; label: string; pct: string; description: string }[] = [
  { value: 'low',    label: '낮음', pct: '~30%', description: '분위기/컬러톤만 참고, 자유로운 재해석' },
  { value: 'medium', label: '보통', pct: '~60%', description: '스타일·구도 참고, 세부 변형 허용' },
  { value: 'high',   label: '높음', pct: '~90%', description: '구도/스타일 유지, 작품 요소 교체' },
  { value: 'exact',  label: '동일', pct: '~100%', description: '최대한 그대로 재현' },
];

const PROMPT_TYPES: { value: PromptType; label: string; icon: string; desc: string }[] = [
  { value: 'keyImage',        label: '키 이미지', icon: '🖼️', desc: '작품 대표 키 비주얼 일러스트 디렉션' },
  { value: 'backgroundSheet', label: '배경 시트', icon: '🏞️', desc: '씬별 배경 미술 가이드' },
  { value: 'video',           label: '영상',      icon: '🎬', desc: '애니메이션 영상 제작 연출 가이드' },
];

type InfoSections = {
  projectInfo: boolean;
  characters: boolean;
  scenes: boolean;
  styleGuide: boolean;
  negativeRules: boolean;
};

const SECTION_LABELS: { key: keyof InfoSections; label: string; tab: ActiveTab }[] = [
  { key: 'projectInfo',   label: '작품 기본 정보', tab: 'project' },
  { key: 'characters',    label: '캐릭터 정보',    tab: 'characters' },
  { key: 'scenes',        label: '씬 정보',        tab: 'scenes' },
  { key: 'styleGuide',    label: '스타일 가이드',  tab: 'style' },
  { key: 'negativeRules', label: '금지사항',        tab: 'style' },
];

const DEFAULT_SECTIONS: Record<PromptType, InfoSections> = {
  storyboard:      { projectInfo: true,  characters: true,  scenes: true,  styleGuide: false, negativeRules: false },
  characterDesign: { projectInfo: true,  characters: true,  scenes: false, styleGuide: true,  negativeRules: true  },
  dialogue:        { projectInfo: true,  characters: true,  scenes: true,  styleGuide: false, negativeRules: false },
  sceneDirection:  { projectInfo: true,  characters: true,  scenes: true,  styleGuide: true,  negativeRules: false },
  fullPackage:     { projectInfo: true,  characters: true,  scenes: true,  styleGuide: true,  negativeRules: true  },
  keyImage:        { projectInfo: true,  characters: true,  scenes: false, styleGuide: true,  negativeRules: true  },
  backgroundSheet: { projectInfo: true,  characters: false, scenes: true,  styleGuide: true,  negativeRules: true  },
  video:           { projectInfo: true,  characters: true,  scenes: true,  styleGuide: true,  negativeRules: true  },
};

// ─── Validation ───────────────────────────────────────────────────────────────

interface MissingField {
  label: string;
  tab: ActiveTab;
}

function validatePrompt(
  type: PromptType,
  projectInfo: ProjectInfo,
  characters: Character[],
  scenes: Scene[],
  styleGuide: StyleGuide,
  sections: InfoSections,
): MissingField[] {
  const missing: MissingField[] = [];

  if (sections.projectInfo && !projectInfo.title)
    missing.push({ label: '작품 제목', tab: 'project' });

  if (sections.styleGuide && !styleGuide.artStyle &&
      (type === 'characterDesign' || type === 'keyImage' || type === 'backgroundSheet' || type === 'sceneDirection' || type === 'fullPackage' || type === 'video'))
    missing.push({ label: '아트 스타일 (스타일 가이드)', tab: 'style' });

  if (sections.characters && characters.length === 0 &&
      (type === 'storyboard' || type === 'characterDesign' || type === 'dialogue' || type === 'keyImage' || type === 'video'))
    missing.push({ label: '캐릭터 정보', tab: 'characters' });

  if (sections.characters && type === 'characterDesign' && characters.length > 0 && !characters.some(c => c.appearance))
    missing.push({ label: '캐릭터 외모 묘사', tab: 'characters' });

  if (sections.scenes && scenes.length === 0 &&
      (type === 'storyboard' || type === 'dialogue' || type === 'sceneDirection' || type === 'backgroundSheet' || type === 'video'))
    missing.push({ label: '씬 정보', tab: 'scenes' });

  if (sections.scenes && type === 'backgroundSheet' && scenes.length > 0 && !scenes.some(s => s.location))
    missing.push({ label: '씬 장소 정보', tab: 'scenes' });

  if (!projectInfo.synopsis && (type === 'fullPackage' || type === 'dialogue'))
    missing.push({ label: '시놉시스', tab: 'project' });

  return missing;
}

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  projectInfo: ProjectInfo;
  characters: Character[];
  scenes: Scene[];
  styleGuide: StyleGuide;
  onNavigate?: (tab: ActiveTab) => void;
}

export default function PromptOutput({ projectInfo, characters, scenes, styleGuide, onNavigate }: Props) {
  const [promptType, setPromptType]         = useState<PromptType>('keyImage');
  const [selectedSceneId, setSelectedSceneId] = useState<string>(scenes[0]?.id ?? '');
  const [sections, setSections]             = useState<InfoSections>(DEFAULT_SECTIONS['storyboard']);
  const [prompt, setPrompt]                 = useState('');
  const [copied, setCopied]                 = useState(false);
  const [aiAutoFill, setAiAutoFill]         = useState(false);
  const [dismissedWarning, setDismissedWarning] = useState(false);

  // Reference image state
  const [refImageDataUrl, setRefImageDataUrl] = useState<string>('');
  const [refImageName, setRefImageName]       = useState<string>('');
  const [refSimilarity, setRefSimilarity]     = useState<SimilarityLevel>('medium');
  const [refDescription, setRefDescription]   = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isRefType = promptType === 'keyImage' || promptType === 'backgroundSheet';

  // Reset sections and aiAutoFill when prompt type changes
  useEffect(() => {
    setSections(DEFAULT_SECTIONS[promptType]);
    setAiAutoFill(false);
    setDismissedWarning(false);
  }, [promptType]);

  useEffect(() => {
    if (scenes.length > 0 && !selectedSceneId) setSelectedSceneId(scenes[0].id);
  }, [scenes, selectedSceneId]);

  // Build prompt
  useEffect(() => {
    const refInfo: ReferenceImageInfo | undefined = isRefType
      ? { hasImage: !!refImageDataUrl, similarityLevel: refSimilarity, description: refDescription }
      : undefined;
    const result = buildPrompt(promptType, projectInfo, characters, scenes, {
      selectedSceneId,
      referenceImage: refInfo,
      styleGuide,
      sections,
      aiAutoFill,
    });
    setPrompt(result);
  }, [promptType, projectInfo, characters, scenes, selectedSceneId, refImageDataUrl, refSimilarity, refDescription, styleGuide, sections, aiAutoFill, isRefType]);

  const handleRefImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { setRefImageDataUrl(reader.result as string); setRefImageName(file.name); };
    reader.readAsDataURL(file);
  };

  const clearRefImage = () => {
    setRefImageDataUrl('');
    setRefImageName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const toggleSection = (key: keyof InfoSections) =>
    setSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const missing = validatePrompt(promptType, projectInfo, characters, scenes, styleGuide, sections);
  const showWarning = missing.length > 0 && !dismissedWarning;

  const charCount     = prompt.length;
  const tokenEstimate = Math.round(charCount / 3.5);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">프롬프트 생성</h2>
        <p className="text-sm text-slate-400">저장된 작품 정보를 기반으로 Claude.ai에 붙여넣을 프롬프트를 자동으로 생성합니다.</p>
      </div>

      {/* Prompt type selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {PROMPT_TYPES.map((pt) => (
          <button
            key={pt.value}
            onClick={() => setPromptType(pt.value)}
            className={`flex flex-col items-center gap-1 px-3 py-3 rounded-xl text-center transition-all ${
              promptType === pt.value
                ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/20'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
            }`}
            title={pt.desc}
          >
            <span className="text-2xl">{pt.icon}</span>
            <span className="text-xs font-semibold leading-tight">{pt.label}</span>
          </button>
        ))}
      </div>

      {/* Reference image panel */}
      {isRefType && (
        <div className="space-y-4 p-4 bg-slate-800/50 border border-slate-700 rounded-xl">
          <p className="text-sm font-semibold text-slate-300">레퍼런스 이미지 <span className="text-slate-500 font-normal text-xs">(선택)</span></p>
          {refImageDataUrl ? (
            <div className="flex items-start gap-3">
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={refImageDataUrl} alt="레퍼런스" className="max-h-40 rounded-lg border border-slate-600 object-contain" />
                <button onClick={clearRefImage} className="absolute -top-2 -right-2 w-5 h-5 bg-rose-600 hover:bg-rose-500 text-white rounded-full text-[10px] flex items-center justify-center" title="이미지 제거">✕</button>
              </div>
              <div className="text-xs text-slate-400 mt-1 space-y-1">
                <p className="truncate max-w-[200px]">{refImageName}</p>
                <button onClick={() => fileInputRef.current?.click()} className="text-violet-400 hover:text-violet-300 underline">다른 이미지로 교체</button>
              </div>
            </div>
          ) : (
            <label className="flex flex-col items-center gap-2 p-5 border-2 border-dashed border-slate-600 rounded-xl cursor-pointer hover:border-violet-500 hover:bg-slate-800 transition-colors">
              <span className="text-2xl">🖼️</span>
              <span className="text-sm text-slate-400">클릭하여 레퍼런스 이미지 업로드</span>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleRefImageUpload} />
            </label>
          )}
          {refImageDataUrl && <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleRefImageUpload} />}
          <div>
            <p className="text-xs font-medium text-slate-400 mb-2">레퍼런스 유사도</p>
            <div className="flex gap-2">
              {SIMILARITY_LEVELS.map((sl) => (
                <button key={sl.value} onClick={() => setRefSimilarity(sl.value)} title={sl.description}
                  className={`flex-1 px-2 py-2 rounded-lg text-center transition-colors ${refSimilarity === sl.value ? 'bg-violet-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>
                  <div className="text-xs font-semibold">{sl.label}</div>
                  <div className="text-[10px] opacity-70">{sl.pct}</div>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-400 mb-1 block">레퍼런스 추가 설명 <span className="text-slate-600">(선택)</span></label>
            <textarea value={refDescription} onChange={(e) => setRefDescription(e.target.value)}
              placeholder="참고하고 싶은 부분을 구체적으로 설명해주세요." rows={2} className="input-field resize-none text-sm" />
          </div>
          {refImageDataUrl && (
            <p className="text-xs text-amber-400 bg-amber-900/20 border border-amber-800/30 rounded-lg px-3 py-2">
              💡 Claude.ai에서 이 프롬프트를 사용할 때 레퍼런스 이미지를 대화창에 함께 첨부해주세요.
            </p>
          )}
        </div>
      )}

      {/* Scene selector */}
      {promptType !== 'fullPackage' && promptType !== 'characterDesign' && promptType !== 'keyImage' && scenes.length > 0 && (
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-slate-300 flex-shrink-0">대상 씬:</label>
          <select value={selectedSceneId} onChange={(e) => setSelectedSceneId(e.target.value)} className="input-field flex-1 max-w-xs">
            {scenes.map((s, i) => (
              <option key={s.id} value={s.id}>#{s.number || i + 1} {s.title || '(제목 없음)'}</option>
            ))}
          </select>
        </div>
      )}

      {/* Info section checkboxes */}
      <div className="p-3 bg-slate-800/40 border border-slate-700/60 rounded-xl">
        <p className="text-xs font-semibold text-slate-400 mb-2">포함할 정보</p>
        <div className="flex flex-wrap gap-2">
          {SECTION_LABELS.map(({ key, label }) => (
            <label key={key} className="flex items-center gap-1.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={sections[key]}
                onChange={() => toggleSection(key)}
                className="w-3.5 h-3.5 rounded accent-violet-500 cursor-pointer"
              />
              <span className={`text-xs transition-colors ${sections[key] ? 'text-slate-300' : 'text-slate-600'}`}>{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Missing fields warning */}
      {showWarning && (
        <div className="p-4 bg-amber-900/20 border border-amber-700/40 rounded-xl space-y-3">
          <div className="flex items-start justify-between gap-2">
            <p className="text-xs font-semibold text-amber-400">⚠ 프롬프트를 더 정확하게 만들려면 아래 정보가 필요합니다</p>
            <button onClick={() => setDismissedWarning(true)} className="text-slate-500 hover:text-slate-300 text-xs flex-shrink-0">닫기</button>
          </div>
          <ul className="space-y-1">
            {missing.map((m, i) => (
              <li key={i} className="text-xs text-amber-300 flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-amber-500 flex-shrink-0" />
                {m.label}
                {onNavigate && (
                  <button onClick={() => onNavigate(m.tab)} className="text-violet-400 hover:text-violet-300 underline ml-1">입력하러 가기 →</button>
                )}
              </li>
            ))}
          </ul>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => { setAiAutoFill(true); setDismissedWarning(true); }}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-violet-700 hover:bg-violet-600 text-white transition-colors"
            >
              AI가 임시 보완
            </button>
            <button
              onClick={() => setDismissedWarning(true)}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors"
            >
              일단 생성하기
            </button>
          </div>
          {aiAutoFill && (
            <p className="text-xs text-violet-400 bg-violet-900/20 border border-violet-700/30 rounded-lg px-3 py-2">
              ✓ AI 보완 적용 중 — 부족한 정보를 Claude가 판단하도록 프롬프트에 안내를 추가했습니다.
              <button onClick={() => setAiAutoFill(false)} className="ml-2 underline text-violet-300">취소</button>
            </p>
          )}
        </div>
      )}

      {/* Info bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span>{charCount.toLocaleString()}자</span>
          <span>~{tokenEstimate.toLocaleString()} 토큰 추정</span>
          {PROMPT_TYPES.find(p => p.value === promptType)?.desc && (
            <span className="text-violet-400">
              {PROMPT_TYPES.find(p => p.value === promptType)?.icon} {PROMPT_TYPES.find(p => p.value === promptType)?.desc}
            </span>
          )}
        </div>
        <button
          onClick={copyToClipboard}
          disabled={!prompt}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            copied ? 'bg-emerald-600 text-white'
            : prompt ? 'bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-500/20'
            : 'bg-slate-700 text-slate-500 cursor-not-allowed'
          }`}
        >
          {copied ? '✓ 복사됨!' : '클립보드에 복사'}
        </button>
      </div>

      {/* Prompt preview */}
      <div className="relative">
        {prompt ? (
          <pre className="bg-slate-900 border border-slate-700 rounded-xl p-4 text-sm text-slate-300 whitespace-pre-wrap font-mono leading-relaxed overflow-auto max-h-[55vh]">
            {prompt}
          </pre>
        ) : (
          <div className="bg-slate-900 border border-dashed border-slate-700 rounded-xl p-8 text-center">
            <div className="text-4xl mb-3">📝</div>
            <p className="text-slate-500 text-sm">작품 정보, 캐릭터, 씬 정보를 입력하면<br />여기에 프롬프트가 자동으로 생성됩니다.</p>
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
        <p className="text-xs font-semibold text-slate-400">Claude.ai 활용 팁</p>
        <ul className="text-xs text-slate-500 space-y-1 list-disc list-inside">
          <li>위 프롬프트를 <strong className="text-slate-400">claude.ai</strong>의 채팅창에 그대로 붙여넣으세요.</li>
          <li>결과가 마음에 들지 않으면 <strong className="text-slate-400">"더 구체적으로 작성해줘"</strong> 또는 <strong className="text-slate-400">"~한 부분을 수정해줘"</strong>로 이어서 요청하세요.</li>
          <li>여러 씬의 스토리보드가 필요하다면 씬을 바꿔가며 각각 프롬프트를 생성하세요.</li>
          <li>전체 패키지 프롬프트는 모든 씬 정보를 한 번에 포함하므로 처음 기획 단계에 적합합니다.</li>
          <li><strong className="text-slate-400">키 이미지 / 배경 시트</strong>는 레퍼런스 이미지를 업로드하고 유사도를 설정한 뒤, Claude.ai에 이미지를 함께 첨부하여 사용하세요.</li>
          <li><strong className="text-slate-400">스타일 가이드</strong>를 미리 설정해두면 모든 프롬프트에 일관된 비주얼 규칙이 자동으로 반영됩니다.</li>
        </ul>
      </div>
    </div>
  );
}

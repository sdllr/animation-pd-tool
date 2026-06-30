'use client';

import { useState, useEffect } from 'react';
import type { ProjectInfo, Character, Scene, PromptType } from '@/types';
import { buildPrompt } from '@/lib/promptBuilder';

interface Props {
  projectInfo: ProjectInfo;
  characters: Character[];
  scenes: Scene[];
}

const PROMPT_TYPES: { value: PromptType; label: string; icon: string; desc: string }[] = [
  { value: 'storyboard', label: '스토리보드', icon: '🎞️', desc: '씬별 컷 구성 및 카메라 연출 지시서' },
  { value: 'characterDesign', label: '캐릭터 디자인', icon: '✏️', desc: '캐릭터 외형 및 디자인 가이드' },
  { value: 'dialogue', label: '대사/시나리오', icon: '💬', desc: '씬 대사 및 액션 라인 스크립트' },
  { value: 'sceneDirection', label: '씬 연출 노트', icon: '🎬', desc: 'PD 관점의 씬 연출 전략 및 방향' },
  { value: 'fullPackage', label: '전체 패키지', icon: '📦', desc: '모든 정보를 종합한 프로덕션 패키지' },
];

export default function PromptOutput({ projectInfo, characters, scenes }: Props) {
  const [promptType, setPromptType] = useState<PromptType>('storyboard');
  const [selectedSceneId, setSelectedSceneId] = useState<string>(scenes[0]?.id ?? '');
  const [prompt, setPrompt] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (scenes.length > 0 && !selectedSceneId) {
      setSelectedSceneId(scenes[0].id);
    }
  }, [scenes, selectedSceneId]);

  useEffect(() => {
    const result = buildPrompt(promptType, projectInfo, characters, scenes, selectedSceneId);
    setPrompt(result);
  }, [promptType, projectInfo, characters, scenes, selectedSceneId]);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const charCount = prompt.length;
  const tokenEstimate = Math.round(charCount / 3.5);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">프롬프트 생성</h2>
        <p className="text-sm text-slate-400">원하는 프롬프트 유형을 선택하면 Claude.ai에 붙여넣을 수 있는 프롬프트가 자동으로 생성됩니다.</p>
      </div>

      {/* Prompt type selector */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
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

      {/* Scene selector (for scene-specific prompts) */}
      {promptType !== 'fullPackage' && promptType !== 'characterDesign' && scenes.length > 0 && (
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-slate-300 flex-shrink-0">대상 씬:</label>
          <select
            value={selectedSceneId}
            onChange={(e) => setSelectedSceneId(e.target.value)}
            className="input-field flex-1 max-w-xs"
          >
            {scenes.map((s, i) => (
              <option key={s.id} value={s.id}>
                #{s.number || i + 1} {s.title || '(제목 없음)'}
              </option>
            ))}
          </select>
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
            copied
              ? 'bg-emerald-600 text-white'
              : prompt
              ? 'bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-500/20'
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
        </ul>
      </div>
    </div>
  );
}

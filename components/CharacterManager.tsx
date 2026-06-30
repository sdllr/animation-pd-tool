'use client';

import { useState } from 'react';
import type { Character } from '@/types';

interface Props {
  characters: Character[];
  onChange: (characters: Character[]) => void;
}

const ROLES = ['주인공', '히로인', '라이벌', '멘토', '악당', '조력자', '코믹 릴리프', '미스터리 캐릭터', '조연'];
const SPEECH_STYLES = ['정중하고 격식체', '반말/친근체', '사투리', '어눌하거나 더듬음', '쿨하고 짧음', '수다스럽고 활발함', '고어체/고풍스러움', '외국인 억양'];

function makeId() {
  return Math.random().toString(36).slice(2, 9);
}

function emptyCharacter(): Character {
  return {
    id: makeId(),
    name: '',
    age: '',
    gender: '',
    role: '',
    appearance: '',
    personality: '',
    background: '',
    speechStyle: '',
    relationships: '',
  };
}

export default function CharacterManager({ characters, onChange }: Props) {
  const [activeId, setActiveId] = useState<string | null>(characters[0]?.id ?? null);

  const addCharacter = () => {
    const c = emptyCharacter();
    onChange([...characters, c]);
    setActiveId(c.id);
  };

  const removeCharacter = (id: string) => {
    const next = characters.filter((c) => c.id !== id);
    onChange(next);
    if (activeId === id) setActiveId(next[0]?.id ?? null);
  };

  const updateCharacter = (id: string, key: keyof Character, value: string) => {
    onChange(characters.map((c) => (c.id === id ? { ...c, [key]: value } : c)));
  };

  const active = characters.find((c) => c.id === activeId);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">캐릭터 설정</h2>
        <p className="text-sm text-slate-400">작품에 등장하는 캐릭터를 추가하고 상세 설정을 입력해주세요.</p>
      </div>

      <div className="flex gap-4 flex-col lg:flex-row">
        {/* Character list */}
        <div className="lg:w-48 flex-shrink-0">
          <div className="flex flex-col gap-2">
            {characters.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveId(c.id)}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                  activeId === c.id
                    ? 'bg-violet-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <span className="truncate">{c.name || '(미입력)'}</span>
                <span
                  role="button"
                  onClick={(e) => { e.stopPropagation(); removeCharacter(c.id); }}
                  className="ml-2 text-slate-400 hover:text-rose-400 text-xs"
                  title="삭제"
                >
                  ✕
                </span>
              </button>
            ))}
            <button
              onClick={addCharacter}
              className="px-3 py-2 rounded-lg text-sm font-medium bg-slate-700 text-slate-300 hover:bg-violet-700 hover:text-white transition-colors border border-dashed border-slate-600"
            >
              + 캐릭터 추가
            </button>
          </div>
        </div>

        {/* Character form */}
        {active ? (
          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="이름" required>
                <input
                  type="text"
                  value={active.name}
                  onChange={(e) => updateCharacter(active.id, 'name', e.target.value)}
                  placeholder="예: 김하늘"
                  className="input-field"
                />
              </Field>

              <Field label="역할">
                <div className="flex gap-2">
                  <select
                    value={active.role}
                    onChange={(e) => updateCharacter(active.id, 'role', e.target.value)}
                    className="input-field"
                  >
                    <option value="">역할 선택</option>
                    {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                  <input
                    type="text"
                    value={active.role}
                    onChange={(e) => updateCharacter(active.id, 'role', e.target.value)}
                    placeholder="직접 입력"
                    className="input-field flex-1"
                  />
                </div>
              </Field>

              <Field label="나이">
                <input
                  type="text"
                  value={active.age}
                  onChange={(e) => updateCharacter(active.id, 'age', e.target.value)}
                  placeholder="예: 17, 20대 초반"
                  className="input-field"
                />
              </Field>

              <Field label="성별">
                <select
                  value={active.gender}
                  onChange={(e) => updateCharacter(active.id, 'gender', e.target.value)}
                  className="input-field"
                >
                  <option value="">선택</option>
                  <option>남성</option>
                  <option>여성</option>
                  <option>논바이너리</option>
                  <option>불명</option>
                </select>
              </Field>

              <Field label="말투/어조">
                <div className="flex gap-2">
                  <select
                    value={active.speechStyle}
                    onChange={(e) => updateCharacter(active.id, 'speechStyle', e.target.value)}
                    className="input-field"
                  >
                    <option value="">말투 선택</option>
                    {SPEECH_STYLES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <input
                    type="text"
                    value={active.speechStyle}
                    onChange={(e) => updateCharacter(active.id, 'speechStyle', e.target.value)}
                    placeholder="직접 입력"
                    className="input-field flex-1"
                  />
                </div>
              </Field>
            </div>

            <Field label="외모 묘사">
              <textarea
                value={active.appearance}
                onChange={(e) => updateCharacter(active.id, 'appearance', e.target.value)}
                placeholder="헤어 스타일, 눈 색, 체형, 의상, 특징적인 외모 요소 등을 자세히 입력해주세요."
                rows={3}
                className="input-field resize-none"
              />
            </Field>

            <Field label="성격">
              <textarea
                value={active.personality}
                onChange={(e) => updateCharacter(active.id, 'personality', e.target.value)}
                placeholder="성격의 강점과 약점, 행동 패턴, 가치관, 트라우마 등을 입력해주세요."
                rows={3}
                className="input-field resize-none"
              />
            </Field>

            <Field label="배경 스토리">
              <textarea
                value={active.background}
                onChange={(e) => updateCharacter(active.id, 'background', e.target.value)}
                placeholder="과거 이력, 가족 관계, 중요한 사건, 현재 상황 등을 입력해주세요."
                rows={3}
                className="input-field resize-none"
              />
            </Field>

            <Field label="인물 관계">
              <textarea
                value={active.relationships}
                onChange={(e) => updateCharacter(active.id, 'relationships', e.target.value)}
                placeholder="다른 캐릭터와의 관계를 입력해주세요. 예: 김하늘 - 소꿉친구이자 경쟁자, 박민준 - 스승"
                rows={2}
                className="input-field resize-none"
              />
            </Field>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-slate-500 py-12">
              <div className="text-4xl mb-3">👤</div>
              <p>캐릭터를 추가하거나 선택해주세요</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-slate-300">
        {label}
        {required && <span className="text-rose-400 ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}

'use client';

import { useState } from 'react';
import type { Scene } from '@/types';

interface Props {
  scenes: Scene[];
  onChange: (scenes: Scene[]) => void;
}

const TIMES_OF_DAY = ['아침 (일출)', '오전', '정오', '오후', '저녁 (일몰)', '밤', '새벽', '심야'];
const SEASONS = ['봄', '여름', '가을', '겨울', '우기/장마', '눈오는 날'];
const MOODS = ['긴장감', '로맨틱', '코믹', '슬픔/비극', '경이로움', '공포', '평화로움', '흥분/활기', '몽환적', '절망적'];
const CAMERA_WORKS = [
  '고정 숏 (Static)',
  '팬 (Pan) — 좌우 이동',
  '틸트 (Tilt) — 상하 이동',
  '줌인/줌아웃',
  '트래킹 숏 (Tracking)',
  '핸드헬드 (흔들림)',
  '에어리얼 뷰 (부감)',
  '로우 앵글',
  '하이 앵글',
  '오버 더 숄더',
];

function makeId() {
  return Math.random().toString(36).slice(2, 9);
}

function emptyScene(index: number): Scene {
  return {
    id: makeId(),
    number: String(index + 1),
    title: '',
    location: '',
    timeOfDay: '',
    season: '',
    mood: '',
    characters: '',
    action: '',
    cameraWork: '',
    specialEffects: '',
    dialogue: '',
    bgm: '',
    notes: '',
  };
}

export default function SceneManager({ scenes, onChange }: Props) {
  const [activeId, setActiveId] = useState<string | null>(scenes[0]?.id ?? null);

  const addScene = () => {
    const s = emptyScene(scenes.length);
    onChange([...scenes, s]);
    setActiveId(s.id);
  };

  const removeScene = (id: string) => {
    const next = scenes.filter((s) => s.id !== id);
    onChange(next);
    if (activeId === id) setActiveId(next[0]?.id ?? null);
  };

  const updateScene = (id: string, key: keyof Scene, value: string) => {
    onChange(scenes.map((s) => (s.id === id ? { ...s, [key]: value } : s)));
  };

  const active = scenes.find((s) => s.id === activeId);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">씬 설정</h2>
        <p className="text-sm text-slate-400">각 씬의 상세 정보를 입력해주세요. 씬이 구체적일수록 더 정확한 프롬프트가 생성됩니다.</p>
      </div>

      <div className="flex gap-4 flex-col lg:flex-row">
        {/* Scene list */}
        <div className="lg:w-48 flex-shrink-0">
          <div className="flex flex-col gap-2">
            {scenes.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setActiveId(s.id)}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                  activeId === s.id
                    ? 'bg-violet-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <span className="truncate">
                  <span className="text-xs opacity-60 mr-1">#{s.number || i + 1}</span>
                  {s.title || '(제목 미입력)'}
                </span>
                <span
                  role="button"
                  onClick={(e) => { e.stopPropagation(); removeScene(s.id); }}
                  className="ml-2 text-slate-400 hover:text-rose-400 text-xs flex-shrink-0"
                  title="삭제"
                >
                  ✕
                </span>
              </button>
            ))}
            <button
              onClick={addScene}
              className="px-3 py-2 rounded-lg text-sm font-medium bg-slate-700 text-slate-300 hover:bg-violet-700 hover:text-white transition-colors border border-dashed border-slate-600"
            >
              + 씬 추가
            </button>
          </div>
        </div>

        {/* Scene form */}
        {active ? (
          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="씬 번호">
                <input
                  type="text"
                  value={active.number}
                  onChange={(e) => updateScene(active.id, 'number', e.target.value)}
                  placeholder="예: 1, 2A, 3-B"
                  className="input-field"
                />
              </Field>

              <Field label="씬 제목">
                <input
                  type="text"
                  value={active.title}
                  onChange={(e) => updateScene(active.id, 'title', e.target.value)}
                  placeholder="예: 첫 만남, 결전의 순간"
                  className="input-field"
                />
              </Field>

              <Field label="장소/배경">
                <input
                  type="text"
                  value={active.location}
                  onChange={(e) => updateScene(active.id, 'location', e.target.value)}
                  placeholder="예: 학교 옥상, 마법 숲 입구"
                  className="input-field"
                />
              </Field>

              <Field label="등장 캐릭터">
                <input
                  type="text"
                  value={active.characters}
                  onChange={(e) => updateScene(active.id, 'characters', e.target.value)}
                  placeholder="예: 하늘, 민준 (나중에 세라 합류)"
                  className="input-field"
                />
              </Field>

              <Field label="시간대">
                <div className="flex gap-2">
                  <select
                    value={active.timeOfDay}
                    onChange={(e) => updateScene(active.id, 'timeOfDay', e.target.value)}
                    className="input-field"
                  >
                    <option value="">선택</option>
                    {TIMES_OF_DAY.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </Field>

              <Field label="계절/날씨">
                <div className="flex gap-2">
                  <select
                    value={active.season}
                    onChange={(e) => updateScene(active.id, 'season', e.target.value)}
                    className="input-field"
                  >
                    <option value="">선택</option>
                    {SEASONS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <input
                    type="text"
                    value={active.season}
                    onChange={(e) => updateScene(active.id, 'season', e.target.value)}
                    placeholder="직접 입력"
                    className="input-field flex-1"
                  />
                </div>
              </Field>

              <Field label="씬 분위기">
                <div className="flex gap-2 flex-wrap">
                  {MOODS.slice(0, 5).map((m) => (
                    <button
                      key={m}
                      onClick={() => updateScene(active.id, 'mood', active.mood === m ? '' : m)}
                      className={`px-2 py-1 rounded text-xs transition-colors ${
                        active.mood.includes(m)
                          ? 'bg-violet-600 text-white'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={active.mood}
                  onChange={(e) => updateScene(active.id, 'mood', e.target.value)}
                  placeholder="분위기 직접 입력 또는 위에서 선택"
                  className="input-field mt-2"
                />
              </Field>

              <Field label="주요 카메라 워크">
                <select
                  value={active.cameraWork}
                  onChange={(e) => updateScene(active.id, 'cameraWork', e.target.value)}
                  className="input-field"
                >
                  <option value="">선택</option>
                  {CAMERA_WORKS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
            </div>

            <Field label="핵심 액션/사건">
              <textarea
                value={active.action}
                onChange={(e) => updateScene(active.id, 'action', e.target.value)}
                placeholder="이 씬에서 일어나는 핵심 사건이나 행동을 설명해주세요. 씬의 시작-중간-끝 흐름을 적어주면 더 좋습니다."
                rows={4}
                className="input-field resize-none"
              />
            </Field>

            <Field label="대사/감정 흐름 힌트">
              <textarea
                value={active.dialogue}
                onChange={(e) => updateScene(active.id, 'dialogue', e.target.value)}
                placeholder="주요 대사나 감정 흐름, 내면 독백 등을 입력해주세요. 정확한 대사가 없어도 방향성만 입력해도 됩니다."
                rows={3}
                className="input-field resize-none"
              />
            </Field>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="특수효과/연출 아이디어">
                <textarea
                  value={active.specialEffects}
                  onChange={(e) => updateScene(active.id, 'specialEffects', e.target.value)}
                  placeholder="마법 이펙트, 슬로우 모션, 플래시백 등"
                  rows={2}
                  className="input-field resize-none"
                />
              </Field>

              <Field label="BGM/사운드 방향">
                <textarea
                  value={active.bgm}
                  onChange={(e) => updateScene(active.id, 'bgm', e.target.value)}
                  placeholder="예: 슬픈 피아노 솔로, 웅장한 오케스트라, 무음 처리"
                  rows={2}
                  className="input-field resize-none"
                />
              </Field>
            </div>

            <Field label="추가 지시사항/PD 노트">
              <textarea
                value={active.notes}
                onChange={(e) => updateScene(active.id, 'notes', e.target.value)}
                placeholder="기타 중요한 연출 의도, 레퍼런스, 금기사항 등을 자유롭게 입력해주세요."
                rows={2}
                className="input-field resize-none"
              />
            </Field>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-slate-500 py-12">
              <div className="text-4xl mb-3">🎬</div>
              <p>씬을 추가하거나 선택해주세요</p>
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

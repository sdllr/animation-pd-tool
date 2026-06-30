'use client';

import type { ProjectInfo } from '@/types';

interface Props {
  data: ProjectInfo;
  onChange: (data: ProjectInfo) => void;
}

const GENRES = ['판타지', '로맨스', '액션', 'SF', '슬라이스 오브 라이프', '호러', '스릴러', '미스터리', '스포츠', '음악', '코미디', '역사', '이세계', '모험'];
const ART_STYLES = ['일본 애니메이션 (셀 애니)', '웹툰풍', '아메리칸 카툰', '리얼리스틱', 'SD/치비', '수채화풍', '누아르', '레트로 70-80s', '모에계'];
const TONES = ['밝고 경쾌함', '진지하고 어두움', '감동적/잔잔함', '긴장감/스릴', '로맨틱', '코믹/개그', '혼합 (밝음+어둠)', '서정적/몽환적'];
const AUDIENCES = ['어린이 (7세 이하)', '키즈 (7-12세)', '청소년 (13-18세)', '청년 (19-25세)', '성인 일반', '성인 (18+)', '전 연령'];

export default function ProjectInfoForm({ data, onChange }: Props) {
  const update = (key: keyof ProjectInfo, value: string) =>
    onChange({ ...data, [key]: value });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">작품 기본 정보</h2>
        <p className="text-sm text-slate-400">제작할 애니메이션의 전반적인 정보를 입력해주세요.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="작품 제목" required>
          <input
            type="text"
            value={data.title}
            onChange={(e) => update('title', e.target.value)}
            placeholder="예: 별빛을 삼킨 소년"
            className="input-field"
          />
        </Field>

        <Field label="장르">
          <div className="flex gap-2">
            <select
              value={data.genre}
              onChange={(e) => update('genre', e.target.value)}
              className="input-field"
            >
              <option value="">장르 선택</option>
              {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
            <input
              type="text"
              value={data.genre}
              onChange={(e) => update('genre', e.target.value)}
              placeholder="직접 입력"
              className="input-field flex-1"
            />
          </div>
        </Field>

        <Field label="아트 스타일">
          <div className="flex gap-2">
            <select
              value={data.artStyle}
              onChange={(e) => update('artStyle', e.target.value)}
              className="input-field"
            >
              <option value="">스타일 선택</option>
              {ART_STYLES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <input
              type="text"
              value={data.artStyle}
              onChange={(e) => update('artStyle', e.target.value)}
              placeholder="직접 입력"
              className="input-field flex-1"
            />
          </div>
        </Field>

        <Field label="전체 톤/분위기">
          <div className="flex gap-2">
            <select
              value={data.tone}
              onChange={(e) => update('tone', e.target.value)}
              className="input-field"
            >
              <option value="">분위기 선택</option>
              {TONES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <input
              type="text"
              value={data.tone}
              onChange={(e) => update('tone', e.target.value)}
              placeholder="직접 입력"
              className="input-field flex-1"
            />
          </div>
        </Field>

        <Field label="타겟 시청자">
          <select
            value={data.targetAudience}
            onChange={(e) => update('targetAudience', e.target.value)}
            className="input-field"
          >
            <option value="">시청자층 선택</option>
            {AUDIENCES.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </Field>

        <Field label="작품 배경 (세계관)">
          <input
            type="text"
            value={data.setting}
            onChange={(e) => update('setting', e.target.value)}
            placeholder="예: 마법이 존재하는 중세 판타지 왕국"
            className="input-field"
          />
        </Field>
      </div>

      <Field label="주제/테마">
        <input
          type="text"
          value={data.theme}
          onChange={(e) => update('theme', e.target.value)}
          placeholder="예: 성장, 우정, 자아 발견, 복수와 용서"
          className="input-field"
        />
      </Field>

      <Field label="시놉시스">
        <textarea
          value={data.synopsis}
          onChange={(e) => update('synopsis', e.target.value)}
          placeholder="작품의 전반적인 줄거리를 입력해주세요. 주인공의 목표, 주요 갈등, 결말 방향 등을 포함하면 좋습니다."
          rows={5}
          className="input-field resize-none"
        />
      </Field>
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

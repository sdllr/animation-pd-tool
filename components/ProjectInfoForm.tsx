'use client';

import type { ProjectInfo, ProjectType, EtcSubType } from '@/types';

interface Props {
  data: ProjectInfo;
  onChange: (data: ProjectInfo) => void;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const PROJECT_TYPE_CARDS: {
  type: ProjectType;
  icon: string;
  label: string;
  subLabel: string;
  detail: string;
  border: string;
  iconBg: string;
}[] = [
  {
    type: 'series',
    icon: '📺',
    label: '시리즈물',
    subLabel: '여러 회차로 이어지는 연재형 애니메이션',
    detail: '세계관 · 캐릭터 일관성 · 회차 확장성 중심으로 기획합니다.',
    border: 'border-violet-500/40 hover:border-violet-400 hover:bg-violet-500/10',
    iconBg: 'bg-violet-500/20 text-violet-300',
  },
  {
    type: 'short_film',
    icon: '🎬',
    label: '단편물',
    subLabel: '한 편 안에서 완결되는 애니메이션',
    detail: '주제 · 감정선 · 기승전결 · 엔딩 중심으로 기획합니다.',
    border: 'border-emerald-500/40 hover:border-emerald-400 hover:bg-emerald-500/10',
    iconBg: 'bg-emerald-500/20 text-emerald-300',
  },
  {
    type: 'pilot',
    icon: '🚀',
    label: '파일럿',
    subLabel: '시리즈화 가능성을 테스트하는 샘플 영상',
    detail: '캐릭터 매력 · 톤 · 세계관 반응 중심으로 기획합니다.',
    border: 'border-amber-500/40 hover:border-amber-400 hover:bg-amber-500/10',
    iconBg: 'bg-amber-500/20 text-amber-300',
  },
  {
    type: 'etc',
    icon: '🎨',
    label: '기타',
    subLabel: '광고, 뮤직비디오, 숏폼 클립, 실험 영상 등',
    detail: '목적에 맞는 영상 구조를 함께 정합니다.',
    border: 'border-rose-500/40 hover:border-rose-400 hover:bg-rose-500/10',
    iconBg: 'bg-rose-500/20 text-rose-300',
  },
];

const ETC_SUB_OPTIONS: { type: EtcSubType; icon: string; label: string; desc: string }[] = [
  { type: 'ad',           icon: '📣', label: '광고/홍보',   desc: '브랜드, 제품, 캠페인 홍보 영상' },
  { type: 'mv',           icon: '🎵', label: '뮤직비디오', desc: '음악에 맞춘 비주얼라이저' },
  { type: 'shortform',    icon: '📱', label: '숏폼/밈',    desc: '15~60초, SNS용 클립 영상' },
  { type: 'education',    icon: '📚', label: '교육/설명',  desc: '개념, 정보 전달 영상' },
  { type: 'experimental', icon: '🔬', label: '실험 영상',  desc: '형식·기법 탐구 실험적 작업' },
  { type: 'unknown',      icon: '💭', label: '아직 모르겠음', desc: '기획이 덜 잡힌 단계' },
];

const GENRES = ['판타지', '로맨스', '액션', 'SF', '슬라이스 오브 라이프', '호러', '스릴러', '미스터리', '스포츠', '음악', '코미디', '역사', '이세계', '모험'];
const ART_STYLES = ['일본 애니메이션 (셀 애니)', '웹툰풍', '아메리칸 카툰', '리얼리스틱', 'SD/치비', '수채화풍', '누아르', '레트로 70-80s', '모에계'];
const TONES = ['밝고 경쾌함', '진지하고 어두움', '감동적/잔잔함', '긴장감/스릴', '로맨틱', '코믹/개그', '혼합 (밝음+어둠)', '서정적/몽환적'];
const AUDIENCES = ['어린이 (7세 이하)', '키즈 (7-12세)', '청소년 (13-18세)', '청년 (19-25세)', '성인 일반', '성인 (18+)', '전 연령'];

// ─── Main component ───────────────────────────────────────────────────────────

export default function ProjectInfoForm({ data, onChange }: Props) {
  const update = (key: keyof ProjectInfo, value: string) =>
    onChange({ ...data, [key]: value });

  const selectType = (type: ProjectType) =>
    onChange({ ...data, projectType: type, etcSubType: '' });

  const clearType = () =>
    onChange({ ...data, projectType: '', etcSubType: '' });

  const clearEtcSub = () =>
    onChange({ ...data, etcSubType: '' });

  // Step 0: 유형 미선택 → 카드 선택기
  if (!data.projectType) {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">작품 기획 시작하기</h2>
          <p className="text-slate-400 leading-relaxed">
            어떤 형태의 애니메이션을 만들고 싶나요?<br />
            <span className="text-slate-500 text-sm">
              작품 유형을 선택하면 AI PD가 필요한 질문을 이어가며 기획을 도와드립니다.
            </span>
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {PROJECT_TYPE_CARDS.map((card) => (
            <button
              key={card.type}
              onClick={() => selectType(card.type)}
              className={`text-left p-5 rounded-2xl border-2 bg-slate-800/40 transition-all ${card.border}`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 ${card.iconBg}`}>
                {card.icon}
              </div>
              <p className="text-base font-bold text-white mb-1">{card.label}</p>
              <p className="text-sm text-slate-300 mb-2">{card.subLabel}</p>
              <p className="text-xs text-slate-500">{card.detail}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const typeCard = PROJECT_TYPE_CARDS.find((c) => c.type === data.projectType)!;

  // Step 0.5 (기타만): 세부 유형 미선택 → 세부 선택기
  if (data.projectType === 'etc' && !data.etcSubType) {
    return (
      <div className="space-y-6">
        <TypeHeader card={typeCard} onBack={clearType} />
        <div>
          <p className="text-sm font-semibold text-slate-300 mb-3">어떤 유형에 가장 가까운가요?</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {ETC_SUB_OPTIONS.map((opt) => (
              <button
                key={opt.type}
                onClick={() => update('etcSubType', opt.type)}
                className="text-left p-4 rounded-xl border border-slate-700 bg-slate-800/50 hover:border-rose-500/50 hover:bg-rose-500/10 transition-all"
              >
                <span className="text-xl">{opt.icon}</span>
                <p className="text-sm font-semibold text-white mt-2">{opt.label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{opt.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Step 1: 유형별 폼
  const etcSub = ETC_SUB_OPTIONS.find((s) => s.type === data.etcSubType);
  const backAction = data.projectType === 'etc' ? clearEtcSub : clearType;

  return (
    <div className="space-y-6">
      <TypeHeader card={typeCard} subLabel={etcSub ? `${etcSub.icon} ${etcSub.label}` : undefined} onBack={backAction} />
      {data.projectType === 'series'     && <SeriesForm    data={data} update={update} />}
      {data.projectType === 'short_film' && <ShortFilmForm data={data} update={update} />}
      {data.projectType === 'pilot'      && <PilotForm     data={data} update={update} />}
      {data.projectType === 'etc'        && <EtcForm       data={data} update={update} />}
    </div>
  );
}

// ─── TypeHeader ───────────────────────────────────────────────────────────────

function TypeHeader({
  card, subLabel, onBack,
}: {
  card: typeof PROJECT_TYPE_CARDS[0];
  subLabel?: string;
  onBack: () => void;
}) {
  return (
    <div className="flex items-center gap-4 pb-2 border-b border-slate-800">
      <button
        onClick={onBack}
        className="text-xs text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1"
      >
        ← 유형 변경
      </button>
      <div className="flex items-center gap-2">
        <span className="text-lg">{card.icon}</span>
        <span className="text-sm font-bold text-white">{card.label}</span>
        {subLabel && (
          <>
            <span className="text-slate-700">·</span>
            <span className="text-sm text-slate-400">{subLabel}</span>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Shared helpers ───────────────────────────────────────────────────────────

function Q({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-slate-200">{label}</label>
      {hint && <p className="text-xs text-slate-500 -mt-0.5">{hint}</p>}
      {children}
    </div>
  );
}

function Divider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 pt-1">
      <div className="h-px flex-1 bg-slate-800" />
      <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-widest">{label}</span>
      <div className="h-px flex-1 bg-slate-800" />
    </div>
  );
}

function SelectAndInput({ value, onChange, options, placeholder }: {
  value: string; onChange: (v: string) => void; options: string[]; placeholder: string;
}) {
  return (
    <div className="flex gap-2">
      <select
        value={options.includes(value) ? value : ''}
        onChange={(e) => onChange(e.target.value)}
        className="input-field w-auto"
      >
        <option value="">선택</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input-field flex-1"
      />
    </div>
  );
}

// ─── Series form ──────────────────────────────────────────────────────────────

function SeriesForm({ data, update }: { data: ProjectInfo; update: (k: keyof ProjectInfo, v: string) => void }) {
  return (
    <div className="space-y-5">
      <Divider label="기본 정보" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Q label="시리즈 제목" hint="임시 제목도 괜찮아요.">
          <input type="text" value={data.title} onChange={(e) => update('title', e.target.value)}
            placeholder="예: 고양이 정복단" className="input-field" />
        </Q>
        <Q label="장르">
          <SelectAndInput value={data.genre} onChange={(v) => update('genre', v)} options={GENRES} placeholder="직접 입력" />
        </Q>
        <Q label="타깃 시청자">
          <select value={data.targetAudience} onChange={(e) => update('targetAudience', e.target.value)} className="input-field">
            <option value="">선택</option>
            {AUDIENCES.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </Q>
        <Q label="회차 수">
          <input type="text" value={data.episodeCount ?? ''} onChange={(e) => update('episodeCount', e.target.value)}
            placeholder="예: 12화, 24화, 미정" className="input-field" />
        </Q>
        <Q label="회당 러닝타임">
          <input type="text" value={data.episodeRuntime ?? ''} onChange={(e) => update('episodeRuntime', e.target.value)}
            placeholder="예: 5분, 11분, 22분" className="input-field" />
        </Q>
        <Q label="아트 스타일">
          <SelectAndInput value={data.artStyle} onChange={(v) => update('artStyle', v)} options={ART_STYLES} placeholder="직접 입력" />
        </Q>
        <Q label="전체 톤/분위기">
          <SelectAndInput value={data.tone} onChange={(v) => update('tone', v)} options={TONES} placeholder="직접 입력" />
        </Q>
      </div>

      <Divider label="스토리 핵심" />
      <Q label="시리즈 로그라인" hint="이 시리즈를 한 문장으로 설명한다면?">
        <textarea value={data.synopsis} onChange={(e) => update('synopsis', e.target.value)}
          placeholder="예: 서울 골목에 사는 고양이들이 매회 도시 정복을 시도하지만 언제나 귀엽게 실패한다."
          rows={2} className="input-field resize-none" />
      </Q>
      <Q label="세계관" hint="이 작품이 펼쳐지는 세계를 간단히">
        <textarea value={data.setting} onChange={(e) => update('setting', e.target.value)}
          placeholder="예: 현대 서울, 사람들 모르게 고양이들만의 지하 왕국이 존재한다."
          rows={2} className="input-field resize-none" />
      </Q>
      <Q label="주제/테마">
        <input type="text" value={data.theme} onChange={(e) => update('theme', e.target.value)}
          placeholder="예: 실패해도 괜찮아, 우정, 성장" className="input-field" />
      </Q>

      <Divider label="캐릭터" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Q label="주인공" hint="이름 + 핵심 특징">
          <input type="text" value={data.mainCharacter ?? ''} onChange={(e) => update('mainCharacter', e.target.value)}
            placeholder="예: 나르시, 자신이 최강이라 믿는 고양이" className="input-field" />
        </Q>
        <Q label="고정 캐릭터" hint="매회 함께 등장하는 캐릭터들">
          <input type="text" value={data.recurringCharacters ?? ''} onChange={(e) => update('recurringCharacters', e.target.value)}
            placeholder="예: 소심한 참모 두부, 열정 넘치는 냥군단" className="input-field" />
        </Q>
      </div>

      <Divider label="시리즈 구조" />
      <Q label="매회 반복되는 구조" hint="각 에피소드가 어떤 패턴으로 흘러가나요?">
        <textarea value={data.recurringStructure ?? ''} onChange={(e) => update('recurringStructure', e.target.value)}
          placeholder="예: 선언 → 작전 실행 → 예상 밖의 사건 → 귀엽게 실패 → 다음 편 예고"
          rows={2} className="input-field resize-none" />
      </Q>
      <Q label="시즌 전체 목표" hint="마지막 화에 어떤 변화가 일어나야 하나요?">
        <textarea value={data.seasonGoal ?? ''} onChange={(e) => update('seasonGoal', e.target.value)}
          placeholder="예: 나르시가 진정한 리더십의 의미를 깨닫고 팀과 함께 성장한다."
          rows={2} className="input-field resize-none" />
      </Q>
      <Q label="회차별 장소/테마" hint="에피소드마다 달라지는 배경이나 소재가 있다면">
        <textarea value={data.episodeThemes ?? ''} onChange={(e) => update('episodeThemes', e.target.value)}
          placeholder="예: 1화 편의점, 2화 지하철, 3화 한강공원 / 테마: 음식, 교통, 자연..."
          rows={2} className="input-field resize-none" />
      </Q>
    </div>
  );
}

// ─── Short film form ──────────────────────────────────────────────────────────

function ShortFilmForm({ data, update }: { data: ProjectInfo; update: (k: keyof ProjectInfo, v: string) => void }) {
  return (
    <div className="space-y-5">
      <Divider label="기본 정보" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Q label="작품 제목">
          <input type="text" value={data.title} onChange={(e) => update('title', e.target.value)}
            placeholder="예: 5시의 기억" className="input-field" />
        </Q>
        <Q label="러닝타임">
          <input type="text" value={data.runtime ?? ''} onChange={(e) => update('runtime', e.target.value)}
            placeholder="예: 3분, 8분, 20분" className="input-field" />
        </Q>
        <Q label="장르">
          <SelectAndInput value={data.genre} onChange={(v) => update('genre', v)} options={GENRES} placeholder="직접 입력" />
        </Q>
        <Q label="아트 스타일">
          <SelectAndInput value={data.artStyle} onChange={(v) => update('artStyle', v)} options={ART_STYLES} placeholder="직접 입력" />
        </Q>
        <Q label="톤/분위기">
          <SelectAndInput value={data.tone} onChange={(v) => update('tone', v)} options={TONES} placeholder="직접 입력" />
        </Q>
        <Q label="주제">
          <input type="text" value={data.theme} onChange={(e) => update('theme', e.target.value)}
            placeholder="예: 기억, 작별, 성장" className="input-field" />
        </Q>
      </div>

      <Divider label="감정 목표" />
      <Q label="시청자가 마지막에 느낄 감정" hint="이 단편을 보고 나서 어떤 감정을 가져가길 원하나요?">
        <input type="text" value={data.emotionalGoal ?? ''} onChange={(e) => update('emotionalGoal', e.target.value)}
          placeholder="예: 따뜻한 여운, 통쾌한 반전, 먹먹한 슬픔, 귀여움" className="input-field" />
      </Q>

      <Divider label="스토리" />
      <Q label="주인공" hint="이름 + 핵심 특징">
        <input type="text" value={data.mainCharacter ?? ''} onChange={(e) => update('mainCharacter', e.target.value)}
          placeholder="예: 민지, 기억을 잃어가는 20대 여성" className="input-field" />
      </Q>
      <Q label="시놉시스" hint="주인공의 목표, 주요 사건, 결말 방향 포함">
        <textarea value={data.synopsis} onChange={(e) => update('synopsis', e.target.value)}
          placeholder="자유롭게 써주세요. 방향성만 있어도 됩니다."
          rows={4} className="input-field resize-none" />
      </Q>
      <Q label="작품 배경 (세계관)">
        <input type="text" value={data.setting} onChange={(e) => update('setting', e.target.value)}
          placeholder="예: 현대 서울, 어느 여름의 끝자락" className="input-field" />
      </Q>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Q label="핵심 갈등">
          <textarea value={data.mainConflict ?? ''} onChange={(e) => update('mainConflict', e.target.value)}
            placeholder="예: 주인공이 과거와 현재 사이에서 선택을 강요받는다." rows={2} className="input-field resize-none" />
        </Q>
        <Q label="반전 (있다면)">
          <textarea value={data.reversal ?? ''} onChange={(e) => update('reversal', e.target.value)}
            placeholder="예: 사실 모든 사건이 꿈이었다." rows={2} className="input-field resize-none" />
        </Q>
        <Q label="엔딩">
          <textarea value={data.ending ?? ''} onChange={(e) => update('ending', e.target.value)}
            placeholder="해피엔딩 / 새드엔딩 / 열린 결말..." rows={2} className="input-field resize-none" />
        </Q>
        <Q label="감정선 흐름">
          <textarea value={data.emotionalArc ?? ''} onChange={(e) => update('emotionalArc', e.target.value)}
            placeholder="예: 일상 → 혼란 → 깨달음 → 해방 → 여운" rows={2} className="input-field resize-none" />
        </Q>
      </div>
      <Q label="꼭 그려야 할 핵심 장면" hint="중요한 비주얼 씬을 간단히 메모해주세요.">
        <textarea value={data.keyScenes ?? ''} onChange={(e) => update('keyScenes', e.target.value)}
          placeholder="예: ① 오래된 사진을 발견하는 장면  ② 빗속에서 달리는 장면  ③ 마지막 문이 닫히는 장면"
          rows={3} className="input-field resize-none" />
      </Q>
    </div>
  );
}

// ─── Pilot form ───────────────────────────────────────────────────────────────

function PilotForm({ data, update }: { data: ProjectInfo; update: (k: keyof ProjectInfo, v: string) => void }) {
  return (
    <div className="space-y-5">
      <Divider label="기본 정보" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Q label="파일럿 제목">
          <input type="text" value={data.title} onChange={(e) => update('title', e.target.value)}
            placeholder="예: 별빛 탐정 – 파일럿" className="input-field" />
        </Q>
        <Q label="러닝타임">
          <input type="text" value={data.runtime ?? ''} onChange={(e) => update('runtime', e.target.value)}
            placeholder="예: 5분, 12분" className="input-field" />
        </Q>
        <Q label="장르">
          <SelectAndInput value={data.genre} onChange={(v) => update('genre', v)} options={GENRES} placeholder="직접 입력" />
        </Q>
        <Q label="타깃 시청자">
          <select value={data.targetAudience} onChange={(e) => update('targetAudience', e.target.value)} className="input-field">
            <option value="">선택</option>
            {AUDIENCES.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </Q>
        <Q label="아트 스타일">
          <SelectAndInput value={data.artStyle} onChange={(v) => update('artStyle', v)} options={ART_STYLES} placeholder="직접 입력" />
        </Q>
        <Q label="테스트할 톤">
          <SelectAndInput value={data.tone} onChange={(v) => update('tone', v)} options={TONES} placeholder="직접 입력" />
        </Q>
      </div>

      <Divider label="검증 목적" />
      <Q label="이 파일럿에서 검증하고 싶은 것" hint="무엇을 확인하기 위해 파일럿을 만드나요?">
        <textarea value={data.validationPoints ?? ''} onChange={(e) => update('validationPoints', e.target.value)}
          placeholder="예: 캐릭터 매력 / 세계관 반응 / 코미디 톤 / 비주얼 스타일 / 시리즈 확장성"
          rows={2} className="input-field resize-none" />
      </Q>

      <Divider label="작품 핵심" />
      <Q label="주인공 매력 포인트" hint="시청자가 '또 보고 싶다'고 느끼게 하는 요소">
        <textarea value={data.characterAppeal ?? ''} onChange={(e) => update('characterAppeal', e.target.value)}
          placeholder="예: 겉은 쿨하지만 속은 덜렁대는 탐정, 실수할 때 귀여운 반응"
          rows={2} className="input-field resize-none" />
      </Q>
      <Q label="세계관 핵심 훅" hint="시청자가 이 세계에 흥미를 갖게 하는 결정적 요소">
        <textarea value={data.worldCore ?? ''} onChange={(e) => update('worldCore', e.target.value)}
          placeholder="예: 모든 사람이 꿈속에서 다른 사람의 기억을 훔칠 수 있는 세계"
          rows={2} className="input-field resize-none" />
      </Q>
      <Q label="작품 배경 (세계관)">
        <textarea value={data.setting} onChange={(e) => update('setting', e.target.value)}
          placeholder="세계관을 조금 더 구체적으로 설명해주세요." rows={2} className="input-field resize-none" />
      </Q>
      <Q label="파일럿 시놉시스" hint="이 편에서 일어나는 사건의 흐름">
        <textarea value={data.synopsis} onChange={(e) => update('synopsis', e.target.value)}
          placeholder="주인공 소개 → 사건 발생 → 핵심 매력 드러나는 순간 → 훅"
          rows={3} className="input-field resize-none" />
      </Q>
      <Q label="시리즈 확장 가능성" hint="파일럿 이후 어떻게 이어질 수 있나요?">
        <textarea value={data.expansionPotential ?? ''} onChange={(e) => update('expansionPotential', e.target.value)}
          placeholder="예: 에피소드마다 다른 꿈 세계 탐험, 시즌 빌런과의 대결로 이어짐"
          rows={2} className="input-field resize-none" />
      </Q>
    </div>
  );
}

// ─── Etc form ─────────────────────────────────────────────────────────────────

function EtcForm({ data, update }: { data: ProjectInfo; update: (k: keyof ProjectInfo, v: string) => void }) {
  const sub = ETC_SUB_OPTIONS.find((s) => s.type === data.etcSubType);
  return (
    <div className="space-y-5">
      <Divider label="기본 정보" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Q label="작품/프로젝트명">
          <input type="text" value={data.title} onChange={(e) => update('title', e.target.value)}
            placeholder={sub?.type === 'ad' ? '예: 코코아 브랜드 봄 캠페인' : '예: 프로젝트 네모'}
            className="input-field" />
        </Q>
        <Q label="러닝타임">
          <input type="text" value={data.runtime ?? ''} onChange={(e) => update('runtime', e.target.value)}
            placeholder="예: 30초, 2분, 5분" className="input-field" />
        </Q>
        <Q label="타깃 시청자">
          <select value={data.targetAudience} onChange={(e) => update('targetAudience', e.target.value)} className="input-field">
            <option value="">선택</option>
            {AUDIENCES.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </Q>
        <Q label="아트 스타일">
          <SelectAndInput value={data.artStyle} onChange={(v) => update('artStyle', v)} options={ART_STYLES} placeholder="직접 입력" />
        </Q>
        <Q label="톤/분위기">
          <SelectAndInput value={data.tone} onChange={(v) => update('tone', v)} options={TONES} placeholder="직접 입력" />
        </Q>
      </div>

      <Divider label="목적과 메시지" />
      <Q label="제작 목적/용도" hint="이 영상이 어디에, 왜 사용되나요?">
        <textarea value={data.contentPurpose ?? ''} onChange={(e) => update('contentPurpose', e.target.value)}
          placeholder={sub?.type === 'ad' ? '예: 봄 시즌 신제품 홍보, SNS 광고 소재' : '예: 개인 작품, 페스티벌 출품'}
          rows={2} className="input-field resize-none" />
      </Q>
      <Q label="핵심 메시지" hint="시청자에게 전달하고 싶은 한 가지">
        <input type="text" value={data.coreMessage ?? ''} onChange={(e) => update('coreMessage', e.target.value)}
          placeholder="예: 이 브랜드는 당신의 일상을 더 따뜻하게 만든다." className="input-field" />
      </Q>
      <Q label="시청자의 목표 반응" hint="영상을 보고 어떤 행동/감정을 유도하고 싶나요?">
        <input type="text" value={data.targetResponse ?? ''} onChange={(e) => update('targetResponse', e.target.value)}
          placeholder="예: 공유하고 싶다, 구매하고 싶다, 여운이 남는다" className="input-field" />
      </Q>
      <Q label="작품 배경 (세계관)">
        <input type="text" value={data.setting} onChange={(e) => update('setting', e.target.value)}
          placeholder="예: 파스텔톤의 아기자기한 도시" className="input-field" />
      </Q>
      <Q label="영상 구조/시놉시스" hint="영상의 흐름이나 구성을 자유롭게">
        <textarea value={data.synopsis} onChange={(e) => update('synopsis', e.target.value)}
          placeholder="오프닝 → 핵심 장면 → 클라이맥스 → 엔딩 방향으로 설명해주세요."
          rows={4} className="input-field resize-none" />
      </Q>
    </div>
  );
}

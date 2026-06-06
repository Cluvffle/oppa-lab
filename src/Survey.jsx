import { useState } from 'react'

// ✅ 여기에 Google Apps Script 배포 URL을 입력하세요
const APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL || ''

const STEPS = [
  {
    num: 1,
    title: '기본 정보 📋',
    sub: '부담 없이 답해줘도 돼요. 닉네임으로 해도 OK!',
  },
  {
    num: 2,
    title: '외적 매력 점검 👔',
    sub: '솔직하게 체크해줄수록 정확한 진단이 가능해요',
  },
  {
    num: 3,
    title: '내면 & 대화 능력 🗣️',
    sub: '연애에서 가장 중요한 영역이에요',
  },
  {
    num: 4,
    title: '연애 이력 & 현재 상황 💔',
    sub: '판단 절대 없어요. 솔직할수록 좋아요',
  },
  {
    num: 5,
    title: '코칭 목표 🎯',
    sub: '마지막이에요! 연락처 남겨주시면 리포트 보내드려요',
  },
]

function OptionSelect({ name, options, value, onChange, multi = false, grid = false }) {
  const isSelected = (opt) => multi ? (value || []).includes(opt) : value === opt

  const handleClick = (opt) => {
    if (multi) {
      const current = value || []
      onChange(
        current.includes(opt)
          ? current.filter(v => v !== opt)
          : [...current, opt]
      )
    } else {
      onChange(opt)
    }
  }

  return (
    <div className={grid ? 'q-options q-options-grid' : 'q-options'}>
      {options.map((opt, i) => (
        <label
          key={i}
          className={`q-option${isSelected(opt) ? ' selected' : ''}`}
          onClick={(e) => { e.preventDefault(); handleClick(opt) }}
        >
          <input
            type={multi ? 'checkbox' : 'radio'}
            name={name}
            value={opt}
            checked={isSelected(opt)}
            onChange={() => {}}
            style={{ pointerEvents: 'none' }}
          />
          <span className="q-option-label">{opt}</span>
        </label>
      ))}
    </div>
  )
}

function SliderInput({ value, onChange, min = 1, max = 10, label }) {
  return (
    <div>
      <input
        type="range" min={min} max={max}
        value={value || Math.floor((max - min) / 2) + min}
        onChange={e => onChange(Number(e.target.value))}
        className="q-slider" style={{ width: '100%' }}
      />
      <div className="q-slider-labels">
        <span>😔 {min}점 (최하)</span>
        <span>{max}점 (최고) 😎</span>
      </div>
      <div className="q-slider-value">
        {value || Math.floor((max - min) / 2) + min}점
      </div>
    </div>
  )
}

export default function Survey({ onComplete, onBack }) {
  const [step, setStep] = useState(0)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState({
    nickname: '',
    age_job: '',
    relationship_status: '',
    income: '',
    fashion_level: '',
    grooming_level: '',
    fitness_level: '',
    talk_feeling: '',
    self_esteem: 5,
    biggest_fear: '',
    dating_count: '',
    current_situation: '',
    goals: [],
    future_vision: '',
    contact: '',
  })

  const set = (key, val) => setData(prev => ({ ...prev, [key]: val }))

  const stepsContent = [
    // STEP 1 — 기본 정보
    <div className="survey-questions" key="step1">
      <div>
        <label className="q-label">Q1. 어떻게 불러드릴까요? 😊</label>
        <span className="q-sub">닉네임 or 이름 아무거나 OK</span>
        <input className="q-input" placeholder="예) 철수, 매력있는오빠" value={data.nickname} onChange={e => set('nickname', e.target.value)} />
      </div>
      <div>
        <label className="q-label">Q2. 나이와 하시는 일을 간단히 알려주세요 📝</label>
        <input className="q-input" placeholder="예) 28살, 회사원 / 32살, 프리랜서" value={data.age_job} onChange={e => set('age_job', e.target.value)} />
      </div>
      <div>
        <label className="q-label">Q3. 현재 연애 상태는요? 💑</label>
        <OptionSelect
          name="relationship_status"
          value={data.relationship_status}
          onChange={v => set('relationship_status', v)}
          options={[
            '모태솔로 (연애 경험 없음)',
            '연애 경험 있음 (3년 이상 전)',
            '연애 경험 있음 (최근 1~3년)',
            '지금 썸 or 관심 있는 사람 있음',
          ]}
        />
      </div>
      <div>
        <label className="q-label">Q4. 대략적인 월 소득 수준은요? 💰</label>
        <OptionSelect
          name="income"
          value={data.income}
          onChange={v => set('income', v)}
          options={['200만원 미만', '200~300만원', '300~500만원', '500만원 이상 / 사업자']}
          grid
        />
      </div>
    </div>,

    // STEP 2 — 외적 매력
    <div className="survey-questions" key="step2">
      <div>
        <label className="q-label">Q5. 평소 패션 스타일은 어느 정도예요? 👔</label>
        <OptionSelect
          name="fashion_level"
          value={data.fashion_level}
          onChange={v => set('fashion_level', v)}
          options={[
            '😅 거의 신경 안 씀 (편한 것 위주)',
            '🙂 기본 수준 (깔끔한 캐주얼)',
            '😊 나름 신경 씀 (트렌드 의식)',
            '😎 패션에 투자하는 편',
          ]}
        />
      </div>
      <div>
        <label className="q-label">Q6. 피부 관리, 헤어, 향수 등 그루밍 수준은요? 🪥</label>
        <OptionSelect
          name="grooming_level"
          value={data.grooming_level}
          onChange={v => set('grooming_level', v)}
          options={[
            '😅 전혀 신경 안 씀',
            '🙂 기본 세안/샴푸 정도',
            '😊 스킨케어 루틴 있음',
            '😎 정기적 관리 (피부과·미용실 등)',
          ]}
        />
      </div>
      <div>
        <label className="q-label">Q7. 운동/체형 관리는 어느 정도 하세요? 💪</label>
        <OptionSelect
          name="fitness_level"
          value={data.fitness_level}
          onChange={v => set('fitness_level', v)}
          options={[
            '😅 거의 안 함',
            '🙂 가끔 (월 1~2회)',
            '😊 주 1~2회 꾸준히',
            '😎 주 3회 이상 루틴 있음',
          ]}
          grid
        />
      </div>
    </div>,

    // STEP 3 — 내면 & 대화
    <div className="survey-questions" key="step3">
      <div>
        <label className="q-label">Q8. 여자와 단둘이 대화할 때 어떤 기분이에요? 🗣️</label>
        <OptionSelect
          name="talk_feeling"
          value={data.talk_feeling}
          onChange={v => set('talk_feeling', v)}
          options={[
            '😰 심하게 긴장하고 말이 막힌다',
            '😅 어색하지만 어느 정도는 된다',
            '🙂 친구처럼 편하게 대화 가능',
            '😄 오히려 설레고 텐션이 올라간다',
          ]}
        />
      </div>
      <div>
        <label className="q-label">Q9. 지금 자존감 점수는 몇 점이에요? 🪞</label>
        <SliderInput
          value={data.self_esteem}
          onChange={v => set('self_esteem', v)}
        />
      </div>
      <div>
        <label className="q-label">Q10. 연애에서 가장 두려운 게 뭐예요? 💭</label>
        <OptionSelect
          name="biggest_fear"
          value={data.biggest_fear}
          onChange={v => set('biggest_fear', v)}
          options={[
            '💔 거절당하는 것',
            '😔 상대를 실망시키는 것',
            '😬 고백 후 관계가 어색해지는 것',
            '😟 시작해도 유지 못 할 것 같은 것',
          ]}
        />
      </div>
    </div>,

    // STEP 4 — 연애 이력
    <div className="survey-questions" key="step4">
      <div>
        <label className="q-label">Q11. 지금까지 연애를 몇 번 해봤어요? 💑</label>
        <OptionSelect
          name="dating_count"
          value={data.dating_count}
          onChange={v => set('dating_count', v)}
          options={[
            '0번 (모태솔로)',
            '1~2번',
            '3~5번',
            '6번 이상',
          ]}
          grid
        />
      </div>
      <div>
        <label className="q-label">Q12. 지금 가장 급하게 해결하고 싶은 상황이나 고민을 알려줘요 📝</label>
        <span className="q-sub">특정 사람과의 상황, 반복되는 패턴, 모르겠으면 "잘 모르겠어요"도 OK</span>
        <textarea
          className="q-input q-textarea"
          placeholder="예) 소개팅은 잘 잡는데 2~3번 만남 이후 항상 연락이 끊겨요. 이유를 모르겠어요..."
          value={data.current_situation}
          onChange={e => set('current_situation', e.target.value)}
        />
      </div>
    </div>,

    // STEP 5 — 목표 & 연락처
    <div className="survey-questions" key="step5">
      <div>
        <label className="q-label">Q13. 코칭에서 가장 얻고 싶은 게 뭐예요? (복수 선택 OK ✅)</label>
        <OptionSelect
          name="goals"
          value={data.goals}
          onChange={v => set('goals', v)}
          multi
          options={[
            '내가 왜 연애가 안 되는지 파악',
            '여자와 자연스럽게 대화 연습',
            '외모·스타일 개선 방향',
            '고백·썸·소개팅 전략',
            '자신감 회복',
            '현재 관심 있는 사람 관계 발전',
          ]}
        />
      </div>
      <div>
        <label className="q-label">Q14. 코칭 후 3개월 뒤 어떤 모습이 되고 싶어요? 🌟</label>
        <textarea
          className="q-input q-textarea"
          placeholder="예) 소개팅에서 어색하지 않고 자연스럽게 대화할 수 있었으면 좋겠어요..."
          value={data.future_vision}
          onChange={e => set('future_vision', e.target.value)}
        />
      </div>
      <div>
        <label className="q-label">Q15. 리포트 받을 연락처를 남겨줘요 📬</label>
        <span className="q-sub">카카오톡 ID, 전화번호, 이메일 아무거나 OK. 리포트 전달용으로만 사용해요</span>
        <input
          className="q-input"
          placeholder="예) 카톡 ID: oppa123 / 010-XXXX-XXXX"
          value={data.contact}
          onChange={e => set('contact', e.target.value)}
        />
      </div>
    </div>,
  ]

  const validateStep = () => {
    if (step === 0) {
      if (!data.nickname.trim()) return '닉네임을 입력해주세요 :)'
      if (!data.age_job.trim()) return '나이와 하시는 일을 간단히 입력해주세요'
      if (!data.relationship_status) return '연애 상태를 선택해주세요'
      if (!data.income) return '소득 수준을 선택해주세요'
    }
    if (step === 1) {
      if (!data.fashion_level) return '패션 스타일을 선택해주세요'
      if (!data.grooming_level) return '그루밍 수준을 선택해주세요'
      if (!data.fitness_level) return '운동 수준을 선택해주세요'
    }
    if (step === 2) {
      if (!data.talk_feeling) return '대화 시 감정을 선택해주세요'
      if (!data.biggest_fear) return '가장 두려운 것을 선택해주세요'
    }
    if (step === 3) {
      if (!data.dating_count) return '연애 횟수를 선택해주세요'
    }
    if (step === 4) {
      if (data.goals.length === 0) return '코칭 목표를 1개 이상 선택해주세요'
      if (!data.contact.trim()) return '연락처를 입력해주세요 (리포트 전달용)'
    }
    return ''
  }

  const handleNext = () => {
    const err = validateStep()
    if (err) { setError(err); return }
    setError('')
    setStep(prev => prev + 1)
    window.scrollTo(0, 0)
  }

  const handlePrev = () => {
    setError('')
    if (step === 0) onBack()
    else { setStep(prev => prev - 1); window.scrollTo(0, 0) }
  }

  const handleSubmit = async () => {
    const err = validateStep()
    if (err) { setError(err); return }
    setError('')
    setLoading(true)

    const submissionId = `OL-${Date.now().toString(36).toUpperCase()}`
    const payload = { ...data, submissionId, submittedAt: new Date().toLocaleString('ko-KR') }

    try {
      if (APPS_SCRIPT_URL) {
        await fetch(APPS_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      }
    } catch (e) {
      // no-cors 모드에서는 에러 무시 (실제로는 저장됨)
    }

    setLoading(false)
    onComplete(submissionId)
  }

  const isLastStep = step === STEPS.length - 1
  const progress = ((step + 1) / STEPS.length) * 100

  return (
    <div className="survey-page">
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <button className="survey-back" onClick={handlePrev}>
          ← {step === 0 ? '홈으로 돌아가기' : '이전 단계'}
        </button>

        <div className="survey-header">
          <div className="survey-progress-bar">
            <div className="survey-progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <div className="survey-progress-text">
            {step + 1} / {STEPS.length} 단계 완료
          </div>
        </div>

        <div className="survey-card fade-in" key={step}>
          <div className="survey-step-title">{STEPS[step].title}</div>
          <div className="survey-step-sub">{STEPS[step].sub}</div>

          {stepsContent[step]}

          {error && (
            <div className="survey-error">
              ⚠️ {error}
            </div>
          )}

          <div className="survey-nav">
            <button className="btn btn-outline" onClick={handlePrev} disabled={loading}>
              이전
            </button>
            <button
              className="btn btn-primary"
              onClick={isLastStep ? handleSubmit : handleNext}
              disabled={loading}
            >
              {loading
                ? '제출 중...'
                : isLastStep
                  ? '✨ 진단 신청 완료!'
                  : '다음 →'}
            </button>
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-muted)', marginTop: 16 }}>
          🔒 입력하신 정보는 코칭 목적으로만 사용되며 외부에 공개되지 않아요
        </p>
      </div>
    </div>
  )
}

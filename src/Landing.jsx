import { useState } from 'react'

export default function Landing({ onStart }) {
  const [openFaq, setOpenFaq] = useState(null)

  const targets = [
    { icon: '😶', text: '유튜브도 보고 책도 읽었는데\n막상 여자 앞에선 똑같이 얼어붙는 오빠' },
    { icon: '📱', text: '소개팅도 어색하고 앱도 피로하고\n여자와 진짜 교류 자체가 없는 오빠' },
    { icon: '🪞', text: '나를 좋아해줄 사람이 있을까…\n자존감이 바닥을 치는 오빠' },
    { icon: '✨', text: '겉모습보다 내 안의 매력을 키워서\n진짜 알파메일로 거듭나고 싶은 오빠' },
  ]

  const steps = [
    { icon: '📝', num: '01', title: '무료 매력진단 신청', desc: '간단한 설문 작성\n(약 5~7분 소요)' },
    { icon: '🔬', num: '02', title: '심층 진단 & 분석', desc: '여동생 코치가\n직접 분석해드려요' },
    { icon: '💌', num: '03', title: '맞춤 진단 리포트 전달', desc: '강점·문제·처방전\n상세 문서 제공' },
    { icon: '💪', num: '04', title: '실전 코칭 진행', desc: '1:1 대화 훈련부터\n루틴 설계까지' },
  ]

  const features = [
    {
      icon: '👩',
      title: '진짜 여동생 같은 코치',
      desc: '판단 없이 오빠 편에서 이야기 들어줘요. "왜 이것도 못 해요?"가 아니라 "같이 해보자!"가 저희 스타일이에요.',
    },
    {
      icon: '🩺',
      title: '의사처럼 정확한 진단',
      desc: '외적·내면·심리·경제력 4개 영역을 종합 분석해서 진짜 원인이 어디에 있는지 정확하게 짚어드려요.',
    },
    {
      icon: '🎯',
      title: '실전에 바로 쓰이는 처방',
      desc: '이론 말고 오빠 상황에 딱 맞는 행동 목록. "오늘부터 이것만 바꾸면 돼" 수준의 구체 솔루션이에요.',
    },
  ]

  const reviews = [
    {
      text: '"진짜 친한 여동생한테 상담받는 느낌이라 편하게 다 털어놓을 수 있었어요. 왜 연애가 안 됐는지 처음으로 감정적으로 납득됐어요."',
      name: '파란*****',
      plan: 'DELUXE',
      stars: '⭐⭐⭐⭐⭐',
    },
    {
      text: '"리포트 받고 충격받았어요 😂 내가 이런 패턴을 반복하고 있었다는 걸 몰랐거든요. 덕분에 뭘 바꿔야 할지 명확해졌어요!"',
      name: '영원*****',
      plan: 'STANDARD',
      stars: '⭐⭐⭐⭐⭐',
    },
    {
      text: '"최고의 상담이었어요! 다음에도 상담 받으러 올게요 ㅎㅎ 진짜 도움 많이 받았습니다. 번창하세요~"',
      name: '도움*****',
      plan: 'PREMIUM',
      stars: '⭐⭐⭐⭐⭐',
    },
  ]

  const plans = [
    {
      plan: 'STANDARD',
      title: '첫 매력 점검',
      price: '29,000',
      duration: '화상/전화 30분',
      features: [
        '매력진단 설문 분석',
        '화상 or 전화 1회 상담 (30분)',
        '피드백 리포트 문서 제공',
        '핵심 문제 1~2개 집중 처방',
      ],
      popular: false,
    },
    {
      plan: 'DELUXE',
      title: '실전 만남 코칭',
      price: '99,000',
      duration: '오프라인 1회 60분',
      features: [
        'STANDARD 전 항목 포함',
        '오프라인 1:1 실전 코칭 (60분)',
        '대화 시뮬레이션 + 리액션 피드백',
        '상세 매력진단 리포트',
        '1주일 행동 미션 제공',
      ],
      popular: true,
    },
    {
      plan: 'PREMIUM',
      title: '맞춤 매력 설계',
      price: '279,000',
      duration: '오프라인 2회 + 10일 케어',
      features: [
        'DELUXE 전 항목 포함',
        '실전 동행 2회 (운동/쇼핑 등)',
        '온라인 지속 케어 10일',
        '루틴 트래킹 + 일상 피드백',
        '썸·연애 전략 맞춤 설계',
      ],
      popular: false,
    },
  ]

  const faqs = [
    {
      q: '후기가 많지 않은데 믿을 수 있나요?',
      a: '지금 막 시작한 신생 서비스라 후기가 적지만, 현재까지 5건 모두 별점 5.0이에요. 첫 후기를 남겨주시는 분께는 추가 1:1 피드백을 제공해드려요. 진심과 노력으로 채워가고 있어요 :)',
    },
    {
      q: '남자 코치인가요, 여자 코치인가요?',
      a: '여자 코치예요! 실제 여동생 같은 느낌으로 오빠 관점에서 여자가 느끼는 솔직한 시각을 전해드려요. 남자들끼리는 절대 모르는 포인트들을 짚어드릴 수 있어요.',
    },
    {
      q: '모태솔로인데 너무 기초부터 시작해야 할 것 같아서 부끄러워요.',
      a: '오히려 환영이에요! 저희 서비스의 핵심 타겟이 바로 연애 경험이 적은 오빠들이에요. 판단 없이 처음부터 같이 해드릴게요. 부끄러워할 필요 전혀 없어요 :)',
    },
    {
      q: '상담 내용이 외부에 유출될 수 있나요?',
      a: '절대 아니에요. 크몽 윤리규정에 따라 내담자의 사생활과 비밀은 철저히 보호해요. 상담 내용은 코칭 목적으로만 사용되며 외부 공개는 절대 불가해요.',
    },
    {
      q: '오프라인 코칭 장소는 어디인가요?',
      a: '신사 또는 잠실 근처에서 진행되며, 상세 장소는 결제 후 협의를 통해 정해요. 카페, 산책 등 자연스러운 환경에서 진행돼요.',
    },
  ]

  return (
    <>
      {/* 헤더 */}
      <header className="header">
        <div className="header-inner">
          <div className="header-logo">
            <span>오빠 매력연구소</span> 🔬
          </div>
          <nav className="header-nav">
            <a href="#target">대상</a>
            <a href="#reviews">후기</a>
            <a href="#pricing">요금</a>
            <button className="btn btn-primary btn-sm" onClick={onStart}>
              무료 진단 받기 ✨
            </button>
          </nav>
        </div>
      </header>

      {/* 히어로 */}
      <section className="hero">
        <div className="hero-blob hero-blob-1" />
        <div className="hero-blob hero-blob-2" />
        <span className="hero-float" style={{ top: '15%', left: '8%', animationDelay: '0s' }}>💕</span>
        <span className="hero-float" style={{ top: '20%', right: '10%', animationDelay: '-2s' }}>✨</span>
        <span className="hero-float" style={{ bottom: '20%', left: '5%', animationDelay: '-4s' }}>🔬</span>
        <div className="hero-inner fade-in">
          <div className="hero-badge">
            🎉 크몽 리뷰 ⭐5.0 만점 달성 중
          </div>
          <h1 className="hero-title">
            오빠, 이제<br />
            <span className="gradient-text">진짜 바뀔 때야 💪</span>
          </h1>
          <p className="hero-sub">
            여동생이 옆에서 처음부터 같이 해줄게요.<br />
            외모부터 대화까지, <strong>의사처럼 진단</strong>하고 <strong>여동생처럼 처방</strong>해드려요.
          </p>
          <div className="hero-cta">
            <button className="btn btn-primary btn-lg" onClick={onStart}>
              💌 지금 무료 진단 받기
            </button>
            <a href="#pricing" className="btn btn-outline btn-lg">
              요금 보기
            </a>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <div className="hero-stat-num">5.0⭐</div>
              <div className="hero-stat-label">평균 리뷰 점수</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-num">100%</div>
              <div className="hero-stat-label">고객 만족도</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-num">1시간↓</div>
              <div className="hero-stat-label">평균 응답 시간</div>
            </div>
          </div>
        </div>
      </section>

      {/* 대상 */}
      <section className="section target" id="target">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">이런 오빠들에게 딱 맞아요 🙋</h2>
            <p className="section-sub">하나라도 해당된다면, 저희가 도울 수 있어요</p>
          </div>
          <div className="target-grid">
            {targets.map((t, i) => (
              <div className="target-item" key={i}>
                <div className="target-icon">{t.icon}</div>
                <p className="target-text" style={{ whiteSpace: 'pre-line' }}>{t.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 진행 방식 */}
      <section className="section" style={{ background: 'var(--pink-50)' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">이렇게 진행돼요 🗓️</h2>
            <p className="section-sub">복잡한 거 없어요. 설문지 하나로 시작!</p>
          </div>
          <div className="steps-grid">
            {steps.map((s, i) => (
              <div className="step-card card" key={i}>
                <div className="step-num">{s.num}</div>
                <div className="step-icon">{s.icon}</div>
                <div className="step-title">{s.title}</div>
                <p className="step-desc" style={{ whiteSpace: 'pre-line' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 특징 */}
      <section className="section features">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">다른 상담이랑 뭐가 달라요? 🤔</h2>
            <p className="section-sub">오빠 편에서, 진심으로, 실전형으로</p>
          </div>
          <div className="features-grid">
            {features.map((f, i) => (
              <div className="feature-card" key={i}>
                <div className="feature-icon">{f.icon}</div>
                <div className="feature-title">{f.title}</div>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 후기 */}
      <section className="section reviews" id="reviews">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">오빠들의 솔직한 후기 💬</h2>
            <p className="section-sub">실제 고객 후기 (크몽 플랫폼 인증 리뷰)</p>
          </div>
          <div className="reviews-grid">
            {reviews.map((r, i) => (
              <div className="review-card" key={i}>
                <div className="review-stars">{r.stars}</div>
                <p className="review-text">{r.text}</p>
                <div className="review-name">
                  {r.name}
                  <span className="review-plan">{r.plan}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 요금 */}
      <section className="section pricing" id="pricing">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">요금 안내 💳</h2>
            <p className="section-sub">부담 없이 시작할 수 있어요. 무료 진단 먼저!</p>
          </div>
          <div className="pricing-grid">
            {plans.map((p, i) => (
              <div className={`pricing-card${p.popular ? ' popular' : ''}`} key={i}>
                {p.popular && <div className="popular-badge">🔥 가장 인기 있어요</div>}
                <div className="pricing-plan">{p.plan}</div>
                <div className="pricing-title">{p.title}</div>
                <div className="pricing-price">{p.price}<span>원</span></div>
                <div className="pricing-duration">⏱ {p.duration}</div>
                <div className="pricing-divider" />
                <ul className="pricing-features">
                  {p.features.map((f, j) => <li key={j}>{f}</li>)}
                </ul>
                <button
                  className={`btn btn-lg ${p.popular ? 'btn-primary' : 'btn-outline'}`}
                  style={{ width: '100%' }}
                  onClick={onStart}
                >
                  {p.popular ? '지금 시작하기 🚀' : '신청하기'}
                </button>
              </div>
            ))}
          </div>
          <p style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: 'var(--text-muted)' }}>
            * 설문 먼저 작성하시면 코치가 확인 후 적합한 플랜을 안내드려요 :)
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="section faq">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">자주 묻는 질문 ❓</h2>
            <p className="section-sub">궁금한 게 있으면 뭐든 물어봐요!</p>
          </div>
          <div className="faq-list">
            {faqs.map((f, i) => (
              <div className="faq-item" key={i}>
                <button className="faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  {f.q}
                  <span style={{ fontSize: 20, transition: 'transform .3s', transform: openFaq === i ? 'rotate(180deg)' : 'none' }}>
                    ›
                  </span>
                </button>
                <div className={`faq-a ${openFaq === i ? 'open' : ''}`}>
                  <p>{f.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA 배너 */}
      <section className="cta-banner">
        <div className="container">
          <h2 className="cta-banner-title">
            오빠, 이번엔 진짜 달라질 거야 🌟
          </h2>
          <p className="cta-banner-sub">
            무료 진단부터 시작해요. 딱 5분이면 돼요!
          </p>
          <button className="btn btn-lg btn-white" onClick={onStart}>
            💌 지금 무료 매력진단 받기
          </button>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="footer">
        <div className="footer-logo">오빠 매력연구소 🔬</div>
        <div className="footer-links">
          <a href="https://kmong.com/gig/687263" target="_blank" rel="noopener noreferrer">크몽 서비스 페이지</a>
          <a href="#pricing">요금 안내</a>
          <a href="#target">서비스 소개</a>
        </div>
        <p className="footer-copy">
          © 2025 오빠 매력연구소. 내담자의 개인정보는 철저히 보호됩니다.
        </p>
      </footer>
    </>
  )
}

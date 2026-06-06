export default function Complete({ submissionId, onHome }) {
  return (
    <div className="complete-page">
      <div className="complete-card fade-in">
        <div className="complete-icon">🎉</div>
        <h2 className="complete-title">
          신청 완료! <span className="gradient-text">잘 받았어요 오빠!</span>
        </h2>
        <p className="complete-sub">
          작성해주신 내용을 꼼꼼히 분석해서<br />
          <strong>24시간 이내</strong>에 연락드릴게요 :)<br />
          조금만 기다려줘요!
        </p>

        <div className="complete-id">
          신청 번호
          <span>{submissionId}</span>
        </div>

        <ul className="complete-steps">
          <li>설문 내용을 바탕으로 여동생 코치가 직접 분석을 시작해요</li>
          <li>24시간 이내에 남겨주신 연락처로 연락이 갈 거예요</li>
          <li>맞춤 진단 리포트와 코칭 플랜 안내를 함께 전달드려요</li>
          <li>궁금한 건 크몽 메시지로 언제든 물어봐도 돼요!</li>
        </ul>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <a
            href="https://kmong.com/gig/687263"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary btn-lg"
            style={{ textAlign: 'center' }}
          >
            크몽에서 바로 결제하기 💳
          </a>
          <button className="btn btn-outline" onClick={onHome}>
            홈으로 돌아가기
          </button>
        </div>

        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 24, lineHeight: 1.7 }}>
          🔒 입력하신 모든 정보는 안전하게 보호되며<br />
          코칭 목적 외에는 절대 사용되지 않아요
        </p>
      </div>
    </div>
  )
}

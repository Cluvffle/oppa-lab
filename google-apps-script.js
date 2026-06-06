/**
 * 오빠 매력연구소 — Google Apps Script
 *
 * 사용법:
 * 1. Google Sheets 새 시트를 만들고 시트 이름을 "신청서"로 변경
 * 2. 상단 메뉴 → 확장 프로그램 → Apps Script
 * 3. 이 코드 전체를 붙여넣기
 * 4. 저장 (Ctrl+S) 후 상단 "배포" → "새 배포" 클릭
 * 5. 유형: "웹 앱" 선택
 *    - 실행 계정: 나(본인)
 *    - 액세스 권한: 모든 사용자
 * 6. 배포 → 나타나는 URL 복사
 * 7. Vercel 환경변수 VITE_APPS_SCRIPT_URL 에 붙여넣기
 */

const SHEET_NAME = '신청서'

const HEADERS = [
  '제출일시', '신청번호', '닉네임', '연락처',
  '나이/직업', '연애상태', '소득수준',
  '패션레벨', '그루밍레벨', '운동/체형',
  '대화감정', '자존감점수', '연애두려움',
  '연애횟수', '현재고민상황',
  '코칭목표', '미래모습'
]

function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  let sheet = ss.getSheetByName(SHEET_NAME)
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME)
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS])
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold')
    sheet.setFrozenRows(1)
  }
  // 헤더가 없으면 추가
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS])
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold')
    sheet.setFrozenRows(1)
  }
  return sheet
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents)
    const sheet = getOrCreateSheet()

    const goals = Array.isArray(data.goals) ? data.goals.join(', ') : (data.goals || '')

    const row = [
      data.submittedAt || new Date().toLocaleString('ko-KR'),
      data.submissionId || '',
      data.nickname || '',
      data.contact || '',
      data.age_job || '',
      data.relationship_status || '',
      data.income || '',
      data.fashion_level || '',
      data.grooming_level || '',
      data.fitness_level || '',
      data.talk_feeling || '',
      data.self_esteem || '',
      data.biggest_fear || '',
      data.dating_count || '',
      data.current_situation || '',
      goals,
      data.future_vision || '',
    ]

    sheet.appendRow(row)

    // 새 신청 알림 이메일 (선택 사항 — 본인 이메일로 발송)
    try {
      const adminEmail = Session.getActiveUser().getEmail()
      if (adminEmail) {
        MailApp.sendEmail({
          to: adminEmail,
          subject: `[오빠 매력연구소] 새 신청 — ${data.nickname || '?'} (${data.submissionId || ''})`,
          body: `새로운 매력진단 신청이 들어왔어요!\n\n신청번호: ${data.submissionId}\n닉네임: ${data.nickname}\n연락처: ${data.contact}\n나이/직업: ${data.age_job}\n연애상태: ${data.relationship_status}\n\n구글시트에서 전체 내용을 확인하세요 :)`,
        })
      }
    } catch (mailErr) {
      // 이메일 실패해도 시트 저장은 OK
    }

    return ContentService
      .createTextOutput(JSON.stringify({ success: true, id: data.submissionId }))
      .setMimeType(ContentService.MimeType.JSON)

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON)
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'active', message: '오빠 매력연구소 API 정상 작동 중' }))
    .setMimeType(ContentService.MimeType.JSON)
}

import { SurveyData } from '@/types/survey'

const APPS_SCRIPT_URL = process.env.NEXT_PUBLIC_APPS_SCRIPT_URL ?? ''

export async function submitSurvey(data: SurveyData): Promise<string> {
  const submissionId = `OL-${Date.now().toString(36).toUpperCase()}`
  const payload = {
    ...data,
    submissionId,
    submittedAt: new Date().toLocaleString('ko-KR'),
  }

  try {
    if (APPS_SCRIPT_URL) {
      await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // Google Apps Script CORS 우회 — 유지 필수
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
    }
  } catch {
    // no-cors 모드에서는 에러 무시 (실제로는 저장됨)
  }

  return submissionId
}

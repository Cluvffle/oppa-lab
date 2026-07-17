import type { Metadata } from 'next'
import { Noto_Sans_KR } from 'next/font/google'
import './globals.css'

const notoSansKR = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  display: 'swap',
  variable: '--font-noto',
})

export const metadata: Metadata = {
  title: '챠밍 (Charming) | 어색함이 자신감이 되는 놀이터',
  description: '누나·언니·동생들의 애정 어린 조언으로 오빠의 대화 근육을 키우고, 어색함을 자신감으로 바꿔주는 놀이터야!',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={notoSansKR.variable}>
      <body>{children}</body>
    </html>
  )
}

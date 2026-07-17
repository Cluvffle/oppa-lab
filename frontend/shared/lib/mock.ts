/**
 * 놀이터 홈용 목업 데이터.
 * 실제 API 연동 전까지 UI 렌더링용.
 * 스킬 참조: [[panel-persona]], [[emergency-rooms]], [[appeal-feed]], [[community-rules]]
 */

export type CreatorType = "practice_partner" | "love_coach" | "relationship_advisor";

export interface CreatorStats {
  voiceCallCount: number; // 완료된 음성 통화 (최소 5분 이상, 평점 4.0+)
  videoCallCount: number; // 완료된 영상 통화
  handshakeCount: number; // 완료된 오프라인 실전 소개팅 (악수 = 만남)
  followerCount: number; // 팔로워 수 (유저가 이 친구를 팔로우한 수)
}

/**
 * 팔로워 수 표시 포맷 — 1000+ → 1.2k, 10000+ → 12k 형식.
 */
export function formatCount(n: number): string {
  if (n < 1000) return String(n);
  if (n < 10000) return `${(n / 1000).toFixed(1)}k`;
  return `${Math.floor(n / 1000)}k`;
}

/**
 * 친구 관계 라벨 = [성격 형용사] + [포지션].
 * 성격/포지션은 팔레트에서만 조합. UI엔 텍스트만 노출 (아이콘 X).
 */

/** 성격 팔레트 (12종) */
export type PersonalityTrait =
  | "straightforward" // 돌직구
  | "high_tension" // 하이텐션
  | "reaction_king" // 리액션갑
  | "brutal" // 팩폭
  | "careful" // 세심한
  | "warm_hearted" // 다정한
  | "funny" // 웃긴
  | "comforting" // 위로 담당
  | "goal_oriented" // 직진
  | "love_expert" // 연애 고수
  | "chic" // 시크한
  | "bubbly"; // 발랄한

export const personalityLabel: Record<PersonalityTrait, string> = {
  straightforward: "돌직구",
  high_tension: "하이텐션",
  reaction_king: "리액션갑",
  brutal: "팩폭",
  careful: "세심한",
  warm_hearted: "다정한",
  funny: "웃긴",
  comforting: "위로 담당",
  goal_oriented: "직진",
  love_expert: "연애 고수",
  chic: "시크한",
  bubbly: "발랄한",
};

/** 포지션 팔레트 (5종) */
export type Position =
  | "younger_sister" // 여동생
  | "elder_sister" // 누나
  | "junior_at_school" // 후배
  | "senior_at_school" // 선배
  | "friend"; // 여사친

export const positionLabel: Record<Position, string> = {
  younger_sister: "여동생",
  elder_sister: "누나",
  junior_at_school: "후배",
  senior_at_school: "선배",
  friend: "여사친",
};

/** 친구의 관계 라벨 (조합). */
export interface RelationshipLabel {
  trait: PersonalityTrait;
  position: Position;
}

export function formatRelationship(rel: RelationshipLabel): string {
  return `${personalityLabel[rel.trait]} ${positionLabel[rel.position]}`;
}

/**
 * 여사친이 제공 가능한 티어 매트릭스 + 요일별 슬롯.
 * 스킬 참조: [[domain-model]] CreatorAvailability
 */
export type Weekday = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

export interface TimeSlot {
  start: string; // "HH:mm"
  end: string; // "HH:mm"
}

export type ResponseSpeed = "fast" | "normal" | "slow";

export const responseSpeedLabel: Record<ResponseSpeed, string> = {
  fast: "빠른 응답",
  normal: "보통",
  slow: "느긋",
};

export interface CreatorAvailability {
  offersVoice: boolean;
  offersVideo: boolean;
  offersOffline: boolean;
  offlineRegions: string[]; // offersOffline=true 일 때만 채움
  weeklySlots: Record<Weekday, TimeSlot[]>;
  responseSpeed: ResponseSpeed;
}

export interface CreatorMock {
  id: string;
  nickname: string;
  emoji: string; // 임시 캐릭터 대체 (deprecated — avatar 사용)
  avatar: string; // /avatars/charNN.png 경로
  age: number;
  occupation: string;
  mbti: string;
  personalityTags: string[];
  creatorType: CreatorType;
  isOnline: boolean;
  bio: string;
  stats: CreatorStats;
  relationship: RelationshipLabel; // [성격 + 포지션] 조합
  availability: CreatorAvailability;
}

/**
 * 신규 친구(새싹) 판정.
 * 3티어 합산 5회 미만이면 새싹 뱃지 노출.
 */
export function isRookieCreator(c: CreatorMock): boolean {
  const total =
    c.stats.voiceCallCount + c.stats.videoCallCount + c.stats.handshakeCount;
  return total < 5;
}

export const creatorsMock: CreatorMock[] = [
  {
    id: "c1",
    nickname: "서연",
    emoji: "🌷",
    avatar: "/avatars/char03.png",
    age: 26,
    occupation: "마케터",
    mbti: "ENFP",
    personalityTags: ["돌직구", "리액션 갑", "텐션 하이"],
    creatorType: "love_coach",
    isOnline: true,
    bio: "야 이 카톡 뭐야ㅋㅋ 답장이 이게 다야?? 나 같으면 진짜 답 안 해",
    stats: { voiceCallCount: 87, videoCallCount: 42, handshakeCount: 6, followerCount: 142 },
    relationship: { trait: "straightforward", position: "friend" }, // 돌직구 여사친
    availability: {
      offersVoice: true,
      offersVideo: true,
      offersOffline: true,
      offlineRegions: ["서울 강남", "서울 성수"],
      weeklySlots: {
        mon: [{ start: "20:00", end: "23:00" }],
        tue: [{ start: "20:00", end: "23:00" }],
        wed: [],
        thu: [{ start: "20:00", end: "23:00" }],
        fri: [{ start: "19:00", end: "23:30" }],
        sat: [{ start: "14:00", end: "22:00" }],
        sun: [{ start: "14:00", end: "20:00" }],
      },
      responseSpeed: "fast",
    },
  },
  {
    id: "c2",
    nickname: "지원",
    emoji: "🍵",
    avatar: "/avatars/char04.png",
    age: 30,
    occupation: "디자이너",
    mbti: "ISFJ",
    personalityTags: ["세심함", "공감러", "느긋"],
    creatorType: "love_coach",
    isOnline: true,
    bio: "천천히 해도 돼 진짜~ 근데 이 부분만 살짝 바꾸면 훨씬 낫지 않을까?",
    stats: { voiceCallCount: 124, videoCallCount: 68, handshakeCount: 11, followerCount: 208 },
    relationship: { trait: "careful", position: "elder_sister" }, // 세심한 누나
    availability: {
      offersVoice: true,
      offersVideo: true,
      offersOffline: true,
      offlineRegions: ["서울 홍대", "서울 합정"],
      weeklySlots: {
        mon: [{ start: "21:00", end: "23:30" }],
        tue: [{ start: "21:00", end: "23:30" }],
        wed: [{ start: "21:00", end: "23:30" }],
        thu: [],
        fri: [{ start: "20:00", end: "23:30" }],
        sat: [{ start: "13:00", end: "20:00" }],
        sun: [{ start: "13:00", end: "20:00" }],
      },
      responseSpeed: "normal",
    },
  },
  {
    id: "c3",
    nickname: "민지",
    emoji: "🍭",
    avatar: "/avatars/char02.png",
    age: 23,
    occupation: "대학생",
    mbti: "ESFP",
    personalityTags: ["웃음 많음", "밝음", "장난꾸러기"],
    creatorType: "practice_partner",
    isOnline: true,
    bio: "ㅋㅋㅋㅋ 뭐야 오빠 왜 그렇게 진지해ㅋㅋ 그냥 편하게 얘기해 봐~",
    stats: { voiceCallCount: 3, videoCallCount: 1, handshakeCount: 0, followerCount: 8 },
    relationship: { trait: "bubbly", position: "younger_sister" }, // 발랄한 여동생
    availability: {
      offersVoice: true,
      offersVideo: true,
      offersOffline: false,
      offlineRegions: [],
      weeklySlots: {
        mon: [{ start: "22:00", end: "01:00" }],
        tue: [{ start: "22:00", end: "01:00" }],
        wed: [{ start: "22:00", end: "01:00" }],
        thu: [{ start: "22:00", end: "01:00" }],
        fri: [{ start: "22:00", end: "01:00" }],
        sat: [{ start: "15:00", end: "23:00" }],
        sun: [{ start: "15:00", end: "23:00" }],
      },
      responseSpeed: "slow",
    },
  },
  {
    id: "c4",
    nickname: "달리",
    emoji: "🌙",
    avatar: "/avatars/char14.png",
    age: 34,
    occupation: "상담사",
    mbti: "INFJ",
    personalityTags: ["통찰력", "차분함", "속마음 캐치"],
    creatorType: "relationship_advisor",
    isOnline: true,
    bio: "그 말 진심 아닌 것 같은데... 여친이 진짜 원한 건 사과가 아니야",
    stats: { voiceCallCount: 156, videoCallCount: 89, handshakeCount: 24, followerCount: 312 },
    relationship: { trait: "brutal", position: "elder_sister" }, // 팩폭 누나
    availability: {
      offersVoice: true,
      offersVideo: true,
      offersOffline: true,
      offlineRegions: ["서울 강남", "서울 여의도"],
      weeklySlots: {
        mon: [{ start: "19:30", end: "22:30" }],
        tue: [{ start: "19:30", end: "22:30" }],
        wed: [{ start: "19:30", end: "22:30" }],
        thu: [{ start: "19:30", end: "22:30" }],
        fri: [{ start: "19:30", end: "22:30" }],
        sat: [{ start: "11:00", end: "18:00" }],
        sun: [],
      },
      responseSpeed: "fast",
    },
  },
  {
    id: "c5",
    nickname: "하늘",
    emoji: "☁️",
    avatar: "/avatars/char16.png",
    age: 25,
    occupation: "간호사",
    mbti: "ISFP",
    personalityTags: ["따뜻함", "말수 적음", "안정감"],
    creatorType: "practice_partner",
    isOnline: false,
    bio: "괜찮아 나도 처음엔 그랬어. 오늘 얘기 편하게 해봐, 다 들어줄게",
    stats: { voiceCallCount: 52, videoCallCount: 18, handshakeCount: 2, followerCount: 76 },
    relationship: { trait: "comforting", position: "elder_sister" }, // 위로 담당 누나
    availability: {
      offersVoice: true,
      offersVideo: true,
      offersOffline: false,
      offlineRegions: [],
      weeklySlots: {
        mon: [{ start: "10:00", end: "13:00" }],
        tue: [],
        wed: [{ start: "10:00", end: "13:00" }],
        thu: [],
        fri: [{ start: "10:00", end: "13:00" }],
        sat: [{ start: "20:00", end: "23:00" }],
        sun: [{ start: "20:00", end: "23:00" }],
      },
      responseSpeed: "slow",
    },
  },
  {
    id: "c6",
    nickname: "가온",
    emoji: "🌿",
    avatar: "/avatars/char08.png",
    age: 28,
    occupation: "HR",
    mbti: "ENFJ",
    personalityTags: ["전략형", "리드형", "직진"],
    creatorType: "love_coach",
    isOnline: true,
    bio: "이 상황이면 오빠, 다음 스텝은 이거야. 지금 흐름 놓치면 끝이니까",
    stats: { voiceCallCount: 98, videoCallCount: 54, handshakeCount: 15, followerCount: 234 },
    relationship: { trait: "love_expert", position: "senior_at_school" }, // 연애 고수 선배
    availability: {
      offersVoice: true,
      offersVideo: true,
      offersOffline: true,
      offlineRegions: ["서울 강남", "경기 판교"],
      weeklySlots: {
        mon: [{ start: "20:00", end: "23:00" }],
        tue: [{ start: "20:00", end: "23:00" }],
        wed: [{ start: "20:00", end: "23:00" }],
        thu: [{ start: "20:00", end: "23:00" }],
        fri: [],
        sat: [{ start: "10:00", end: "18:00" }],
        sun: [{ start: "10:00", end: "16:00" }],
      },
      responseSpeed: "fast",
    },
  },
  {
    id: "c7",
    nickname: "은채",
    emoji: "🍎",
    avatar: "/avatars/char11.png",
    age: 24,
    occupation: "웹툰 작가",
    mbti: "INFP",
    personalityTags: ["감성적", "몽글", "디테일 캐치"],
    creatorType: "practice_partner",
    isOnline: true,
    bio: "그 감정 진짜 소중한 건데... 오빠는 그냥 있는 그대로 표현해도 돼",
    stats: { voiceCallCount: 2, videoCallCount: 0, handshakeCount: 0, followerCount: 5 },
    relationship: { trait: "warm_hearted", position: "junior_at_school" }, // 다정한 후배
    availability: {
      offersVoice: true,
      offersVideo: false,
      offersOffline: false,
      offlineRegions: [],
      weeklySlots: {
        mon: [{ start: "23:00", end: "02:00" }],
        tue: [{ start: "23:00", end: "02:00" }],
        wed: [{ start: "23:00", end: "02:00" }],
        thu: [{ start: "23:00", end: "02:00" }],
        fri: [{ start: "23:00", end: "02:00" }],
        sat: [{ start: "20:00", end: "02:00" }],
        sun: [{ start: "20:00", end: "02:00" }],
      },
      responseSpeed: "slow",
    },
  },
];

export const creatorTypeLabel: Record<CreatorType, string> = {
  practice_partner: "연습 파트너",
  love_coach: "연애 코치",
  relationship_advisor: "관계 상담사",
};

export interface EmergencyRoomMock {
  code: "kakao" | "style" | "profile" | "relationship";
  icon: string;
  name: string;
  subtitle: string;
  liveCount: number;
}

export const emergencyRoomsMock: EmergencyRoomMock[] = [
  {
    code: "kakao",
    icon: "📱",
    name: "카톡 할까말까",
    subtitle: "이 답장 보낼까 말까 고민되지?",
    liveCount: 24,
  },
  {
    code: "style",
    icon: "👔",
    name: "스타일 할까말까",
    subtitle: "이 옷 입고 나갈까 말까, 우리가 봐줄게",
    liveCount: 18,
  },
  {
    code: "profile",
    icon: "📸",
    name: "프사 할까말까",
    subtitle: "이 사진 프사로 할까 말까, 여자 눈으로 골라줄게",
    liveCount: 12,
  },
  {
    code: "relationship",
    icon: "💕",
    name: "관계 할까말까",
    subtitle: "이 말 할까 말까, 여자 마음 대신 읽어줄게",
    liveCount: 9,
  },
];

export type AppealCategory = "styling" | "expression" | "hair" | "voice" | "kakao";

export interface AppealFeedItemMock {
  id: string;
  category: AppealCategory;
  title: string;
  likes: number;
  feedbacks: number;
  isGrowthPair: boolean;
}

export const appealCategoryLabel: Record<AppealCategory, string> = {
  styling: "스타일링",
  expression: "표정",
  hair: "헤어",
  voice: "목소리",
  kakao: "카톡",
};

export const appealFeedMock: AppealFeedItemMock[] = [
  {
    id: "f1",
    category: "styling",
    title: "이번 주 소개팅 코디, 어제보다 나아졌나요?",
    likes: 42,
    feedbacks: 8,
    isGrowthPair: true,
  },
  {
    id: "f2",
    category: "hair",
    title: "미용실 바꿔봤어. 이 스타일 어때?",
    likes: 31,
    feedbacks: 5,
    isGrowthPair: false,
  },
  {
    id: "f3",
    category: "expression",
    title: "웃을 때 어색하다는 피드백 받고 연습 중",
    likes: 28,
    feedbacks: 6,
    isGrowthPair: true,
  },
  {
    id: "f4",
    category: "voice",
    title: "자기소개 30초 녹음해봤어. 톤 괜찮은지",
    likes: 19,
    feedbacks: 4,
    isGrowthPair: false,
  },
  {
    id: "f5",
    category: "kakao",
    title: "썸녀랑 이번 주 대화, 답변 방향 이게 맞아?",
    likes: 55,
    feedbacks: 12,
    isGrowthPair: false,
  },
  {
    id: "f6",
    category: "styling",
    title: "평일 오피스룩, 캐주얼로 바꿔봤어",
    likes: 22,
    feedbacks: 3,
    isGrowthPair: false,
  },
  {
    id: "f7",
    category: "expression",
    title: "카메라 앞에서 굳는 표정 3주째 개선 중",
    likes: 37,
    feedbacks: 7,
    isGrowthPair: true,
  },
  {
    id: "f8",
    category: "voice",
    title: "말끝 흐림 지적받고 발음 연습한 결과",
    likes: 15,
    feedbacks: 2,
    isGrowthPair: false,
  },
];

/** 소개팅 티어 3종 (내부 코드) */
export type MeetTier = "voice" | "video" | "offline";

export const meetTierLabel: Record<MeetTier, string> = {
  voice: "목소리",
  video: "첫인상",
  offline: "실전만남",
};

export interface RealCommentMock {
  id: string;
  authorId: string; // 친구 id (creatorsMock 참조)
  authorName: string; // 친구 닉네임 (편의)
  guyNick: string; // 조언 받은 오빠 익명 닉네임
  tier: MeetTier;
  text: string;
  likes: number;
  createdAtRelative: string; // "12분 전", "2시간 전" 등 표시용
  tags?: string[]; // 선택 태그
}

export const realCommentsMock: RealCommentMock[] = [
  {
    id: "r1",
    authorId: "c1",
    authorName: "서연",
    guyNick: "강남오빠",
    tier: "voice",
    text: "야 진짜 이거 답장 이따위로 오면 나 3일 잠수 탐ㅋㅋ 리액션 좀 해줘라. 물음표만 던지지 말고 감정을 얹어봐, 그게 대화지",
    likes: 234,
    createdAtRelative: "12분 전",
    tags: ["카톡", "리액션"],
  },
  {
    id: "r2",
    authorId: "c2",
    authorName: "지원",
    guyNick: "연남오빠",
    tier: "video",
    text: "옷은 예쁜데~ 자세가 살짝 굽어있어서 아쉽더라. 어깨 펴는 것부터 해보자! 자세만 바꿔도 인상이 완전 달라져",
    likes: 189,
    createdAtRelative: "38분 전",
    tags: ["자세", "스타일"],
  },
  {
    id: "r3",
    authorId: "c3",
    authorName: "민지",
    guyNick: "홍대오빠",
    tier: "voice",
    text: "ㅋㅋㅋㅋ 오빠 왤케 진지해 그냥 편하게 얘기해봐~ 오빠 목소리 자체는 좋은데 너무 각 잡고 얘기하니까 나까지 긴장돼",
    likes: 156,
    createdAtRelative: "1시간 전",
    tags: ["목소리톤"],
  },
  {
    id: "r4",
    authorId: "c4",
    authorName: "달래",
    guyNick: "신촌오빠",
    tier: "offline",
    text: "3시간 만나는 동안 오빠 본인 얘기만 하더라. 나한테 던진 질문 총 4개, 근데 그것도 다 형식적이었어. 여자는 자기 얘기 들어주는 사람한테 마음 열려",
    likes: 421,
    createdAtRelative: "2시간 전",
    tags: ["대화", "실전만남"],
  },
  {
    id: "r5",
    authorId: "c5",
    authorName: "하늘",
    guyNick: "판교오빠",
    tier: "voice",
    text: "그 유머 나는 좋았어. 근데 오빠가 눈치 보면서 던지니까 안 웃긴 거야. 자신감 있게 던지면 같은 농담도 훨씬 살아",
    likes: 178,
    createdAtRelative: "3시간 전",
    tags: ["자신감", "유머"],
  },
  {
    id: "r6",
    authorId: "c6",
    authorName: "가온",
    guyNick: "잠실오빠",
    tier: "video",
    text: "카메라 켰을 때 시선이 자꾸 아래로 가더라. 나 아니라 화면 아래 보면서 얘기하니까 자신감 없어 보여. 렌즈 정면 보는 연습부터",
    likes: 267,
    createdAtRelative: "어제",
    tags: ["시선", "화상"],
  },
  {
    id: "r7",
    authorId: "c4",
    authorName: "달래",
    guyNick: "성수오빠",
    tier: "offline",
    text: "메뉴 고를 때 30분 걸렸어. 결정 못 하는 남자는 매력 반감이야. 소개팅에서는 '뭐 좋아해?' 물어보고 두세 개 골라서 던져주는 게 리드",
    likes: 512,
    createdAtRelative: "어제",
    tags: ["리드", "실전만남"],
  },
  {
    id: "r8",
    authorId: "c1",
    authorName: "서연",
    guyNick: "이수오빠",
    tier: "video",
    text: "옷은 진짜 나쁘지 않은데 화면에서 색이 죽어. 오프화이트나 밝은 톤 셔츠 하나만 사봐. 화상에서는 얼굴 밝기가 반이야",
    likes: 143,
    createdAtRelative: "2일 전",
    tags: ["스타일", "화상"],
  },
  {
    id: "r9",
    authorId: "c6",
    authorName: "가온",
    guyNick: "구로오빠",
    tier: "offline",
    text: "만난 지 10분 만에 '결혼 생각 있어요?' 물어봤다고? 진짜 오빠... 그거 여자한테 도망가는 신호 보내는 거야. 첫 만남은 그냥 편하게",
    likes: 389,
    createdAtRelative: "2일 전",
    tags: ["실전만남", "타이밍"],
  },
  {
    id: "r10",
    authorId: "c7",
    authorName: "은채",
    guyNick: "합정오빠",
    tier: "voice",
    text: "'좋아한다'는 말보다 '너랑 있을 때 편해'가 백 배 더 세게 꽂혀. 여자는 감정보다 '나를 어떻게 봐주는지' 를 더 봐",
    likes: 298,
    createdAtRelative: "3일 전",
    tags: ["표현", "감정"],
  },
  {
    id: "r11",
    authorId: "c2",
    authorName: "지원",
    guyNick: "왕십리오빠",
    tier: "voice",
    text: "천천히 해도 돼 진짜~ 근데 대화 중간에 5초 넘게 조용해지면 좀 답답해져. 리액션이든 질문이든 뭐라도 던져줘야 흐름이 살아",
    likes: 121,
    createdAtRelative: "3일 전",
    tags: ["대화", "리액션"],
  },
  {
    id: "r12",
    authorId: "c4",
    authorName: "달래",
    guyNick: "여의도오빠",
    tier: "video",
    text: "얼굴 표정이 너무 굳어있어. 안 웃어도 되니까 눈이라도 살짝 웃어봐. 사람은 눈에서 정보 얻는데 오빠는 지금 벽이야",
    likes: 234,
    createdAtRelative: "4일 전",
    tags: ["표정", "시선"],
  },
];

export interface HotPostMock {
  id: string;
  board: string;
  boardLabel: string;
  title: string;
  meta: string;
}

export const hotPostsMock: HotPostMock[] = [
  {
    id: "p1",
    board: "growth_log",
    boardLabel: "성장일지",
    title: "6개월 만에 소개팅 성공했어. 진짜 고마워",
    meta: "댓글 32 · 3시간 전",
  },
  {
    id: "p2",
    board: "advice",
    boardLabel: "고민상담소",
    title: "3번 만난 썸녀 연락이 갑자기 뜸해졌어...",
    meta: "댓글 18 · 1시간 전",
  },
  {
    id: "p3",
    board: "nunas_notes",
    boardLabel: "오답노트",
    title: "여자들이 제일 싫어하는 카톡 답장 스타일 TOP 5",
    meta: "댓글 45 · 5시간 전",
  },
  {
    id: "p4",
    board: "grad_lounge",
    boardLabel: "졸업생 라운지",
    title: "연애 1년차 됐어. 여기 후배들한테 하고 싶은 말",
    meta: "댓글 24 · 어제",
  },
  {
    id: "p5",
    board: "couple_lounge",
    boardLabel: "부부 라운지",
    title: "아내가 요즘 왜 차가운지 모르겠어",
    meta: "댓글 11 · 오늘",
  },
];

/* ------------------------------------------------------------------ */
/*  소개팅 여정 (Thread / AfterRequest / Booking / Meet / Chat)         */
/*  스킬 참조: [[domain-model]] 소개팅 여정 엔티티                       */
/*  UI 프로토타입용 — 실제 DB 스키마와 필드 이름/타입은 일치시킴          */
/* ------------------------------------------------------------------ */

export type ThreadStatus =
  | "active"
  | "paused"
  | "closed_by_user"
  | "closed_by_creator"
  | "closed_by_moderation";

export interface DatingThreadMock {
  id: string;
  userId: string; // 편의상 "u_me" 로 통일 (현재 로그인 유저)
  creatorId: string;
  status: ThreadStatus;
  voiceCount: number;
  videoCount: number;
  offlineCount: number;
  lastMeetAt?: string; // ISO
  lastMeetTier?: MeetTier;
  nextPendingMeetId?: string; // 있으면 새 애프터 신청 불가
  createdAt: string;
}

export type AfterRequestStatus =
  | "auto_accepted"
  | "scheduling"
  | "booked"
  | "canceled_by_user"
  | "canceled_by_system";

export interface AfterRequestMock {
  id: string;
  threadId: string;
  previousMeetId?: string; // 첫 신청이면 undefined
  requestedTier: MeetTier;
  status: AfterRequestStatus;
  message?: string;
  createdAt: string;
  bookedAt?: string;
}

export type BookingStatus =
  | "pending_agreement"
  | "confirmed"
  | "rescheduling"
  | "canceled";

export type BookingCanceledReason =
  | "no_agreement"
  | "user_canceled"
  | "creator_reported_conflict"
  | "no_show";

export interface BookingMock {
  id: string;
  afterRequestId: string;
  meetId?: string; // 확정 시 채워짐
  tier: MeetTier;
  scheduledAt?: string; // ISO — pending_agreement 상태에서는 미정 가능
  location?: string; // offline일 때만
  status: BookingStatus;
  confirmedAt?: string;
  canceledReason?: BookingCanceledReason;
  updatedAt: string;
}

export type MeetStatus =
  | "scheduled"
  | "in_progress"
  | "completed"
  | "no_show"
  | "canceled";

export interface DatingMeetMock {
  id: string;
  threadId: string;
  bookingId: string;
  tier: MeetTier;
  meetNumber: number;
  status: MeetStatus;
  callSessionId?: string;
  reportId?: string;
  startedAt?: string;
  endedAt?: string;
  createdAt: string;
  /** UI 편의: 완료 회차의 여사친 피드백 요약 (실제 스키마에선 Report 안에 있음) */
  feedbackSummary?: string;
}

export type ChatStatus = "open" | "readonly" | "archived";

export interface CoordinationChatMock {
  id: string;
  afterRequestId: string;
  threadId: string;
  status: ChatStatus;
  openedAt: string;
  frozenAt?: string;
}

export type ChatSenderType = "user" | "creator" | "system";

export interface ChatMessageMock {
  id: string;
  chatId: string;
  senderType: ChatSenderType;
  senderId?: string;
  body: string;
  redactedBody?: string;
  hasRedaction: boolean;
  proposal?: { scheduledAt: string; location?: string };
  isProposalAccepted?: boolean;
  createdAt: string;
}

/* ------------------------------ 샘플 데이터 ------------------------------ */

/** 현재 로그인 유저 (남성) id — 마이페이지 프로토타입용 */
export const CURRENT_USER_ID = "u_me";

/**
 * 4개 스레드 시나리오:
 *  t1 (c1 서연)  — voice 2 · video 1 완료, 다음 애프터 조율 중
 *  t2 (c2 지원)  — voice 1 완료, 아직 다음 신청 없음
 *  t3 (c4 달리)  — voice 1 · video 1 완료, offline 예약 확정
 *  t4 (c7 은채)  — 첫 애프터 신청, 아직 시간 조율 중
 */
export const datingThreadsMock: DatingThreadMock[] = [
  {
    id: "t1",
    userId: CURRENT_USER_ID,
    creatorId: "c1",
    status: "active",
    voiceCount: 2,
    videoCount: 1,
    offlineCount: 0,
    lastMeetAt: "2026-07-05T20:30:00+09:00",
    lastMeetTier: "video",
    nextPendingMeetId: undefined, // 조율 중이라 아직 Meet 미확정
    createdAt: "2026-06-14T21:00:00+09:00",
  },
  {
    id: "t2",
    userId: CURRENT_USER_ID,
    creatorId: "c2",
    status: "active",
    voiceCount: 1,
    videoCount: 0,
    offlineCount: 0,
    lastMeetAt: "2026-06-28T21:30:00+09:00",
    lastMeetTier: "voice",
    createdAt: "2026-06-28T18:00:00+09:00",
  },
  {
    id: "t3",
    userId: CURRENT_USER_ID,
    creatorId: "c4",
    status: "active",
    voiceCount: 1,
    videoCount: 1,
    offlineCount: 0,
    lastMeetAt: "2026-07-02T21:00:00+09:00",
    lastMeetTier: "video",
    nextPendingMeetId: "m_t3_3", // 오프라인 회차 예약 확정됨
    createdAt: "2026-06-20T20:00:00+09:00",
  },
  {
    id: "t4",
    userId: CURRENT_USER_ID,
    creatorId: "c7",
    status: "active",
    voiceCount: 0,
    videoCount: 0,
    offlineCount: 0,
    nextPendingMeetId: undefined,
    createdAt: "2026-07-11T23:10:00+09:00",
  },
];

export const afterRequestsMock: AfterRequestMock[] = [
  // t1: 첫 신청 (voice, booked → 완료)
  {
    id: "ar_t1_1",
    threadId: "t1",
    requestedTier: "voice",
    status: "booked",
    message: "잘 부탁해!",
    createdAt: "2026-06-14T21:00:00+09:00",
    bookedAt: "2026-06-14T21:20:00+09:00",
  },
  // t1: 두 번째 (voice → voice, 완료)
  {
    id: "ar_t1_2",
    threadId: "t1",
    previousMeetId: "m_t1_1",
    requestedTier: "voice",
    status: "booked",
    createdAt: "2026-06-22T22:00:00+09:00",
    bookedAt: "2026-06-22T22:15:00+09:00",
  },
  // t1: 세 번째 (video 승급, 완료)
  {
    id: "ar_t1_3",
    threadId: "t1",
    previousMeetId: "m_t1_2",
    requestedTier: "video",
    status: "booked",
    message: "얼굴 보고 얘기하고 싶어",
    createdAt: "2026-07-04T20:00:00+09:00",
    bookedAt: "2026-07-04T20:30:00+09:00",
  },
  // t1: 네 번째 (video 재도전, 조율 중)
  {
    id: "ar_t1_4",
    threadId: "t1",
    previousMeetId: "m_t1_3",
    requestedTier: "video",
    status: "scheduling",
    createdAt: "2026-07-11T21:00:00+09:00",
  },

  // t2: 첫 신청만
  {
    id: "ar_t2_1",
    threadId: "t2",
    requestedTier: "voice",
    status: "booked",
    createdAt: "2026-06-28T18:00:00+09:00",
    bookedAt: "2026-06-28T18:40:00+09:00",
  },

  // t3: voice → video → offline
  {
    id: "ar_t3_1",
    threadId: "t3",
    requestedTier: "voice",
    status: "booked",
    createdAt: "2026-06-20T20:00:00+09:00",
    bookedAt: "2026-06-20T20:30:00+09:00",
  },
  {
    id: "ar_t3_2",
    threadId: "t3",
    previousMeetId: "m_t3_1",
    requestedTier: "video",
    status: "booked",
    createdAt: "2026-06-27T20:00:00+09:00",
    bookedAt: "2026-06-27T20:30:00+09:00",
  },
  {
    id: "ar_t3_3",
    threadId: "t3",
    previousMeetId: "m_t3_2",
    requestedTier: "offline",
    status: "booked",
    message: "직접 만나고 싶어. 강남 쪽 괜찮아?",
    createdAt: "2026-07-03T21:00:00+09:00",
    bookedAt: "2026-07-06T22:00:00+09:00",
  },

  // t4: 첫 신청, 조율 중
  {
    id: "ar_t4_1",
    threadId: "t4",
    requestedTier: "voice",
    status: "scheduling",
    message: "밤 시간대 괜찮으시면 이번 주 편하실 때요",
    createdAt: "2026-07-11T23:10:00+09:00",
  },
];

export const bookingsMock: BookingMock[] = [
  // t1
  {
    id: "bk_t1_1",
    afterRequestId: "ar_t1_1",
    meetId: "m_t1_1",
    tier: "voice",
    scheduledAt: "2026-06-14T22:00:00+09:00",
    status: "confirmed",
    confirmedAt: "2026-06-14T21:20:00+09:00",
    updatedAt: "2026-06-14T21:20:00+09:00",
  },
  {
    id: "bk_t1_2",
    afterRequestId: "ar_t1_2",
    meetId: "m_t1_2",
    tier: "voice",
    scheduledAt: "2026-06-23T22:00:00+09:00",
    status: "confirmed",
    confirmedAt: "2026-06-22T22:15:00+09:00",
    updatedAt: "2026-06-22T22:15:00+09:00",
  },
  {
    id: "bk_t1_3",
    afterRequestId: "ar_t1_3",
    meetId: "m_t1_3",
    tier: "video",
    scheduledAt: "2026-07-05T20:30:00+09:00",
    status: "confirmed",
    confirmedAt: "2026-07-04T20:30:00+09:00",
    updatedAt: "2026-07-04T20:30:00+09:00",
  },
  {
    id: "bk_t1_4",
    afterRequestId: "ar_t1_4",
    tier: "video",
    status: "pending_agreement",
    updatedAt: "2026-07-12T09:20:00+09:00",
  },

  // t2
  {
    id: "bk_t2_1",
    afterRequestId: "ar_t2_1",
    meetId: "m_t2_1",
    tier: "voice",
    scheduledAt: "2026-06-28T21:30:00+09:00",
    status: "confirmed",
    confirmedAt: "2026-06-28T18:40:00+09:00",
    updatedAt: "2026-06-28T18:40:00+09:00",
  },

  // t3
  {
    id: "bk_t3_1",
    afterRequestId: "ar_t3_1",
    meetId: "m_t3_1",
    tier: "voice",
    scheduledAt: "2026-06-20T20:30:00+09:00",
    status: "confirmed",
    confirmedAt: "2026-06-20T20:30:00+09:00",
    updatedAt: "2026-06-20T20:30:00+09:00",
  },
  {
    id: "bk_t3_2",
    afterRequestId: "ar_t3_2",
    meetId: "m_t3_2",
    tier: "video",
    scheduledAt: "2026-07-02T21:00:00+09:00",
    status: "confirmed",
    confirmedAt: "2026-06-27T20:30:00+09:00",
    updatedAt: "2026-06-27T20:30:00+09:00",
  },
  {
    id: "bk_t3_3",
    afterRequestId: "ar_t3_3",
    meetId: "m_t3_3",
    tier: "offline",
    scheduledAt: "2026-07-13T19:00:00+09:00",
    location: "서울 강남 스타벅스 강남R점",
    status: "confirmed",
    confirmedAt: "2026-07-06T22:00:00+09:00",
    updatedAt: "2026-07-06T22:00:00+09:00",
  },

  // t4
  {
    id: "bk_t4_1",
    afterRequestId: "ar_t4_1",
    tier: "voice",
    status: "pending_agreement",
    updatedAt: "2026-07-12T09:30:00+09:00",
  },
];

export const datingMeetsMock: DatingMeetMock[] = [
  // t1
  {
    id: "m_t1_1",
    threadId: "t1",
    bookingId: "bk_t1_1",
    tier: "voice",
    meetNumber: 1,
    status: "completed",
    callSessionId: "cs_t1_1",
    startedAt: "2026-06-14T22:01:00+09:00",
    endedAt: "2026-06-14T22:11:00+09:00",
    createdAt: "2026-06-14T21:20:00+09:00",
    feedbackSummary:
      "목소리 톤 좋음. 근데 리액션이 3초씩 늦음. 살짝 텐션 얹으면 대화가 살아날듯",
  },
  {
    id: "m_t1_2",
    threadId: "t1",
    bookingId: "bk_t1_2",
    tier: "voice",
    meetNumber: 2,
    status: "completed",
    callSessionId: "cs_t1_2",
    startedAt: "2026-06-23T22:00:00+09:00",
    endedAt: "2026-06-23T22:12:00+09:00",
    createdAt: "2026-06-22T22:15:00+09:00",
    feedbackSummary:
      "지난번보다 리액션 훨씬 좋아짐! 근데 질문 던지고 답 안 기다리고 다음 얘기로 넘어감",
  },
  {
    id: "m_t1_3",
    threadId: "t1",
    bookingId: "bk_t1_3",
    tier: "video",
    meetNumber: 3,
    status: "completed",
    callSessionId: "cs_t1_3",
    startedAt: "2026-07-05T20:30:00+09:00",
    endedAt: "2026-07-05T20:45:00+09:00",
    createdAt: "2026-07-04T20:30:00+09:00",
    feedbackSummary:
      "얼굴 보니까 웃는 게 예쁘네. 근데 시선이 카메라 아래로 자꾸 감. 렌즈 봐줘",
  },

  // t2
  {
    id: "m_t2_1",
    threadId: "t2",
    bookingId: "bk_t2_1",
    tier: "voice",
    meetNumber: 1,
    status: "completed",
    callSessionId: "cs_t2_1",
    startedAt: "2026-06-28T21:30:00+09:00",
    endedAt: "2026-06-28T21:42:00+09:00",
    createdAt: "2026-06-28T18:40:00+09:00",
    feedbackSummary:
      "천천히 얘기하는 톤 좋아. 다만 침묵이 길어. 다음엔 대화 리듬 훈련해보자",
  },

  // t3
  {
    id: "m_t3_1",
    threadId: "t3",
    bookingId: "bk_t3_1",
    tier: "voice",
    meetNumber: 1,
    status: "completed",
    callSessionId: "cs_t3_1",
    startedAt: "2026-06-20T20:30:00+09:00",
    endedAt: "2026-06-20T20:42:00+09:00",
    createdAt: "2026-06-20T20:30:00+09:00",
    feedbackSummary:
      "자기 얘기만 6분 함. 여자는 자기 얘기 들어주는 남자한테 마음 열어",
  },
  {
    id: "m_t3_2",
    threadId: "t3",
    bookingId: "bk_t3_2",
    tier: "video",
    meetNumber: 2,
    status: "completed",
    callSessionId: "cs_t3_2",
    startedAt: "2026-07-02T21:00:00+09:00",
    endedAt: "2026-07-02T21:15:00+09:00",
    createdAt: "2026-06-27T20:30:00+09:00",
    feedbackSummary:
      "질문 던지는 습관 생김. 굿. 근데 표정이 여전히 굳어. 눈으로라도 웃어봐",
  },
  {
    id: "m_t3_3",
    threadId: "t3",
    bookingId: "bk_t3_3",
    tier: "offline",
    meetNumber: 3,
    status: "scheduled",
    createdAt: "2026-07-06T22:00:00+09:00",
  },
];

/** 조율 채팅: pending 상태인 것들만 (확정된 건 read-only 로 archived) */
export const coordinationChatsMock: CoordinationChatMock[] = [
  {
    id: "chat_t1_4",
    afterRequestId: "ar_t1_4",
    threadId: "t1",
    status: "open",
    openedAt: "2026-07-11T21:00:00+09:00",
  },
  {
    id: "chat_t4_1",
    afterRequestId: "ar_t4_1",
    threadId: "t4",
    status: "open",
    openedAt: "2026-07-11T23:10:00+09:00",
  },
  // 이미 확정된 케이스도 참고용으로 하나만 (readonly)
  {
    id: "chat_t3_3",
    afterRequestId: "ar_t3_3",
    threadId: "t3",
    status: "readonly",
    openedAt: "2026-07-03T21:00:00+09:00",
    frozenAt: "2026-07-06T22:00:00+09:00",
  },
];

export const chatMessagesMock: ChatMessageMock[] = [
  // chat_t1_4 (서연, video 재도전, 조율 중)
  {
    id: "msg_1",
    chatId: "chat_t1_4",
    senderType: "system",
    body: "여긴 소개팅 시간 정하는 공간이야. 개인 연락처는 자동 마스킹돼.",
    hasRedaction: false,
    createdAt: "2026-07-11T21:00:00+09:00",
  },
  {
    id: "msg_2",
    chatId: "chat_t1_4",
    senderType: "user",
    senderId: CURRENT_USER_ID,
    body: "지난번 화상 재밌었어! 이번주 금요일 밤 어때?",
    hasRedaction: false,
    createdAt: "2026-07-11T21:02:00+09:00",
  },
  {
    id: "msg_3",
    chatId: "chat_t1_4",
    senderType: "creator",
    senderId: "c1",
    body: "금요일 좋아~ 8시 반쯤 어때?",
    hasRedaction: false,
    proposal: { scheduledAt: "2026-07-17T20:30:00+09:00" },
    createdAt: "2026-07-12T09:15:00+09:00",
  },
  {
    id: "msg_4",
    chatId: "chat_t1_4",
    senderType: "user",
    senderId: CURRENT_USER_ID,
    body: "좋아! 확정할게",
    hasRedaction: false,
    createdAt: "2026-07-12T09:20:00+09:00",
  },

  // chat_t4_1 (은채, 첫 통화, 조율 중, 개인정보 마스킹 예시)
  {
    id: "msg_10",
    chatId: "chat_t4_1",
    senderType: "system",
    body: "여긴 소개팅 시간 정하는 공간이야. 개인 연락처는 자동 마스킹돼.",
    hasRedaction: false,
    createdAt: "2026-07-11T23:10:00+09:00",
  },
  {
    id: "msg_11",
    chatId: "chat_t4_1",
    senderType: "user",
    senderId: CURRENT_USER_ID,
    body: "안녕! 밤 시간대 편하다고 해서 이번 주 편할 때 잡자",
    hasRedaction: false,
    createdAt: "2026-07-11T23:12:00+09:00",
  },
  {
    id: "msg_12",
    chatId: "chat_t4_1",
    senderType: "creator",
    senderId: "c7",
    body: "안녕~ 카톡으로 편하게 얘기하면 [연락처 마스킹됨] 이건 여기서만 조율하자!",
    redactedBody: "안녕~ 카톡으로 편하게 얘기하면 010-****-**** 이건 여기서만 조율하자!",
    hasRedaction: true,
    createdAt: "2026-07-12T00:05:00+09:00",
  },
  {
    id: "msg_13",
    chatId: "chat_t4_1",
    senderType: "creator",
    senderId: "c7",
    body: "일요일 밤 11시 반 어때?",
    hasRedaction: false,
    proposal: { scheduledAt: "2026-07-13T23:30:00+09:00" },
    createdAt: "2026-07-12T00:07:00+09:00",
  },

  // chat_t3_3 (달리, 오프라인, 이미 확정됨 — readonly)
  {
    id: "msg_20",
    chatId: "chat_t3_3",
    senderType: "system",
    body: "여긴 소개팅 시간 정하는 공간이야. 개인 연락처는 자동 마스킹돼.",
    hasRedaction: false,
    createdAt: "2026-07-03T21:00:00+09:00",
  },
  {
    id: "msg_21",
    chatId: "chat_t3_3",
    senderType: "user",
    senderId: CURRENT_USER_ID,
    body: "직접 만나고 싶어. 강남 쪽 괜찮아? 다음 주 월요일 저녁 어때",
    hasRedaction: false,
    createdAt: "2026-07-03T21:02:00+09:00",
  },
  {
    id: "msg_22",
    chatId: "chat_t3_3",
    senderType: "creator",
    senderId: "c4",
    body: "월요일 7시 강남 스타벅스 R점 어때? 30분만 보자~",
    hasRedaction: false,
    proposal: {
      scheduledAt: "2026-07-13T19:00:00+09:00",
      location: "서울 강남 스타벅스 강남R점",
    },
    isProposalAccepted: true,
    createdAt: "2026-07-06T21:55:00+09:00",
  },
  {
    id: "msg_23",
    chatId: "chat_t3_3",
    senderType: "system",
    body: "7월 13일 19:00, 서울 강남 스타벅스 강남R점으로 예약 확정됐어.",
    hasRedaction: false,
    createdAt: "2026-07-06T22:00:00+09:00",
  },
];

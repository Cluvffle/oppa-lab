/**
 * 놀이터 홈용 목업 데이터.
 * 실제 API 연동 전까지 UI 렌더링용.
 * 스킬 참조: [[panel-persona]], [[emergency-rooms]], [[community-rules]]
 */

export type CreatorType = "practice_partner" | "love_coach" | "relationship_advisor";

export interface CreatorStats {
  voiceCallCount: number; // 완료된 목소리 통화 (최소 5분 이상, 평점 4.0+)
  handshakeCount: number; // 완료된 오프라인 실전만남 (악수 = 만남)
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
  | "friend"; // 사이다 친구

export const positionLabel: Record<Position, string> = {
  younger_sister: "여동생",
  elder_sister: "누나",
  junior_at_school: "후배",
  senior_at_school: "선배",
  friend: "사이다 친구",
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
 * 사이다 친구이 제공 가능한 티어 매트릭스 + 요일별 슬롯.
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
 * 2티어 합산 5회 미만이면 새싹 뱃지 노출.
 */
export function isRookieCreator(c: CreatorMock): boolean {
  const total = c.stats.voiceCallCount + c.stats.handshakeCount;
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
    bio: "돌려말하는 거 못 참는 스타일. 나랑 대화하면 안 심심할걸? 한번 걸어봐",
    stats: { voiceCallCount: 87, handshakeCount: 6, followerCount: 142 },
    relationship: { trait: "straightforward", position: "friend" }, // 돌직구 사이다 친구
    availability: {
      offersVoice: true,
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
    bio: "말 느린 편이야. 급하게 안 몰아붙이는 오빠랑 편하게 얘기하고 싶어",
    stats: { voiceCallCount: 124, handshakeCount: 11, followerCount: 208 },
    relationship: { trait: "careful", position: "elder_sister" }, // 세심한 누나
    availability: {
      offersVoice: true,
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
    bio: "장난 잘 치고 웃음 많음ㅋㅋ 어색한 거 딱 싫어. 편한 오빠 나와~",
    stats: { voiceCallCount: 3, handshakeCount: 0, followerCount: 8 },
    relationship: { trait: "bubbly", position: "younger_sister" }, // 발랄한 여동생
    availability: {
      offersVoice: true,
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
    bio: "겉치레 대화 지루해. 오빠 진짜 얘기 좀 들려줘. 대화 깊게 파는 거 좋아함",
    stats: { voiceCallCount: 156, handshakeCount: 24, followerCount: 312 },
    relationship: { trait: "brutal", position: "elder_sister" }, // 팩폭 누나
    availability: {
      offersVoice: true,
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
    bio: "조용조용 얘기하는 거 좋아해. 시끄러운 곳보다 카페 톡 취향인 오빠 환영",
    stats: { voiceCallCount: 52, handshakeCount: 2, followerCount: 76 },
    relationship: { trait: "comforting", position: "elder_sister" }, // 위로 담당 누나
    availability: {
      offersVoice: true,
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
    bio: "리드해주는 오빠 좋아. 대화 척척 이어지는 사람이랑 얘기하고 싶다",
    stats: { voiceCallCount: 98, handshakeCount: 15, followerCount: 234 },
    relationship: { trait: "love_expert", position: "senior_at_school" }, // 연애 고수 선배
    availability: {
      offersVoice: true,
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
    bio: "감성 잔뜩 있는 대화 좋아. 말 예쁘게 하는 오빠랑 대화하면 시간 잘 감",
    stats: { voiceCallCount: 2, handshakeCount: 0, followerCount: 5 },
    relationship: { trait: "warm_hearted", position: "junior_at_school" }, // 다정한 후배
    availability: {
      offersVoice: true,
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

/** 소개팅 티어 3종 (내부 코드) */
export type MeetTier = "voice" | "offline";

export const meetTierLabel: Record<MeetTier, string> = {
  voice: "목소리",
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
  /* ============================== 전화 (voice) ==============================
     톤: 카톡 답장 · 말투 · 리액션 · 목소리 · 대화 흐름 */
  {
    id: "r1",
    authorId: "c1",
    authorName: "서연",
    guyNick: "강남 오빠",
    tier: "voice",
    text: "야 이거 카톡 답장 이따위로 오면 진짜 3일 잠수 타. 물음표만 던지지 말고 감정을 얹어봐. 그게 대화야",
    likes: 234,
    createdAtRelative: "12분 전",
    tags: ["카톡", "리액션"],
  },
  {
    id: "r2",
    authorId: "c2",
    authorName: "지원",
    guyNick: "연남 오빠",
    tier: "voice",
    text: "말끝을 너무 흐리는 편이야. \"아 그래?\", \"그렇구나\" 이런 리액션 좀 넣어봐. 듣고 있는 것만으로도 톤이 완전 바뀌어",
    likes: 189,
    createdAtRelative: "38분 전",
    tags: ["말투", "리액션"],
  },
  {
    id: "r3",
    authorId: "c3",
    authorName: "민지",
    guyNick: "홍대 오빠",
    tier: "voice",
    text: "오빠 웃음이 진짜 편안해요~ 대화하다가 어색해질 때마다 웃음이 자연스러워서 좋았어요. 이거 유지해요!",
    likes: 152,
    createdAtRelative: "1시간 전",
    tags: ["웃음", "톤"],
  },
  {
    id: "r4",
    authorId: "c1",
    authorName: "서연",
    guyNick: "판교 오빠",
    tier: "voice",
    text: "말 시작할 때 \"어...\" 이거 반복이 좀 있어. 생각 정리하는 습관인 건 알겠는데 대화 리듬 끊겨. 한 박자만 참고 바로 시작해봐",
    likes: 128,
    createdAtRelative: "2시간 전",
    tags: ["말버릇"],
  },
  {
    id: "r5",
    authorId: "c4",
    authorName: "달리",
    guyNick: "여의도 오빠",
    tier: "voice",
    text: "질문을 너무 취조식으로 던지고 있어. \"직업이 뭐예요? 취미가 뭐예요?\" 이런 순서는 면접이야. 자기 얘기 한 줄 하고 상대 반응 보고 자연스럽게 열어",
    likes: 176,
    createdAtRelative: "3시간 전",
    tags: ["질문", "대화 흐름"],
  },
  {
    id: "r6",
    authorId: "c2",
    authorName: "지원",
    guyNick: "성수 오빠",
    tier: "voice",
    text: "목소리 톤 진짜 편안하고 좋아. 대신 문장이 끝나기 전에 다음 얘기로 넘어가는 습관이 있어. 한 문장 끝나고 살짝 쉬어줘",
    likes: 98,
    createdAtRelative: "5시간 전",
    tags: ["목소리", "페이스"],
  },
  {
    id: "r7",
    authorId: "c3",
    authorName: "민지",
    guyNick: "합정 오빠",
    tier: "voice",
    text: "오빠 카톡할 때 이모티콘 너무 아껴서 딱딱해 보여요~ ㅎㅎ 하나 정도만 얹어도 훨씬 부드러워요",
    likes: 87,
    createdAtRelative: "어제",
    tags: ["카톡", "이모티콘"],
  },

  /* ============================== 만남 (offline) ==============================
     톤: 옷 · 자세 · 표정 · 매너 · 첫인상 · 오프라인 매력 */
  {
    id: "r8",
    authorId: "c4",
    authorName: "달리",
    guyNick: "잠실 오빠",
    tier: "offline",
    text: "옷은 진짜 나쁘지 않은데 자세가 살짝 굽어있어. 어깨 펴는 것만 해도 인상 완전 달라져. 옷 사는 것보다 이게 먼저야",
    likes: 267,
    createdAtRelative: "22분 전",
    tags: ["자세", "스타일"],
  },
  {
    id: "r9",
    authorId: "c2",
    authorName: "지원",
    guyNick: "역삼 오빠",
    tier: "offline",
    text: "첫인상 진짜 좋았어! 근데 앉을 때 다리 벌리는 자세가 좀 아쉬웠어. 편한 건 알겠는데 카페에선 조금만 신경 써줘",
    likes: 143,
    createdAtRelative: "50분 전",
    tags: ["자세", "매너"],
  },
  {
    id: "r10",
    authorId: "c1",
    authorName: "서연",
    guyNick: "성수 오빠",
    tier: "offline",
    text: "카페에서 메뉴 고를 때 나한테 두세 개 골라주는 거 진짜 좋았어. 배려 있어 보였음. 이거 유지해",
    likes: 198,
    createdAtRelative: "1시간 전",
    tags: ["매너", "배려"],
  },
  {
    id: "r11",
    authorId: "c3",
    authorName: "민지",
    guyNick: "이태원 오빠",
    tier: "offline",
    text: "오빠 셔츠 색깔 완전 잘 어울려요~ 근데 신발이 좀 낡아서 아쉬웠어요. 옷 다 예쁘게 입어도 신발이 다 살려주거든요",
    likes: 112,
    createdAtRelative: "2시간 전",
    tags: ["스타일", "신발"],
  },
  {
    id: "r12",
    authorId: "c4",
    authorName: "달리",
    guyNick: "판교 오빠",
    tier: "offline",
    text: "말할 때 상대 눈 보는 시간이 너무 짧아. 3초는 봐야 자신감 있어 보여. 눈 못 마주치면 다른 매력 다 죽음",
    likes: 175,
    createdAtRelative: "3시간 전",
    tags: ["표정", "아이컨택"],
  },
  {
    id: "r13",
    authorId: "c2",
    authorName: "지원",
    guyNick: "홍대 오빠",
    tier: "offline",
    text: "웃을 때 표정이 진짜 밝아. 대신 사진 찍을 때는 좀 굳어. 카메라 앞에서 어색한 오빠들 많은데, 그건 연습으로 풀려",
    likes: 89,
    createdAtRelative: "4시간 전",
    tags: ["표정", "사진"],
  },
  {
    id: "r14",
    authorId: "c1",
    authorName: "서연",
    guyNick: "강남 오빠",
    tier: "offline",
    text: "향수 살짝 나는 정도가 딱 좋았어. 근데 헤어 스타일이 좀 옛날 스타일이야. 미용실 한 번 바꿔봐. 인상 확 달라져",
    likes: 156,
    createdAtRelative: "어제",
    tags: ["헤어", "첫인상"],
  },
];

/** 커뮤니티 4대 게시판 — 오답노트 3방 + 자유 */
export type CommunityBoardKey = "contact" | "style" | "profile" | "free";

export const communityBoardLabel: Record<CommunityBoardKey, string> = {
  contact: "연락",
  style: "스타일",
  profile: "프사",
  free: "자유",
};

export interface HotPostComment {
  id: string;
  authorNickname: string;
  authorRelationship?: string; // "돌직구 사이다 친구" 등, 팩폭톤/다정톤 구분용 힌트
  body: string;
  createdAtRelative: string; // "3분 전"
  likes: number;
  /** 대댓글 (1단만 지원. 대댓글의 대댓글은 없음) */
  replies?: HotPostComment[];
}

export interface HotPostMock {
  id: string;
  board: CommunityBoardKey;
  boardLabel: string; // communityBoardLabel[board] 캐시
  title: string;
  body?: string; // 미리보기용 본문 (2~3줄)
  authorNickname?: string; // 게시글 저자 (익명 오빠는 랜덤 별칭)
  meta: string; // "댓글 12 · 3시간 전"
  commentCount: number;
  likes: number;
  /** 조회수 — 당근 스타일 좌하단 메타 (`조회 886`) */
  viewCount: number;
  createdAtRelative: string;
  comments: HotPostComment[];
}

/**
 * 커뮤니티 홈 프리뷰 · 상세 페이지용 게시글.
 * 톤: 부드러운 반말. 음슴체 대신 "괜찮아?", "어때?", "뭐라 해야 돼?" 형태.
 * 댓글은 사이다 친구 3가지 톤 (돌직구 / 세심 / 팩폭 / 발랄) 섞어서.
 */
export const hotPostsMock: HotPostMock[] = [
  /* ============================== 연락 ============================== */
  {
    id: "p_c1",
    board: "contact",
    boardLabel: "연락",
    authorNickname: "강남 오빠",
    title: "썸녀한테 이렇게 답장 왔는데 뭐라 해야 돼?",
    body:
      "3번 만난 썸녀야. 어젯밤에 \"오빠 오늘 왜 이렇게 조용해ㅋ 무슨 일 있어?\" 이렇게 왔는데 뭐라 답하는 게 좋을까? 지금까진 서로 하루종일 카톡했어. 어제만 회식 있어서 못 봤거든. 담담하게 답해야 되나 좀 애교 부려야 되나...",
    likes: 42,
    meta: "댓글 8 · 12분 전",
    commentCount: 8,
    viewCount: 342,
    createdAtRelative: "12분 전",
    comments: [
      {
        id: "c_p_c1_1",
        authorNickname: "서연",
        authorRelationship: "돌직구 사이다 친구",
        body: "쿨한 척 하지 마. 그냥 \"어제 회식이라 답 못 봤어 미안, 오늘은 종일 여유돼\" 이거면 끝이야. 애교 부리려다 오글거리면 진짜 답 없어ㅋㅋ",
        createdAtRelative: "8분 전",
        likes: 42,
        replies: [
          {
            id: "c_p_c1_1_r1",
            authorNickname: "강남 오빠",
            body: "오ㅋㅋ 진짜 그정도면 되겠지? 뭔가 더 붙여야 될 것 같아서",
            createdAtRelative: "5분 전",
            likes: 6,
          },
          {
            id: "c_p_c1_1_r2",
            authorNickname: "서연",
            authorRelationship: "돌직구 사이다 친구",
            body: "붙일수록 촌스러워져. 저 문장 그대로 보내고 이따 저녁에 자연스럽게 다른 얘기 걸어봐",
            createdAtRelative: "3분 전",
            likes: 18,
          },
        ],
      },
      {
        id: "c_p_c1_2",
        authorNickname: "지원",
        authorRelationship: "세심한 누나",
        body:
          "저 상황이면 여자는 오빠가 뭐 하는지 궁금해서 문 열어주는 거야. 답을 미루지 말고 바로 답해줘. 대신 회식 얘기 짧게 + 오늘 뭐 하고 싶었는지 한 줄 더 얹으면 완벽해",
        createdAtRelative: "5분 전",
        likes: 28,
      },
      {
        id: "c_p_c1_3",
        authorNickname: "달리",
        authorRelationship: "팩폭 누나",
        body: "3번밖에 안 만났는데 벌써 하루종일 카톡하는 게 문제야. 리듬 잃었어ㅋ 오늘부터 답장 텐션 반만 낮춰봐",
        createdAtRelative: "3분 전",
        likes: 15,
      },
      {
        id: "c_p_c1_4",
        authorNickname: "민지",
        authorRelationship: "발랄한 여동생",
        body: "오빠 그 정도면 잘 하고 있는 거야~ 답 늦었으면 그냥 솔직하게 얘기하면 돼",
        createdAtRelative: "2분 전",
        likes: 9,
      },
      {
        id: "c_p_c1_5",
        authorNickname: "은채",
        body: "회식은 회식이라고 얘기하면 되는데, 어제 저녁에라도 짧게 한 번 답 해줬으면 더 좋았을 것 같아",
        createdAtRelative: "1분 전",
        likes: 4,
      },
    ],
  },
  {
    id: "p_c2",
    board: "contact",
    boardLabel: "연락",
    authorNickname: "성수 오빠",
    title: "저녁에 \"자?\" 카톡은 이제 진짜 안 돼?",
    body:
      "친한 여사친한테 밤 11시에 \"자?\" 보냈다가 다음날 답이 뜸해졌어. 이거 완전 아웃인 거야?",
    likes: 31,
    meta: "댓글 6 · 1시간 전",
    commentCount: 6,
    viewCount: 1128,
    createdAtRelative: "1시간 전",
    comments: [
      {
        id: "c_p_c2_1",
        authorNickname: "민지",
        authorRelationship: "발랄한 여동생",
        body: "\"자?\"는 진짜 90년대 스타일이야ㅋㅋㅋ 오빠 다음엔 \"오늘 뭐 재밌게 봤어?\" 이런 걸로 물어봐~",
        createdAtRelative: "40분 전",
        likes: 51,
        replies: [
          {
            id: "c_p_c2_1_r1",
            authorNickname: "성수 오빠",
            body: "아 그렇구나ㅋㅋ 나 90년대 오빠였네",
            createdAtRelative: "30분 전",
            likes: 12,
          },
        ],
      },
      {
        id: "c_p_c2_2",
        authorNickname: "서연",
        authorRelationship: "돌직구 사이다 친구",
        body: "밤 11시에 \"자?\"는 그냥 심심하다는 신호로만 읽혀. 진짜 물어볼 거 없으면 안 보내는 게 정답이야",
        createdAtRelative: "22분 전",
        likes: 33,
      },
      {
        id: "c_p_c2_3",
        authorNickname: "지원",
        authorRelationship: "세심한 누나",
        body:
          "이번엔 그냥 자연스럽게 낮에 다른 주제로 대화 걸어봐. 어제 얘기는 언급 안 해도 돼. 시간 지나면 뜸함도 풀려",
        createdAtRelative: "15분 전",
        likes: 20,
      },
      {
        id: "c_p_c2_4",
        authorNickname: "달리",
        authorRelationship: "팩폭 누나",
        body: "\"자?\" 보낼 마음이 든 시점에 이미 관계 재정비가 필요한 거야. 좀 더 목적 있는 대화로 가자",
        createdAtRelative: "10분 전",
        likes: 14,
      },
    ],
  },
  {
    id: "p_c3",
    board: "contact",
    boardLabel: "연락",
    authorNickname: "판교 오빠",
    title: "카톡 답장 텀 어느 정도가 적당해?",
    body:
      "나는 답장 오면 바로 봐서 바로 보내는 스타일이야. 근데 주위에선 좀 늦게 보내면서 밀당하라 하는데 진짜 그런 게 통해?",
    likes: 55,
    meta: "댓글 7 · 3시간 전",
    commentCount: 7,
    viewCount: 2317,
    createdAtRelative: "3시간 전",
    comments: [
      {
        id: "c_p_c3_1",
        authorNickname: "지원",
        authorRelationship: "세심한 누나",
        body:
          "밀당은 감정 없을 때 하는 거야. 서로 좋아하면 텐션 맞추는 게 훨씬 나아. 대신 회의 중이거나 진짜 바쁠 땐 자연스럽게 늦게 답해도 돼",
        createdAtRelative: "2시간 전",
        likes: 88,
        replies: [
          {
            id: "c_p_c3_1_r1",
            authorNickname: "판교 오빠",
            body: "맞네ㅋㅋ 억지로 참는 게 오히려 이상하지",
            createdAtRelative: "1시간 전",
            likes: 15,
          },
        ],
      },
      {
        id: "c_p_c3_2",
        authorNickname: "달리",
        authorRelationship: "팩폭 누나",
        body: "답장 빠르다고 매력 없다는 소리 나오면 그건 답장 내용이 문제인 거야. 속도 말고 내용을 봐",
        createdAtRelative: "1시간 전",
        likes: 62,
      },
      {
        id: "c_p_c3_3",
        authorNickname: "민지",
        authorRelationship: "발랄한 여동생",
        body: "오빠 그냥 자연스러운 속도로 답하는 게 최고야~ 계산하면 다 티나거든ㅋㅋ",
        createdAtRelative: "40분 전",
        likes: 21,
      },
      {
        id: "c_p_c3_4",
        authorNickname: "은채",
        body: "밀당 통하는 사람도 있긴 한데, 통한다고 만족스러운 관계가 되는 건 아니야",
        createdAtRelative: "20분 전",
        likes: 8,
      },
    ],
  },

  /* ============================== 스타일 ============================== */
  {
    id: "p_s1",
    board: "style",
    boardLabel: "스타일",
    authorNickname: "합정 오빠",
    title: "첫 소개팅 코디 이거 괜찮아?",
    body:
      "이번 주 토요일 첫 소개팅이야. 네이비 셔츠 + 베이지 슬랙스 + 흰 스니커즈 조합인데 무난한지 봐줘. 장소는 성수동 카페야.",
    likes: 47,
    meta: "댓글 6 · 27분 전",
    commentCount: 6,
    viewCount: 486,
    createdAtRelative: "27분 전",
    comments: [
      {
        id: "c_p_s1_1",
        authorNickname: "서연",
        authorRelationship: "돌직구 사이다 친구",
        body: "무난은 한데 재미없어ㅋ 셔츠 대신 반팔 니트 어때? 요즘 성수는 그게 정답이야",
        createdAtRelative: "15분 전",
        likes: 47,
        replies: [
          {
            id: "c_p_s1_1_r1",
            authorNickname: "합정 오빠",
            body: "니트? 지금 8월인데 안 더울까?",
            createdAtRelative: "12분 전",
            likes: 5,
          },
          {
            id: "c_p_s1_1_r2",
            authorNickname: "서연",
            authorRelationship: "돌직구 사이다 친구",
            body: "여름용 코튼 반팔 니트 있어. 얇고 시원해. 카페 안에서는 오히려 딱이야",
            createdAtRelative: "10분 전",
            likes: 22,
          },
        ],
      },
      {
        id: "c_p_s1_2",
        authorNickname: "지원",
        authorRelationship: "세심한 누나",
        body: "조합 자체는 완전 괜찮아! 근데 스니커즈만 좀 신경 써줘. 완전 새 것처럼 깨끗해야 해. 낡으면 코디 다 죽어",
        createdAtRelative: "8분 전",
        likes: 31,
      },
      {
        id: "c_p_s1_3",
        authorNickname: "달리",
        authorRelationship: "팩폭 누나",
        body: "네이비 셔츠 소재가 뭔지가 관건이야. 폴리 광택 있으면 아저씨 돼. 면 무광으로 가",
        createdAtRelative: "4분 전",
        likes: 19,
      },
      {
        id: "c_p_s1_4",
        authorNickname: "민지",
        authorRelationship: "발랄한 여동생",
        body: "성수는 좀 캐주얼한 게 더 잘 어울려요~ 셔츠 살짝 걷어입어도 좋을 것 같아",
        createdAtRelative: "2분 전",
        likes: 12,
      },
    ],
  },
  {
    id: "p_s2",
    board: "style",
    boardLabel: "스타일",
    authorNickname: "혜화 오빠",
    title: "175/72인데 오버핏 어디까지 소화돼?",
    body:
      "요즘 오버핏 티셔츠나 셋업 많이 입잖아. 근데 나는 어깨가 좀 좁아서 오버 입으면 옷걸이처럼 보여. 어떻게 입어야 돼?",
    likes: 26,
    meta: "댓글 5 · 2시간 전",
    commentCount: 5,
    viewCount: 1734,
    createdAtRelative: "2시간 전",
    comments: [
      {
        id: "c_p_s2_1",
        authorNickname: "민지",
        authorRelationship: "발랄한 여동생",
        body: "오빠 어깨 좁으면 그냥 세미오버로 가는 게 나아~ 완전 오버는 어깨 넓은 사람만 소화되거든",
        createdAtRelative: "1시간 전",
        likes: 26,
      },
      {
        id: "c_p_s2_2",
        authorNickname: "지원",
        authorRelationship: "세심한 누나",
        body:
          "상체는 정핏, 하체는 살짝 와이드가 밸런스 좋아. 위아래 다 오버는 티가 너무 나거든",
        createdAtRelative: "40분 전",
        likes: 22,
        replies: [
          {
            id: "c_p_s2_2_r1",
            authorNickname: "혜화 오빠",
            body: "오 이거 진짜 도움 됐어. 하의로 밸런스 맞추는 걸 놓쳤네",
            createdAtRelative: "30분 전",
            likes: 4,
          },
        ],
      },
      {
        id: "c_p_s2_3",
        authorNickname: "서연",
        authorRelationship: "돌직구 사이다 친구",
        body: "오버 입고 싶으면 어깨 뽕이 들어간 재킷 하나 사. 그거만으로도 실루엣 달라져",
        createdAtRelative: "15분 전",
        likes: 11,
      },
    ],
  },
  {
    id: "p_s3",
    board: "style",
    boardLabel: "스타일",
    authorNickname: "잠실 오빠",
    title: "머리 자르러 갈 건데 요즘 뭐가 국룰이야?",
    body: "머리 스타일 진짜 오래 안 바꿨어. 이번엔 좀 인상 확 바꾸고 싶은데 요즘 뭐가 트렌드야? 스포츠는 좀 부담돼...",
    likes: 41,
    meta: "댓글 4 · 어제",
    commentCount: 4,
    viewCount: 3082,
    createdAtRelative: "어제",
    comments: [
      {
        id: "c_p_s3_1",
        authorNickname: "서연",
        authorRelationship: "돌직구 사이다 친구",
        body:
          "그냥 다운펌 + 옆머리 살짝 짧게 가. 스포츠 부담되면 이거만 해도 인상 완전 바뀌어. 미용실 가서 \"내추럴 다운펌\"이라고 얘기해",
        createdAtRelative: "22시간 전",
        likes: 55,
        replies: [
          {
            id: "c_p_s3_1_r1",
            authorNickname: "잠실 오빠",
            body: "오 이거 처음 들어봤어. 내일 바로 예약해봐야겠어",
            createdAtRelative: "20시간 전",
            likes: 8,
          },
        ],
      },
      {
        id: "c_p_s3_2",
        authorNickname: "달리",
        authorRelationship: "팩폭 누나",
        body: "머리 오래 안 바꿨다는 얘기가 벌써 문제야. 3개월에 한 번은 다녀야 해ㅋ",
        createdAtRelative: "15시간 전",
        likes: 41,
      },
    ],
  },

  /* ============================== 프사 ============================== */
  {
    id: "p_p1",
    board: "profile",
    boardLabel: "프사",
    authorNickname: "여의도 오빠",
    title: "카톡 프사 이거 어때? 여사친이 별로래ㅠ",
    body:
      "혼자 여행 가서 뒷모습으로 찍은 사진이야. 감성 있어서 좋다고 생각했는데 여사친이 \"오빠 이거 좀...\" 이러네ㅠㅠ 왜 별론지 봐줘.",
    likes: 76,
    meta: "댓글 9 · 45분 전",
    commentCount: 9,
    viewCount: 892,
    createdAtRelative: "45분 전",
    comments: [
      {
        id: "c_p_p1_1",
        authorNickname: "서연",
        authorRelationship: "돌직구 사이다 친구",
        body:
          "뒷모습 프사는 인스타 감성이지 카톡은 얼굴 보여줘야 해. 처음 카톡 추가한 사람이 뒷모습만 보면 뭐라 말 걸겠어",
        createdAtRelative: "30분 전",
        likes: 76,
        replies: [
          {
            id: "c_p_p1_1_r1",
            authorNickname: "여의도 오빠",
            body: "그건 그렇지... 뭔가 얼굴 내놓기가 부끄러워서",
            createdAtRelative: "25분 전",
            likes: 5,
          },
          {
            id: "c_p_p1_1_r2",
            authorNickname: "서연",
            authorRelationship: "돌직구 사이다 친구",
            body: "부끄러워하지 마. 웃는 얼굴 하나만 있어도 인상 완전 바뀌어",
            createdAtRelative: "20분 전",
            likes: 19,
          },
        ],
      },
      {
        id: "c_p_p1_2",
        authorNickname: "지원",
        authorRelationship: "세심한 누나",
        body: "감성 있는 건 알겠어. 근데 소개팅용은 아니야. 웃는 상반신 사진 하나는 꼭 있어야 해",
        createdAtRelative: "18분 전",
        likes: 44,
      },
      {
        id: "c_p_p1_3",
        authorNickname: "민지",
        authorRelationship: "발랄한 여동생",
        body: "뒷모습 프사 = 프로필 클릭 안 하고 넘어가는 스타일이야ㅋㅋ 여사친 조언이 맞아요~",
        createdAtRelative: "10분 전",
        likes: 33,
      },
      {
        id: "c_p_p1_4",
        authorNickname: "은채",
        body: "여행 사진은 두 번째 프사로 쓰고, 첫 번째는 얼굴이 잘 나오는 걸로 가는 게 좋아",
        createdAtRelative: "5분 전",
        likes: 12,
      },
    ],
  },
  {
    id: "p_p2",
    board: "profile",
    boardLabel: "프사",
    authorNickname: "광화문 오빠",
    title: "정장 사진 vs 일상 사진 뭐가 나아?",
    body: "회사에서 찍은 정장 사진이 제일 깔끔하게 나왔는데 프사로 쓰기엔 오버스러운가? 아니면 그냥 일상 카페 사진이 나아?",
    likes: 38,
    meta: "댓글 5 · 2시간 전",
    commentCount: 5,
    viewCount: 1421,
    createdAtRelative: "2시간 전",
    comments: [
      {
        id: "c_p_p2_1",
        authorNickname: "지원",
        authorRelationship: "세심한 누나",
        body: "정장은 링크드인용이야ㅋ 카톡은 일상이 나아. 대신 카페에서 앉아있는 컷보다 산책하다 자연스럽게 찍힌 게 훨씬 좋아",
        createdAtRelative: "1시간 전",
        likes: 38,
      },
      {
        id: "c_p_p2_2",
        authorNickname: "서연",
        authorRelationship: "돌직구 사이다 친구",
        body: "정장 사진 = \"저 진지한 사람이에요\" 시그널이라 좀 부담이야. 일상 가벼운 걸로 가",
        createdAtRelative: "40분 전",
        likes: 22,
      },
      {
        id: "c_p_p2_3",
        authorNickname: "민지",
        authorRelationship: "발랄한 여동생",
        body: "오빠 카페 사진도 예쁘게 나오면 괜찮은데, 셀카 각도 진짜 중요해요~",
        createdAtRelative: "20분 전",
        likes: 14,
      },
    ],
  },
  {
    id: "p_p3",
    board: "profile",
    boardLabel: "프사",
    authorNickname: "홍대 오빠",
    title: "얼굴에 자신 없어서 강아지 프사 써... 이거 문제야?",
    body: "얼굴에 진짜 자신이 없어서 우리집 강아지 프사 5년째 쓰고 있어. 근데 소개팅 시장 들어오면 이거 진짜 문제인 거야?",
    likes: 89,
    meta: "댓글 8 · 4시간 전",
    commentCount: 8,
    viewCount: 2569,
    createdAtRelative: "4시간 전",
    comments: [
      {
        id: "c_p_p3_1",
        authorNickname: "달리",
        authorRelationship: "팩폭 누나",
        body:
          "미안한데 얼굴 안 보이는 프사는 소개팅 시장에서 자동 거름이야. 강아지 귀엽지만 그건 두 번째 프사로 밀고 첫 번째는 얼굴로 가야 해",
        createdAtRelative: "3시간 전",
        likes: 89,
        replies: [
          {
            id: "c_p_p3_1_r1",
            authorNickname: "홍대 오빠",
            body: "역시... 나도 알고는 있는데 자신이 없어서 계속 미뤘어",
            createdAtRelative: "2시간 전",
            likes: 11,
          },
          {
            id: "c_p_p3_1_r2",
            authorNickname: "달리",
            authorRelationship: "팩폭 누나",
            body: "자신 없을수록 얼굴부터 익숙해져야 해. 스마트폰 셀카 100장 찍어보고 그중에 제일 나은 걸로 골라. 아무리 별로여도 강아지보단 훨씬 나아",
            createdAtRelative: "1시간 전",
            likes: 34,
          },
        ],
      },
      {
        id: "c_p_p3_2",
        authorNickname: "지원",
        authorRelationship: "세심한 누나",
        body:
          "얼굴 자신 없는 건 알아. 근데 웃고 있는 사진 딱 한 장이면 돼. 각도 좋은 사진이 없으면 그거 찍는 것부터 시작해보자",
        createdAtRelative: "2시간 전",
        likes: 54,
      },
      {
        id: "c_p_p3_3",
        authorNickname: "민지",
        authorRelationship: "발랄한 여동생",
        body: "강아지 5년ㅋㅋㅋ 오빠 아무튼 강아지는 두 번째 프사로 유지해도 좋아요~ 첫 번째만 바꾸자",
        createdAtRelative: "1시간 전",
        likes: 27,
      },
      {
        id: "c_p_p3_4",
        authorNickname: "은채",
        body: "얼굴 사진 첨엔 어색해도 몇 번 바꾸다 보면 자연스러워져. 지금부터라도 조금씩 익숙해져보자",
        createdAtRelative: "30분 전",
        likes: 15,
      },
    ],
  },

  /* ============================== 자유 ============================== */
  {
    id: "p_f1",
    board: "free",
    boardLabel: "자유",
    authorNickname: "성공한 오빠",
    title: "3개월 만에 첫 소개팅 성공했어. 진짜 고마워ㅠㅠ",
    body:
      "여기서 3개월 동안 카톡/스타일/프사 다 뜯어 고쳤어. 어제 만난 소개팅 상대가 다음 주에 또 보자고 하네. 감사 인사 남기고 가.",
    likes: 61,
    meta: "댓글 6 · 3시간 전",
    commentCount: 6,
    viewCount: 1876,
    createdAtRelative: "3시간 전",
    comments: [
      {
        id: "c_p_f1_1",
        authorNickname: "서연",
        authorRelationship: "돌직구 사이다 친구",
        body: "이거 진짜 축하해ㅠㅠ 3개월 동안 진짜 열심히 하는 거 봤어. 다음 주도 화이팅~",
        createdAtRelative: "2시간 전",
        likes: 61,
      },
      {
        id: "c_p_f1_2",
        authorNickname: "지원",
        authorRelationship: "세심한 누나",
        body: "정말 대단해. 잊지 마 첫 성공보다 지속이 더 중요해",
        createdAtRelative: "1시간 전",
        likes: 45,
        replies: [
          {
            id: "c_p_f1_2_r1",
            authorNickname: "성공한 오빠",
            body: "네 감사해요ㅠㅠ 이 톤 계속 유지해보려고요",
            createdAtRelative: "50분 전",
            likes: 8,
          },
        ],
      },
      {
        id: "c_p_f1_3",
        authorNickname: "달리",
        authorRelationship: "팩폭 누나",
        body: "잘했어. 근데 방심하지 마. 두 번째 만남에서 자기 색 진하게 드러내는 순간 무너지는 애들 많아",
        createdAtRelative: "30분 전",
        likes: 28,
      },
      {
        id: "c_p_f1_4",
        authorNickname: "민지",
        authorRelationship: "발랄한 여동생",
        body: "오빠 진짜 잘했어요~ 나중에 후기 또 남겨줘요!",
        createdAtRelative: "10분 전",
        likes: 19,
      },
    ],
  },
  {
    id: "p_f2",
    board: "free",
    boardLabel: "자유",
    authorNickname: "어색한 오빠",
    title: "여자랑 대화할 때 침묵이 무서워ㅠ",
    body:
      "만나면 첫 10분은 괜찮은데 그 다음부터 대화 주제가 떨어지면 침묵이 오는 게 진짜 무서워. 이거 어떻게 극복해?",
    likes: 78,
    meta: "댓글 5 · 어제",
    commentCount: 5,
    viewCount: 4218,
    createdAtRelative: "어제",
    comments: [
      {
        id: "c_p_f2_1",
        authorNickname: "달리",
        authorRelationship: "팩폭 누나",
        body:
          "침묵이 무서운 이유는 뭘 채워야 한다고 생각해서 그래. \"침묵 = 나쁜 것\"이라는 프레임을 먼저 깨야 해. 침묵 오면 그냥 상대 눈 보고 웃어봐. 그것만 해도 어색함이 반은 사라져",
        createdAtRelative: "20시간 전",
        likes: 78,
        replies: [
          {
            id: "c_p_f2_1_r1",
            authorNickname: "어색한 오빠",
            body: "그 생각 자체가 안 들었어. 침묵 견디는 연습을 해야겠어",
            createdAtRelative: "18시간 전",
            likes: 12,
          },
        ],
      },
      {
        id: "c_p_f2_2",
        authorNickname: "민지",
        authorRelationship: "발랄한 여동생",
        body: "오빠 침묵 오기 전에 미리 질문 3개 정도 준비해가~ 진짜 유용해요",
        createdAtRelative: "18시간 전",
        likes: 34,
      },
      {
        id: "c_p_f2_3",
        authorNickname: "지원",
        authorRelationship: "세심한 누나",
        body:
          "침묵 오면 오히려 그 순간에 나눈 얘기 중에 하나 골라서 더 깊이 물어봐. \"아까 얘기 다시 궁금해서\" 이렇게 열면 자연스러워",
        createdAtRelative: "10시간 전",
        likes: 22,
      },
    ],
  },
  {
    id: "p_f3",
    board: "free",
    boardLabel: "자유",
    authorNickname: "익명 오빠",
    title: "오늘 통화한 사이다 친구 진짜 좋았어. 익명이지만 감사해요",
    body:
      "익명이라 이름은 못 밝히지만 오늘 통화한 사이다 친구님 진짜 편하게 대해줘서 30분 동안 어색함 없이 얘기했어. 첫 통화라 진짜 긴장했는데 이런 곳에서 시작한 거 잘한 것 같아. 감사해요.",
    likes: 29,
    meta: "댓글 3 · 6시간 전",
    commentCount: 3,
    viewCount: 754,
    createdAtRelative: "6시간 전",
    comments: [
      {
        id: "c_p_f3_1",
        authorNickname: "지원",
        authorRelationship: "세심한 누나",
        body: "이런 후기 진짜 좋아. 다음 통화도 지금처럼 편안하게 왔으면 좋겠어",
        createdAtRelative: "4시간 전",
        likes: 29,
      },
      {
        id: "c_p_f3_2",
        authorNickname: "민지",
        authorRelationship: "발랄한 여동생",
        body: "오빠 잘했어요~ 다음엔 좀 더 여유롭게 즐겨봐요!",
        createdAtRelative: "2시간 전",
        likes: 14,
      },
      {
        id: "c_p_f3_3",
        authorNickname: "서연",
        authorRelationship: "돌직구 사이다 친구",
        body: "익명이라도 후기 남긴 오빠가 진짜 대단해. 계속 이런 후기 쌓이면 다들 시작하기 쉬워져",
        createdAtRelative: "1시간 전",
        likes: 18,
      },
    ],
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
  /** UI 편의: 완료 회차의 사이다 친구 피드백 요약 (실제 스키마에선 Report 안에 있음) */
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
 *  t1 (c1 서연)  — voice 2 완료, 다음 애프터 조율 중
 *  t2 (c2 지원)  — voice 1 완료, 아직 다음 신청 없음
 *  t3 (c4 달리)  — voice 1 완료, offline 예약 확정
 *  t4 (c7 은채)  — 첫 애프터 신청, 아직 시간 조율 중
 */
export const datingThreadsMock: DatingThreadMock[] = [
  {
    id: "t1",
    userId: CURRENT_USER_ID,
    creatorId: "c1",
    status: "active",
    voiceCount: 2,
    offlineCount: 0,
    lastMeetAt: "2026-07-05T20:30:00+09:00",
    lastMeetTier: "voice",
    nextPendingMeetId: undefined, // 조율 중이라 아직 Meet 미확정
    createdAt: "2026-06-14T21:00:00+09:00",
  },
  {
    id: "t2",
    userId: CURRENT_USER_ID,
    creatorId: "c2",
    status: "active",
    voiceCount: 1,
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
    offlineCount: 0,
    lastMeetAt: "2026-07-02T21:00:00+09:00",
    lastMeetTier: "voice",
    nextPendingMeetId: "m_t3_3", // 오프라인 회차 예약 확정됨
    createdAt: "2026-06-20T20:00:00+09:00",
  },
  {
    id: "t4",
    userId: CURRENT_USER_ID,
    creatorId: "c7",
    status: "active",
    voiceCount: 0,
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
  // t1: video 제거됨(2티어로 축소)
  {
    id: "ar_t1_3",
    threadId: "t1",
    previousMeetId: "m_t1_2",
    requestedTier: "voice",
    status: "booked",
    message: "얼굴 보고 얘기하고 싶어",
    createdAt: "2026-07-04T20:00:00+09:00",
    bookedAt: "2026-07-04T20:30:00+09:00",
  },
  // t1: video 제거됨(2티어로 축소)
  {
    id: "ar_t1_4",
    threadId: "t1",
    previousMeetId: "m_t1_3",
    requestedTier: "voice",
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

  // t3: video 제거됨(2티어로 축소)
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
    requestedTier: "voice",
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
    tier: "voice",
    scheduledAt: "2026-07-05T20:30:00+09:00",
    status: "confirmed",
    confirmedAt: "2026-07-04T20:30:00+09:00",
    updatedAt: "2026-07-04T20:30:00+09:00",
  },
  {
    id: "bk_t1_4",
    afterRequestId: "ar_t1_4",
    tier: "voice",
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
    tier: "voice",
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
    tier: "voice",
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
    tier: "voice",
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
    body: "지난번 통화 재밌었어! 이번주 금요일 밤 어때?",
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

/* ============================================================
 * 매력 트레이닝 — 대면 활동 모집 (charm-training)
 * 스킬: [[charm-training]]
 * 5개 활동 · 친구 오픈 + 오빠 오픈 · 정원 1명 (선착순)
 * ============================================================ */

export type CharmActivityKind =
  | "wardrobe" // 옷장 리부트
  | "photo" // 인생샷 나들이
  | "cafe" // 카페 탐방
  | "food" // 맛집 탐방
  | "activity"; // 게임 (볼링/보드게임 등)

export const charmActivityLabel: Record<CharmActivityKind, string> = {
  wardrobe: "옷장 리부트",
  photo: "인생샷",
  cafe: "카페 탐방",
  food: "맛집 탐방",
  activity: "게임",
};

export const charmActivityEmoji: Record<CharmActivityKind, string> = {
  wardrobe: "🛍️",
  photo: "✨",
  cafe: "☕",
  food: "🍽️",
  activity: "🎳",
};

export type TrainingPostAuthor = "creator" | "user"; // 사이다친구 오픈 vs 고구마오빠 오픈
export type TrainingPostStatus = "open" | "matched" | "done" | "canceled";

export interface TrainingPostMock {
  id: string;
  activity: CharmActivityKind;
  authorType: TrainingPostAuthor;
  /** authorType=creator 이면 CreatorMock.id, user 이면 유저 nickname 캐시 */
  authorId: string;
  authorNickname: string;
  authorAvatar: string;
  authorRelationship?: string; // "돌직구 사이다 친구" 등 (creator 만)
  /** ISO 로컬 시간 (KST) — YYYY-MM-DDTHH:mm */
  scheduledAt: string;
  location: string; // "강남 앤트러사이트"
  appeal: string; // "카페 좋아하는 오빠 나와~" 한줄
  status: TrainingPostStatus;
  viewCount: number;
  createdAtRelative: string; // "12분 전" — 진입 리스트용
  /** matched 이후 세팅됨 */
  matchedWithNickname?: string;
}

/**
 * MVP mock: 오늘~일요일 범위. 정원 1명 선착순.
 * 반은 사이다친구 오픈, 몇 개는 오빠 오픈으로 섞어서 UX 검증.
 */
export const trainingPostsMock: TrainingPostMock[] = [
  {
    id: "tp_1",
    activity: "cafe",
    authorType: "creator",
    authorId: "c1",
    authorNickname: "서연",
    authorAvatar: "/avatars/char03.png",
    authorRelationship: "돌직구 사이다 친구",
    scheduledAt: "2026-07-20T15:00",
    location: "강남 앤트러사이트",
    appeal: "카페 좋아하는 사람 나와~ 1시간 잔잔한 대화 콜?",
    status: "open",
    viewCount: 42,
    createdAtRelative: "12분 전",
  },
  {
    id: "tp_2",
    activity: "wardrobe",
    authorType: "creator",
    authorId: "c2",
    authorNickname: "지원",
    authorAvatar: "/avatars/char04.png",
    authorRelationship: "세심한 누나",
    scheduledAt: "2026-07-22T14:00",
    location: "성수 츠타야",
    appeal: "여름 소개팅룩 필요한 오빠. 예산 잡아주면 내가 맞춰서 같이 골라줄게",
    status: "open",
    viewCount: 87,
    createdAtRelative: "1시간 전",
  },
  {
    id: "tp_3",
    activity: "activity",
    authorType: "creator",
    authorId: "c3",
    authorNickname: "민지",
    authorAvatar: "/avatars/char02.png",
    authorRelationship: "발랄한 여동생",
    scheduledAt: "2026-07-23T19:00",
    location: "홍대 브랜스윅 볼링장",
    appeal: "볼링 잘 치면 완전 호감 포인트인거 알지? 나랑 연습하자ㅋㅋ 편한 사람 환영",
    status: "open",
    viewCount: 34,
    createdAtRelative: "3시간 전",
  },
  {
    id: "tp_4",
    activity: "food",
    authorType: "creator",
    authorId: "c4",
    authorNickname: "달리",
    authorAvatar: "/avatars/char14.png",
    authorRelationship: "팩폭 누나",
    scheduledAt: "2026-07-24T19:30",
    location: "여의도 백년옥",
    appeal: "여기 설렁탕 맛집이라는데 같이 먹을 사람? 밥 먹으면서 고민들어주께",
    status: "open",
    viewCount: 56,
    createdAtRelative: "5시간 전",
  },
  {
    id: "tp_5",
    activity: "photo",
    authorType: "creator",
    authorId: "c7",
    authorNickname: "은채",
    authorAvatar: "/avatars/char11.png",
    authorRelationship: "다정한 후배",
    scheduledAt: "2026-07-25T16:00",
    location: "성수 서울숲",
    appeal: "소개팅 앱 프사 할 거 없는 사람~ 내가 분조카에서 인생샷 찍고 보정까지 알아서 해줄게",
    status: "open",
    viewCount: 128,
    createdAtRelative: "어제",
  },
  {
    id: "tp_6",
    activity: "cafe",
    authorType: "creator",
    authorId: "c5",
    authorNickname: "하늘",
    authorAvatar: "/avatars/char16.png",
    authorRelationship: "위로 담당 누나",
    scheduledAt: "2026-07-26T14:00",
    location: "연남동 프릳츠",
    appeal: "조용조용 얘기하는 오빠 환영. 커피 취향 맞으면 더 좋음",
    status: "open",
    viewCount: 61,
    createdAtRelative: "어제",
  },
  // ─── 오빠 오픈 ───
  {
    id: "tp_7",
    activity: "cafe",
    authorType: "user",
    authorId: "u_kangnam",
    authorNickname: "강남 오빠",
    authorAvatar: "/avatars/sweet-potato.png",
    scheduledAt: "2026-07-21T20:00",
    location: "강남 알케미스트",
    appeal: "고민 들어줄 친구 구함.. 차인 스토리 들려줄게 뭐가 문제인지 같이 고민해보자",
    status: "open",
    viewCount: 24,
    createdAtRelative: "40분 전",
  },
  {
    id: "tp_8",
    activity: "activity",
    authorType: "user",
    authorId: "u_seongsu",
    authorNickname: "성수 오빠",
    authorAvatar: "/avatars/sweet-potato.png",
    scheduledAt: "2026-07-27T15:00",
    location: "합정 마인드클럽 보드게임",
    appeal: "여자들 보드게임 안 좋아하나?? 같이 루미큐브 하면서 편하게 얘기하고 싶음",
    status: "open",
    viewCount: 18,
    createdAtRelative: "2시간 전",
  },
];

/**
 * 활동 후기 — 만남 완료 후 남긴 감상.
 * 카드 UI 는 사이다 피드백(RealCommentsBoard) 카드 재사용.
 */
export interface TrainingReviewMock {
  id: string;
  activity: CharmActivityKind;
  authorNickname: string; // 사이다친구
  guyNick: string; // "강남 오빠" 등
  text: string;
  likes: number;
  createdAtRelative: string;
}

export const trainingReviewsMock: TrainingReviewMock[] = [
  {
    id: "tr_1",
    activity: "cafe",
    authorNickname: "서연",
    guyNick: "강남 오빠",
    text: "카페에서 2시간 잔잔하게 얘기함. 대화 리듬 좋아지셨어. 커피 자기 취향 있는 게 매력 포인트.",
    likes: 12,
    createdAtRelative: "2시간 전",
  },
  {
    id: "tr_2",
    activity: "wardrobe",
    authorNickname: "지원",
    guyNick: "성수 오빠",
    text: "츠타야에서 여름 셋업 완성. 블랙 대신 카키 선 게 정답. 다음엔 신발도.",
    likes: 24,
    createdAtRelative: "어제",
  },
  {
    id: "tr_3",
    activity: "activity",
    authorNickname: "민지",
    guyNick: "홍대 오빠",
    text: "볼링 첨엔 어색했는데 3게임쯤 되니 완전 편해짐ㅋㅋ 웃는 얼굴이 훨씬 어울림",
    likes: 18,
    createdAtRelative: "2일 전",
  },
  {
    id: "tr_4",
    activity: "food",
    authorNickname: "달리",
    guyNick: "여의도 오빠",
    text: "설렁탕 앞에 두고 진짜 얘기 들었어. 가족 얘기 편하게 하는 사람이 신뢰 감. 좋은 시간이었어.",
    likes: 31,
    createdAtRelative: "3일 전",
  },
  {
    id: "tr_5",
    activity: "photo",
    authorNickname: "은채",
    guyNick: "성수 오빠",
    text: "서울숲에서 필름 카메라로 서로 찍음. 자연스러운 표정 잘 나옴. 프사 갈아도 될 정도.",
    likes: 42,
    createdAtRelative: "5일 전",
  },
];


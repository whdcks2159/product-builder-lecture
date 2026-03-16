// ── Firestore Collections ─────────────────────────────────────────────
// meetups/{meetupId}
// meetups/{meetupId}/members/{userId}
// meetups/{meetupId}/posts/{postId}
// meetups/{meetupId}/posts/{postId}/comments/{commentId}

export interface Meetup {
  id: string;
  title: string;
  category: string;          // e.g. 'running'
  categoryLabel: string;     // e.g. '러닝'
  region: string;            // e.g. 'seoul'
  regionLabel: string;       // e.g. '서울'
  date: string;              // ISO date string 'YYYY-MM-DD'
  time: string;              // 'HH:MM'
  maxMembers: number;
  memberCount: number;
  postCount: number;
  description: string;
  createdBy: string;         // userId
  createdByNickname: string;
  createdAt: { seconds: number } | null;
  status: 'open' | 'full' | 'closed';
}

export interface MeetupMember {
  userId: string;
  nickname: string;
  joinedAt: { seconds: number } | null;
}

export interface MeetupPost {
  id: string;
  meetupId: string;
  userId: string;
  nickname: string;
  boardType: 'notice' | 'review' | 'chat' | 'certification';
  title: string;
  content: string;
  imageUrl?: string;
  likeCount: number;
  likedBy: string[];         // userIds
  commentCount: number;
  createdAt: { seconds: number } | null;
}

export interface MeetupComment {
  id: string;
  postId: string;
  userId: string;
  nickname: string;
  text: string;
  createdAt: { seconds: number } | null;
}

// ── Constants ──────────────────────────────────────────────────────────
export const MEETUP_CATEGORIES = [
  { id: 'running',     label: '러닝',      icon: '🏃' },
  { id: 'gym',         label: '헬스',      icon: '🏋️' },
  { id: 'yoga',        label: '요가',      icon: '🧘' },
  { id: 'stretching',  label: '스트레칭',  icon: '🤸' },
  { id: 'hiking',      label: '등산',      icon: '🏔️' },
  { id: 'cycling',     label: '사이클링',  icon: '🚴' },
  { id: 'soccer',      label: '축구',      icon: '⚽' },
  { id: 'basketball',  label: '농구',      icon: '🏀' },
  { id: 'pilates',     label: '필라테스',  icon: '🤸' },
  { id: 'swimming',    label: '수영',      icon: '🏊' },
] as const;

export const MEETUP_REGIONS = [
  { id: 'seoul',    label: '서울' },
  { id: 'gyeonggi', label: '경기' },
  { id: 'incheon',  label: '인천' },
  { id: 'busan',    label: '부산' },
  { id: 'daegu',    label: '대구' },
  { id: 'daejeon',  label: '대전' },
  { id: 'gwangju',  label: '광주' },
  { id: 'ulsan',    label: '울산' },
  { id: 'jeju',     label: '제주' },
  { id: 'other',    label: '기타' },
] as const;

export const BOARD_TYPES = [
  { id: 'notice',        label: '📢 공지',     icon: '📢' },
  { id: 'review',        label: '🏆 운동 후기', icon: '🏆' },
  { id: 'chat',          label: '💬 잡담',     icon: '💬' },
  { id: 'certification', label: '📸 운동 인증', icon: '📸' },
] as const;

export type BoardType = 'notice' | 'review' | 'chat' | 'certification';

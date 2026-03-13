export interface Post {
  id: string;
  userId: string;
  nickname: string;
  category: string;
  title: string;
  content: string;
  createdAt: { seconds: number } | null;
  viewCount: number;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  nickname: string;
  text: string;
  createdAt: { seconds: number } | null;
}

export const COMMUNITY_CATEGORIES = [
  { id: 'running', name: '러닝', icon: '🏃' },
  { id: 'gym', name: '헬스', icon: '🏋️' },
  { id: 'stretching', name: '스트레칭', icon: '🤸' },
  { id: 'yoga', name: '요가', icon: '🧘' },
  { id: 'rehab', name: '재활 운동', icon: '💊' },
  { id: 'question', name: '운동 질문', icon: '❓' },
] as const;

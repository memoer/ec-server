export interface RemoveOrRestore {
  type: 'remove' | 'restore';
  userId: number;
  nickname: string;
  reason?: string;
}

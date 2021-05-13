export interface QueryAll<T> {
  data: T[];
  curPage: number;
  totalPage: number;
  hasNextPage: boolean;
}

declare global {
  namespace jest {
    interface Expect {
      anyOrNull(classType: any): void;
    }
  }
}

export interface Item {
  createdAt: string;
  filename: string;
}

export type SortOption = 'createdAtAsc' | 'filenameAsc' | 'filenameDesc';
export interface Offset {
  days?: number;
  months?: number;
}

export interface SearchTestData {
  id: string;
  from: string;
  to: string;
  fromOffset: Offset;
  toOffset: Offset;
  guests: number;
}
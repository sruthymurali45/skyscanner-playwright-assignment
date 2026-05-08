import * as fs from 'fs';
import * as path from 'path';

export interface SearchTestData {
  id: string;
  from: string;
  to: string;
  fromOffset: { days?: number; months?: number };
  toOffset: { days?: number; months?: number };
  guests: number;
}

export class TestDataLoader {
  static load(): SearchTestData[] {
    const filePath = path.resolve(process.cwd(), 'test-data/searchData.json');
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw) as SearchTestData[];
  }
}
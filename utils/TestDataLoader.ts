import * as fs from 'fs';
import * as path from 'path';

export class TestDataLoader {

  // Load single JSON file
  static load<T>(fileName: string): T[] {

    const filePath = path.resolve(
      process.cwd(),
      'test-data',
      fileName
    );

    const rawData =
      fs.readFileSync(filePath, 'utf-8');

    return JSON.parse(rawData) as T[];
  }


  // Load all JSON files (optional utility)
  static loadAll<T>(folderName: string = 'test-data'): T[] {

    const folder =
      path.resolve(process.cwd(), folderName);

    const files =
      fs.readdirSync(folder)
        .filter(file => file.endsWith('.json'));

    const allData: T[] = [];

    for (const file of files) {

      const rawData =
        fs.readFileSync(path.join(folder, file), 'utf-8');

      const parsedData =
        JSON.parse(rawData) as T[];

      allData.push(...parsedData);
    }

    return allData;
  }
}
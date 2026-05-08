import * as path from 'path';
import * as fs from 'fs';

export interface Offset {
  days?: number;
  months?: number;
}

export class DateUtils {

  static getToday(): Date {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }

  static applyOffset(base: Date, offset: Offset): Date {
    const d = new Date(base);
    if (offset.days !== undefined) d.setDate(d.getDate() + offset.days);
    if (offset.months !== undefined) d.setMonth(d.getMonth() + offset.months);
    return d;
  }

  static format(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  // Matches calendar header — shows just "May" or "June"
  static getMonthName(date: Date): string {
    return date.toLocaleDateString('en-US', { month: 'long' });
    // Output: "May", "June" etc
  }

  // Matches Skyscanner's exact aria-label format:
  static toAriaLabel(date: Date): string {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',  // "Thursday"
      month: 'long',    // "May"
      day: 'numeric',   // "7"
      year: 'numeric',  // "2026"
    });
    // Output: "Thursday, May 7, 2026"
  }

  static addDays(base: Date, days: number): Date {
    const d = new Date(base);
    d.setDate(d.getDate() + days);
    return d;
  }
}
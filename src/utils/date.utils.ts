export const toISO = (date: Date | null | undefined): string | null => 
  date ? date.toISOString() : null;
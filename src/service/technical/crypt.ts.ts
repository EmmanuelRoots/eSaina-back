import { createHash } from 'crypto';

export const hashText = async (text: string): Promise<string> => (
  createHash('sha256').update(Buffer.from(text, 'utf-8')).digest('hex')
);
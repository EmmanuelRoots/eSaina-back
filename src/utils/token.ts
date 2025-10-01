import crypto from 'crypto';
export const genRefresh = (): string => crypto.randomBytes(40).toString('hex');
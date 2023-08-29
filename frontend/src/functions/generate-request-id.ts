export const generateRequestId = (): string => crypto.randomUUID().replaceAll('-', '');

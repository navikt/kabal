import { hasOwn, isObject } from '@app/plugins/crdt/functions';

interface TokenPayload {
  aud: string;
  iss: string;
  iat: number;
  nbf: number;
  exp: number;
  aio: string;
  azp: string;
  azpacr: string;
  groups: string[];
  name: string;
  oid: string;
  preferred_username: string;
  rh: string;
  scp: string;
  sub: string;
  tid: string;
  uti: string;
  ver: string;
  NAVident: string;
  azp_name: string;
}

export const parseTokenPayload = (token: string): TokenPayload | undefined => {
  const payload = token.split('.').at(1);

  if (payload === undefined || payload.length === 0) {
    return undefined;
  }

  const decodedPayload = Buffer.from(payload, 'base64').toString('utf-8');

  const parsed: unknown = JSON.parse(decodedPayload);

  if (!isTokenPayload(parsed)) {
    return undefined;
  }

  return parsed;
};

const isTokenPayload = (payload: unknown): payload is TokenPayload =>
  isObject(payload) &&
  hasOwn(payload, 'aud') &&
  hasOwn(payload, 'iss') &&
  hasOwn(payload, 'iat') &&
  hasOwn(payload, 'nbf') &&
  hasOwn(payload, 'exp');

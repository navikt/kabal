const HEX_CHARS: string[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];

/**
 * Generates a string from random 128 bits as 32 hex characters.
 *
 * Identical result to `crypto.randomUUID().replaceAll('-', '');`, but 10-20% faster.
 * */
export const generateRequestId = (): string => {
  const [v01, v02, v03, v04, v05, v06, v07, v08, v09, v10, v11, v12, v13, v14, v15, v16] = crypto.getRandomValues(
    new Uint8Array(16),
  );

  return `${HEX_CHARS[v01! >> 4]! + HEX_CHARS[v01! & 15]!}${HEX_CHARS[v02! >> 4]! + HEX_CHARS[v02! & 15]!}${
    HEX_CHARS[v03! >> 4]! + HEX_CHARS[v03! & 15]
  }${HEX_CHARS[v04! >> 4]! + HEX_CHARS[v04! & 15]}${HEX_CHARS[v05! >> 4]! + HEX_CHARS[v05! & 15]}${
    HEX_CHARS[v06! >> 4]! + HEX_CHARS[v06! & 15]
  }${HEX_CHARS[v07! >> 4]! + HEX_CHARS[v07! & 15]}${HEX_CHARS[v08! >> 4]! + HEX_CHARS[v08! & 15]}${
    HEX_CHARS[v09! >> 4]! + HEX_CHARS[v09! & 15]
  }${HEX_CHARS[v10! >> 4]! + HEX_CHARS[v10! & 15]}${HEX_CHARS[v11! >> 4]! + HEX_CHARS[v11! & 15]}${
    HEX_CHARS[v12! >> 4]! + HEX_CHARS[v12! & 15]
  }${HEX_CHARS[v13! >> 4]! + HEX_CHARS[v13! & 15]}${HEX_CHARS[v14! >> 4]! + HEX_CHARS[v14! & 15]}${
    HEX_CHARS[v15! >> 4]! + HEX_CHARS[v15! & 15]
  }${HEX_CHARS[v16! >> 4]! + HEX_CHARS[v16! & 15]}`;
};

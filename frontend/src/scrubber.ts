// https://docs.slatejs.org/api/scrubber
import { Scrubber } from 'slate';

const FJERNET = '[FJERNET]';

export const initializeScrubber = () => {
  Scrubber.setScrubber((key, value) => {
    if (key === 'text') {
      return FJERNET;
    }

    if (key === 'result' && typeof value === 'string') {
      return FJERNET;
    }

    if (key === 'content' && typeof value === 'string') {
      return FJERNET;
    }

    return value;
  });
};

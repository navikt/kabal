import { TextApi, type TText } from 'platejs';
import type { PlateEditor } from 'platejs/react';

/** Match any Unicode space separator that is NOT a regular space (U+0020). */
const NON_STANDARD_SPACE = /(?!\x20)\p{Zs}/gu;
const HAS_NON_STANDARD_SPACE = /(?!\x20)\p{Zs}/u;

/** Replace non-standard spaces (NBSP, thin space, etc.) with regular spaces. */
export const normalizeNonStandardSpaces = (editor: PlateEditor): void => {
  const textEntries = editor.api
    .nodes<TText>({
      at: [],
      match: (n): n is TText => TextApi.isText(n) && HAS_NON_STANDARD_SPACE.test(n.text),
      reverse: true,
    })
    .toArray();

  for (const [node, path] of textEntries) {
    const matches = node.text.matchAll(NON_STANDARD_SPACE).toArray().toReversed();

    for (const match of matches) {
      if (match.index === undefined) {
        continue;
      }

      editor.tf.insertText(' ', {
        at: {
          anchor: { path, offset: match.index },
          focus: { path, offset: match.index + match[0].length },
        },
      });
    }
  }
};

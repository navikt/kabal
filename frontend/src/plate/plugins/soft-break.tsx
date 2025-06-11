import { EMPTY_CHAR } from '@app/functions/remove-empty-char-in-text';
import type { NodeComponent } from '@udecode/plate';
import { PlateLeaf, createPlatePlugin } from '@udecode/plate/react';

// const SoftBreak: NodeComponent = ({ children, ...rest }) => <PlateLeaf {...rest} as="br" />;

// export const SoftBreakPlugin = createPlatePlugin({
//   key: 'soft-break',
//   node: { isInline: true, isElement: true, component: SoftBreak },
//   render: {
//     node: SoftBreak,
//   },
//   handlers: {
//     onKeyDown: ({ editor, event, tf }) => {
//       if (event.key === 'Enter' && event.shiftKey) {
//         event.preventDefault();
//         event.stopPropagation();

//         tf.insertNode(
//           {
//             type: 'soft-break',
//             children: [{ text: '' }],
//           },
//           { mode: 'lowest', text: true, select: true },
//         );
//         tf.insertText(' ', { at:  });

//         console.debug('Soft break inserted', editor.children);
//       }
//     },
//   },
// });

const SoftBreak: NodeComponent = (props) => <PlateLeaf {...props} className="text-red-500 before:content-['\A']" />;

export const SoftBreakPlugin = createPlatePlugin({
  key: 'soft-break',
  node: { isLeaf: true },
  render: {
    node: SoftBreak,
  },
  handlers: {
    onKeyDown: ({ editor, event, tf }) => {
      if (event.key === 'Enter' && event.shiftKey) {
        event.preventDefault();
        event.stopPropagation();

        tf.withoutNormalizing(() => {
          if (!editor.selection) {
            console.warn('No selection found when trying to insert soft break');
            return;
          }

          tf.insertNode({
            text: EMPTY_CHAR,
            'soft-break': true,
          });

          tf.insertText('', { marks: false });
          tf.removeMarks();
        });

        console.debug('Soft break inserted', editor.children);
      }
    },
  },
});

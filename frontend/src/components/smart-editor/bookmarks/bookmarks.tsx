import { useBookmarks } from '@app/components/smart-editor/bookmarks/use-bookmarks';
import { hasOwn } from '@app/functions/object';
import { pushEvent } from '@app/observability';
import { BookmarkPlugin } from '@app/plate/plugins/bookmark';
import { BOOKMARK_VARIANT_TO_CLASSNAME } from '@app/plate/toolbar/bookmark-button';
import { type FormattedText, useMyPlateEditorState } from '@app/plate/types';
import { BookmarkFillIcon, XMarkIcon } from '@navikt/aksel-icons';
import { Button, HStack, VStack } from '@navikt/ds-react';
import { NodeApi, type TNode } from 'platejs';

interface Props {
  editorId: string;
}

export const Bookmarks = ({ editorId }: Props) => {
  const bookmarks = useBookmarks();
  const editor = useMyPlateEditorState(editorId);

  if (bookmarks.length === 0) {
    return null;
  }

  const onClick = (node: TNode) => editor.api.toDOMNode(node)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  return (
    <VStack as="ul" position="relative" justify="start" width="100%" paddingInline="space-16" maxWidth="350px">
      {bookmarks.map(({ key, variant, nodes }) => {
        const [node] = nodes;

        if (node === undefined) {
          return null;
        }

        const className = BOOKMARK_VARIANT_TO_CLASSNAME[variant];

        const content = nodes.map((n) => NodeApi.string(n)).join('');

        return (
          <HStack as="li" key={key} wrap={false} className="group/bookmark">
            <Button
              size="xsmall"
              variant="tertiary-neutral"
              onClick={() => onClick(node)}
              icon={<BookmarkFillIcon aria-hidden className={className} />}
              className="grow justify-start overflow-hidden"
            >
              <span className="truncate">{content}</span>
            </Button>
            <Button
              size="xsmall"
              variant="tertiary-neutral"
              onClick={() => {
                pushEvent('remove-bookmark', 'smart-editor');
                editor.tf.unsetNodes<FormattedText>([BookmarkPlugin.key, key], {
                  match: (n) => hasOwn(n, key),
                  mode: 'lowest',
                  at: [],
                  split: true,
                });
              }}
              icon={
                <XMarkIcon
                  aria-hidden
                  className="opacity-0 transition-opacity duration-200 group-focus-within/bookmark:opacity-100 group-hover/bookmark:opacity-100"
                />
              }
            />
          </HStack>
        );
      })}
    </VStack>
  );
};

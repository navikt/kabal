import { XMarkOctagonFillIconColored } from '@app/components/colored-icons/colored-icons';
import { createDragUI } from '@app/components/maltekstseksjoner/drag-and-drop/create-drag-ui';
import { useMaltekstseksjonPath } from '@app/hooks/use-navigate-maltekstseksjoner';
import { useUpdateTextIdListMutation } from '@app/redux-api/maltekstseksjoner/mutations';
import { useGetTextVersionsQuery } from '@app/redux-api/texts/queries';
import { type IGetMaltekstseksjonParams, RichTextTypes } from '@app/types/common-text-types';
import { isApiDataError } from '@app/types/errors';
import type { IMaltekstseksjon } from '@app/types/maltekstseksjoner/responses';
import { CircleBrokenIcon, LinkBrokenIcon, PadlockLockedIcon, PencilWritingIcon } from '@navikt/aksel-icons';
import { Button, HStack, HelpText, Skeleton, Tooltip } from '@navikt/ds-react';
import { useCallback, useContext, useMemo, useRef } from 'react';
import { styled } from 'styled-components';
import { DragAndDropContext } from '../drag-and-drop/drag-context';
import { TextLink } from '../text-link';

interface LoadTextListItemProps {
  textId: string;
  maltekstseksjon: IMaltekstseksjon;
  query: IGetMaltekstseksjonParams;
}

export const LoadTextListItem = ({ textId, maltekstseksjon, query }: LoadTextListItemProps) => {
  const [updateTextIdList, { isLoading: isRemoving }] = useUpdateTextIdListMutation({
    fixedCacheKey: maltekstseksjon.id,
  });
  const { data: versions, isLoading, isError, error } = useGetTextVersionsQuery(textId);
  const { setDraggedTextId, clearDragState } = useContext(DragAndDropContext);
  const dragElementRef = useRef<HTMLAnchorElement>(null);
  const dragElementUI = useRef<HTMLAnchorElement | null>(null);
  const removeDragUI = useRef<() => void>(() => dragElementUI.current?.remove());

  const onDragStart = useCallback(
    (e: React.DragEvent<HTMLLIElement>) => {
      e.dataTransfer.clearData();
      e.dataTransfer.setData('text/plain', textId);

      removeDragUI.current = createDragUI(dragElementRef, e);

      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.dropEffect = 'move';
      setDraggedTextId(textId);
    },
    [setDraggedTextId, textId],
  );

  const text = !isLoading && versions !== undefined ? versions[0] : undefined;

  const onRemove = useCallback(() => {
    updateTextIdList({
      id: maltekstseksjon.id,
      query,
      textIdList: maltekstseksjon.textIdList.filter((id) => id !== textId),
    });
  }, [maltekstseksjon.id, maltekstseksjon.textIdList, query, textId, updateTextIdList]);

  const unlink = useMemo(
    () => (
      <Tooltip content="Fjern tekst fra maltekstseksjon">
        <Button
          size="xsmall"
          variant="danger"
          icon={<LinkBrokenIcon aria-hidden />}
          onClick={onRemove}
          loading={isRemoving}
        />
      </Tooltip>
    ),
    [isRemoving, onRemove],
  );

  const path = useMaltekstseksjonPath({
    maltekstseksjonId: maltekstseksjon.id,
    maltekstseksjonVersionId: maltekstseksjon.versionId,
    textId,
  });

  if (isError) {
    const helpText = isApiDataError(error) ? (
      <HelpText strategy="fixed">
        <HelpTextContainer>{error.data.detail}</HelpTextContainer>
      </HelpText>
    ) : null;

    return (
      <>
        {unlink}
        <HStack align="center" gap="2" marginInline="2 0">
          <XMarkOctagonFillIconColored aria-hidden />
          Feil ved lasting
          {helpText}
        </HStack>
      </>
    );
  }

  if (text === undefined) {
    if (isLoading) {
      return <SkeletonItem />;
    }

    return (
      <>
        {unlink}
        <CircleBrokenIcon aria-hidden />
        Teksten ble ikke funnet
      </>
    );
  }

  const Icon = text.textType === RichTextTypes.MALTEKST ? PadlockLockedIcon : PencilWritingIcon;

  return (
    <>
      {maltekstseksjon.publishedDateTime === null ? unlink : null}
      <TextLink
        ref={dragElementRef}
        to={path}
        modified={text.modified}
        icon={<Icon aria-hidden />}
        publishedDateTime={text.publishedDateTime}
        published={text.published}
        draggable
        onDragStart={onDragStart}
        onDragEnd={() => {
          removeDragUI.current();
          clearDragState();
        }}
      >
        {text.title}
      </TextLink>
    </>
  );
};

const HelpTextContainer = styled.div`
  max-width: 300px;
  white-space: normal;
`;

const SkeletonItem = () => (
  <HStack align="center" gap="2" width="100%">
    <Skeleton width={20} />
    <Skeleton className="grow" />
    <Skeleton width={85} />
    <Skeleton width={150} />
  </HStack>
);

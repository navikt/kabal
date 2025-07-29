import { isoDateTimeToPretty } from '@app/domain/date';
import { useOnClickOutside } from '@app/hooks/use-on-click-outside';
import { pushEvent } from '@app/observability';
import type { INavEmployee } from '@app/types/bruker';
import type { IEditor } from '@app/types/maltekstseksjoner/responses';
import { CalendarIcon, ClockDashedIcon, PencilWritingIcon, UploadIcon } from '@navikt/aksel-icons';
import { BoxNew, Button, HStack, Tag, type TagProps, VStack } from '@navikt/ds-react';
import { useRef, useState } from 'react';

interface PublishedProps {
  publishedDateTime: string;
  publishedByActor: INavEmployee;
}

interface DraftProps {
  publishedDateTime: null;
  publishedByActor: null;
}

interface Props {
  published: boolean;
  modified: string;
  created: string;
  createdByActor: INavEmployee;
  edits: IEditor[];
  isUpdating: boolean;
}

export const TextHistory = ({
  publishedDateTime,
  publishedByActor,
  created,
  createdByActor,
  edits,
}: Props & (PublishedProps | DraftProps)) => {
  const [showEdits, setShowEdits] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, () => setShowEdits(false));

  return (
    <HStack align="center" position="relative" ref={ref} data-qqqqq>
      {showEdits && (
        <VStack asChild position="absolute" right="0" gap="1 0" style={{ top: '100%', zIndex: 1, listStyle: 'none' }}>
          <BoxNew as="ul" background="default" shadow="dialog" borderRadius="medium" padding="2" margin="0">
            {publishedDateTime !== null ? (
              <HStack as="li" align="center" wrap={false} style={{ whiteSpace: 'pre' }}>
                <StyledTag variant="info" size="xsmall">
                  <UploadIcon aria-hidden />
                  Publisert
                </StyledTag>
                <span>
                  {' '}
                  av {publishedByActor.navn} {isoDateTimeToPretty(publishedDateTime)}
                </span>
              </HStack>
            ) : null}
            {edits.map((edit) => (
              <HStack as="li" align="center" key={edit.actor.navIdent} wrap={false} style={{ whiteSpace: 'pre' }}>
                <StyledTag variant="warning" size="xsmall">
                  <PencilWritingIcon aria-hidden />
                  Endret
                </StyledTag>
                <span>
                  {' '}
                  av {edit.actor.navn} {isoDateTimeToPretty(edit.created)}
                </span>
              </HStack>
            ))}
            <HStack as="li" align="center" wrap={false} style={{ whiteSpace: 'pre' }}>
              <StyledTag variant="alt1" size="xsmall">
                <CalendarIcon aria-hidden />
                Opprettet
              </StyledTag>
              <span>
                {' '}
                av {createdByActor.navn} {isoDateTimeToPretty(created)}
              </span>
            </HStack>
          </BoxNew>
        </VStack>
      )}
      <Button
        variant="tertiary"
        size="xsmall"
        onClick={() => {
          const enabled = !showEdits;
          pushEvent('toggle-text-history', 'texts', { enabled: enabled.toString() });
          setShowEdits(enabled);
        }}
        icon={<ClockDashedIcon aria-hidden />}
      >
        {showEdits ? 'Skjul' : 'Vis'} historikk
      </Button>
    </HStack>
  );
};

const StyledTag = (props: TagProps) => (
  <HStack asChild align="center" gap="1">
    <Tag {...props} />
  </HStack>
);

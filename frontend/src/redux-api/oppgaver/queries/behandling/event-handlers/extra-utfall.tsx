import { Tag } from '@navikt/ds-react';
import React from 'react';
import { styled } from 'styled-components';
import { InfoToast } from '@app/components/toast/info-toast';
import { toast } from '@app/components/toast/store';
import { useUtfallNameOrLoading } from '@app/hooks/use-utfall-name';
import { UpdateFn } from '@app/redux-api/oppgaver/queries/behandling/types';
import { ExtraUtfallEvent } from '@app/redux-api/server-sent-events/types';
import { UtfallEnum } from '@app/types/kodeverk';
import { IOppgavebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';

export const handleExtraUtfallEvent =
  (oppgaveId: string, userId: string, updateCachedData: UpdateFn<IOppgavebehandling>) =>
  ({ actor, timestamp, utfallIdList }: ExtraUtfallEvent) => {
    updateCachedData((draft) => {
      if (draft === undefined) {
        return draft;
      }

      if (userId !== actor.navIdent) {
        const oldUtfall = draft.resultat.extraUtfallIdSet ?? [];
        const added = utfallIdList.filter((u) => !oldUtfall.includes(u));
        const removed = oldUtfall.filter((u) => !utfallIdList.includes(u));

        const addedTags = (
          <TagContainer>
            {added.map((u) => (
              <UtfallTag utfall={u} key={u} />
            ))}
          </TagContainer>
        );

        const removedTags = (
          <TagContainer>
            {removed.map((u) => (
              <UtfallTag utfall={u} key={u} />
            ))}
          </TagContainer>
        );

        if (added.length > 0 && removed.length > 0) {
          toast.info(
            <InfoToast title="Ekstra utfall endret">
              {actor.navn} har fjernet ekstra utfall for tilpasset tekst: {removedTags} og lagt til: {addedTags}.
            </InfoToast>,
          );
        } else if (added.length > 0) {
          toast.info(
            <InfoToast title="Ekstra utfall lagt til">
              {actor.navn} har lagt til ekstra utfall for tilpasset tekst: {addedTags}.
            </InfoToast>,
          );
        } else if (removed.length > 0) {
          toast.info(
            <InfoToast title="Ekstra utfall fjernet">
              {actor.navn} har fjernet ekstra utfall for tilpasset tekst: {removedTags}.
            </InfoToast>,
          );
        }
      }

      draft.resultat.extraUtfallIdSet = utfallIdList;
      draft.modified = timestamp;
    });
  };

interface Props {
  utfall: UtfallEnum;
}

const UtfallTag = ({ utfall }: Props) => {
  const name = useUtfallNameOrLoading(utfall);

  return (
    <Tag size="small" variant="alt1">
      {name}
    </Tag>
  );
};

const TagContainer = styled.span`
  display: inline-flex;
  flex-wrap: wrap;
  gap: var(--a-spacing-2);
`;

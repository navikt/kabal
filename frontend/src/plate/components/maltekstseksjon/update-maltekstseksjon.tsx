import { FileTextIcon, XMarkIcon } from '@navikt/aksel-icons';
import { Button, ButtonProps, HelpText } from '@navikt/ds-react';
import React, { useCallback, useEffect, useState } from 'react';
import { styled } from 'styled-components';
import { RichTextPreview } from '@app/components/rich-text-preview/rich-text-preview';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { MaltekstseksjonUpdate } from '@app/plate/components/maltekstseksjon/types';
import { MaltekstElement, RedigerbarMaltekstElement } from '@app/plate/types';
import { RemovePreview } from './remove-preview';

interface Props {
  next: MaltekstseksjonUpdate | null;
  replaceNodes: (
    id: string | null,
    textIdList: string[] | null,
    nodes: (MaltekstElement | RedigerbarMaltekstElement)[] | null,
  ) => void;
}

const BUTTON_SIZE: ButtonProps['size'] = 'xsmall';

export const UpdateMaltekstseksjon = ({ next, replaceNodes }: Props) => {
  const { data: oppgave } = useOppgave();
  const [ignored, setIgnored] = useState(false);

  // Reset ignored when text changes.
  useEffect(() => setIgnored(false), [next?.maltekstseksjon?.id]);

  const replaceMaltekstseksjonContent = useCallback(async () => {
    if (next === null) {
      return replaceNodes(null, null, null);
    }

    const { id, textIdList } = next.maltekstseksjon;

    replaceNodes(id, textIdList, next.children);
  }, [next, replaceNodes]);

  if (oppgave === undefined || ignored) {
    return null;
  }

  return (
    <ButtonContainer
      contentEditable={false}
      onClick={(e) => e.stopPropagation()}
      onSelect={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <Button size={BUTTON_SIZE} icon={<FileTextIcon aria-hidden />} onClick={replaceMaltekstseksjonContent}>
        {next === null ? 'Fjern tekst' : 'Erstatt tekst'}
      </Button>

      <HelpText>
        <HelpTextContainer>
          Legger til nye tekster, fjerner tekster som ikke skal være der. Tekster som fortsatt skal være der, røres
          ikke. Dvs. at innfyllingsfelt og redigerbare tekster ikke blir endret.
        </HelpTextContainer>
      </HelpText>

      {next === null ? (
        <RemovePreview oppgave={oppgave} />
      ) : (
        <RichTextPreview
          content={next.children}
          id={next.maltekstseksjon.id ?? 'no-id'}
          buttonSize={BUTTON_SIZE}
          buttonText="Forhåndsvis"
          buttonVariant="secondary"
        />
      )}

      <Button size={BUTTON_SIZE} icon={<XMarkIcon aria-hidden />} variant="secondary" onClick={() => setIgnored(true)}>
        Behold eksisterende tekst
      </Button>

      <Explainer />
    </ButtonContainer>
  );
};

const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  column-gap: 8px;
  align-items: center;
  border-radius: var(--a-border-radius-medium);
  margin-bottom: 8px;
  padding-top: 24px;
  user-select: none;
`;

const Explainer = () => (
  <HelpText>
    <HelpTextContainer>Sett utfall/resultat for å få bedre forslag til tekst.</HelpTextContainer>
  </HelpText>
);

const HelpTextContainer = styled.div`
  width: 350px;
`;

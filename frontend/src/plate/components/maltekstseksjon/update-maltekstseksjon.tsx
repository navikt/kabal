import { FileTextIcon, XMarkIcon } from '@navikt/aksel-icons';
import { Button, ButtonProps, HelpText } from '@navikt/ds-react';
import { useCallback, useEffect, useState } from 'react';
import { styled } from 'styled-components';
import { RichTextPreview } from '@app/components/rich-text-preview/rich-text-preview';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { MaltekstseksjonUpdate } from '@app/plate/components/maltekstseksjon/types';
import { MaltekstElement, RedigerbarMaltekstElement } from '@app/plate/types';

interface Props {
  next: MaltekstseksjonUpdate | null;
  replaceNodes: (
    id: string | null,
    textIdList: string[] | null,
    nodes: (MaltekstElement | RedigerbarMaltekstElement)[] | null,
  ) => void;
  ignore: () => void;
}

const BUTTON_SIZE: ButtonProps['size'] = 'xsmall';

export const UpdateMaltekstseksjon = ({ next, replaceNodes, ignore }: Props) => {
  const { data: oppgave } = useOppgave();
  const [ignored, setIgnored] = useState(false);

  // Reset ignored when text changes.
  useEffect(() => setIgnored(false), [next?.maltekstseksjon?.id]);

  const replaceMaltekstseksjonContent = useCallback(() => {
    if (next === null) {
      return replaceNodes(null, null, null);
    }

    const { id, textIdList } = next.maltekstseksjon;

    replaceNodes(id, textIdList, next.children);
  }, [next, replaceNodes]);

  if (oppgave === undefined || ignored) {
    return null;
  }

  const willRemove = next === null;

  return (
    <ButtonContainer
      contentEditable={false}
      onClick={(e) => e.stopPropagation()}
      onSelect={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <Button size={BUTTON_SIZE} icon={<FileTextIcon aria-hidden />} onClick={replaceMaltekstseksjonContent}>
        {willRemove ? 'Fjern tekst' : 'Erstatt tekst'}
      </Button>

      <HelpText>
        <HelpTextContainer>{willRemove ? REMOVE_HELP_TEXT : REPLACE_HELP_TEXT}</HelpTextContainer>
      </HelpText>

      {willRemove ? null : (
        <RichTextPreview
          content={next.children}
          id={next.maltekstseksjon.id ?? 'no-id'}
          buttonSize={BUTTON_SIZE}
          buttonText="Forhåndsvis"
          buttonVariant="secondary"
        />
      )}

      <Button size={BUTTON_SIZE} icon={<XMarkIcon aria-hidden />} variant="secondary" onClick={ignore}>
        Behold eksisterende tekst
      </Button>

      <Explainer />
    </ButtonContainer>
  );
};

const REPLACE_HELP_TEXT =
  'Du har gjort en endring i utfall/resultat og/eller hjemmel, som gjør at Kabal foreslår å erstatte teksten her. Trykk «Forhåndsvis» for å se hva Kabal foreslår å erstatte med. Trykk «Erstatt tekst» for å erstatte teksten. Om du ikke ønsker at teksten skal bli erstattet, kan du trykke på «Behold eksisterende tekst».';
const REMOVE_HELP_TEXT =
  'Du har gjort en endring i utfall/resultat og/eller hjemmel, som gjør at Kabal foreslår å fjerne teksten her. Trykk «Fjern tekst» for å fjerne teksten. Om du ikke ønsker at teksten skal bli fjernet, kan du trykke på «Behold eksisterende tekst».';

const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  column-gap: var(--a-spacing-2);
  align-items: center;
  border-radius: var(--a-border-radius-medium);
  margin-bottom: var(--a-spacing-2);
  padding-top: var(--a-spacing-6);
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

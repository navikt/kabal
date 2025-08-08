import { RichTextPreview } from '@app/components/rich-text-preview/rich-text-preview';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import type { MaltekstseksjonUpdate } from '@app/plate/components/maltekstseksjon/types';
import type { MaltekstElement, RedigerbarMaltekstElement } from '@app/plate/types';
import { FileTextIcon, XMarkIcon } from '@navikt/aksel-icons';
import { BoxNew, Button, type ButtonProps, HelpText, HStack } from '@navikt/ds-react';
import { useCallback, useEffect, useState } from 'react';

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

  // biome-ignore lint/correctness/useExhaustiveDependencies: Reset ignored when text changes.
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
    <HStack
      asChild
      gap="0 2"
      align="center"
      contentEditable={false}
      onClick={(e) => e.stopPropagation()}
      onSelect={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <BoxNew borderRadius="medium" marginBlock="0 2" paddingBlock="6 0" width="100%" className="select-none">
        <Button size={BUTTON_SIZE} icon={<FileTextIcon aria-hidden />} onClick={replaceMaltekstseksjonContent}>
          {willRemove ? 'Fjern tekst' : 'Erstatt tekst'}
        </Button>

        <HelpText>
          <div className="w-96">{willRemove ? REMOVE_HELP_TEXT : REPLACE_HELP_TEXT}</div>
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

        <Button size={BUTTON_SIZE} icon={<XMarkIcon aria-hidden />} variant="secondary-neutral" onClick={ignore}>
          Behold eksisterende tekst
        </Button>

        <Explainer />
      </BoxNew>
    </HStack>
  );
};

const REPLACE_HELP_TEXT =
  'Du har gjort en endring i utfall/resultat og/eller hjemmel, som gjør at Kabal foreslår å erstatte teksten her. Trykk «Forhåndsvis» for å se hva Kabal foreslår å erstatte med. Trykk «Erstatt tekst» for å erstatte teksten. Om du ikke ønsker at teksten skal bli erstattet, kan du trykke på «Behold eksisterende tekst».';
const REMOVE_HELP_TEXT =
  'Du har gjort en endring i utfall/resultat og/eller hjemmel, som gjør at Kabal foreslår å fjerne teksten her. Trykk «Fjern tekst» for å fjerne teksten. Om du ikke ønsker at teksten skal bli fjernet, kan du trykke på «Behold eksisterende tekst».';

const Explainer = () => (
  <HelpText>
    <div className="w-96">Sett utfall/resultat for å få bedre forslag til tekst.</div>
  </HelpText>
);

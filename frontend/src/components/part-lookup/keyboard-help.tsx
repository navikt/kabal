import { BodyShort, Box } from '@navikt/ds-react';
import { MOD_KEY_TEXT } from '@/keys';

interface KeyboardHelpProps {
  submitLabel: string;
}

export const KeyboardHelp = ({ submitLabel }: KeyboardHelpProps) => (
  <Box
    background="neutral-soft"
    borderRadius="8"
    paddingBlock="space-8"
    paddingInline="space-16"
    marginInline="auto"
    width="fit"
    className="grid grid-cols-[auto_1fr] items-center gap-x-3 gap-y-1 text-ax-text-subtle"
  >
    <KeyRow shortcut={`${MOD_KEY_TEXT} + Enter`} description={submitLabel} />
    <KeyRow shortcut="Esc" description="Lukk" />
  </Box>
);

interface KeyRowProps {
  shortcut: string;
  description: string;
}

const KeyRow = ({ shortcut, description }: KeyRowProps) => (
  <>
    <kbd className="inline-block rounded-sm bg-ax-bg-neutral-moderate px-1.5 py-0.5 text-center font-mono text-small">
      {shortcut}
    </kbd>
    <BodyShort size="small" className="py-0.5">
      {description}
    </BodyShort>
  </>
);

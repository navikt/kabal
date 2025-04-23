import { openKeyboardHelpModal } from '@app/components/documents/journalfoerte-documents/keyboard/state/help-modal';
import { useHasSeenKeyboardShortcuts } from '@app/hooks/settings/use-setting';
import { Button, Tooltip } from '@navikt/ds-react';
import { Keyboard } from '@styled-icons/fluentui-system-regular/Keyboard';

const PING_ANIMATION_CLASSES =
  'relative after:absolute after:top-1.5 after:left-0 after:right-0 after:bottom-1 after:animate-ping motion-reduce:after:animate-ping after:rounded-medium after:border-2 after:border-border-action';
const WIGGLE_ANIMATION_CLASSES = 'animate-wiggle motion-reduce:animate-wiggle';
const BOUCE_ANIMATION_CLASSES = 'animate-bounce motion-reduce:animate-bounce';
const ANIMATIONS = [PING_ANIMATION_CLASSES, WIGGLE_ANIMATION_CLASSES, BOUCE_ANIMATION_CLASSES];
const ANIMATIONS_COUNT = ANIMATIONS.length;

const randomAnimationIndex = Math.floor(Math.random() * ANIMATIONS_COUNT);
const getRandomAnimation = () => ANIMATIONS[randomAnimationIndex];

const TITLE = 'Vis hjelp for tastaturstyring';

export const KeyboardHelpButton = () => {
  const { value: hasSeenKeyboardShortcuts } = useHasSeenKeyboardShortcuts();

  return (
    <Tooltip content={TITLE} placement="top">
      <Button
        variant="tertiary"
        size="small"
        className="mr-auto"
        aria-label={TITLE}
        icon={
          <span className={hasSeenKeyboardShortcuts ? undefined : getRandomAnimation()}>
            <Keyboard size={22} aria-hidden />
          </span>
        }
        onClick={openKeyboardHelpModal}
      />
    </Tooltip>
  );
};

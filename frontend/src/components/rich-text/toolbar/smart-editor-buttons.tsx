import { DialogDots, Information, Law } from '@navikt/ds-icons';
import React, { useContext } from 'react';
import { Range } from 'slate';
import { SmartEditorContext } from '../../smart-editor/context/smart-editor-context';
import { Placeholder } from './placeholder';
import { ToolbarIconButton } from './toolbarbutton';

const ICON_SIZE = 24;

export interface SmartEditorButtonsProps {
  showCommentsButton?: boolean;
  showAnnotationsButton?: boolean;
  showGodeFormuleringerButton?: boolean;
  showPlaceholderButton?: boolean;
}

export const SmartEditorButtons = ({
  showCommentsButton = false,
  showAnnotationsButton = false,
  showGodeFormuleringerButton = false,
  showPlaceholderButton = false,
}: SmartEditorButtonsProps) => {
  if (!showCommentsButton && !showAnnotationsButton && !showGodeFormuleringerButton && !showPlaceholderButton) {
    return null;
  }

  return (
    <>
      <CommentsButton show={showCommentsButton} />
      <Placeholder show={showPlaceholderButton} />
      <AnnotationsButton show={showAnnotationsButton} />
      <GodeFormuleringerButton show={showGodeFormuleringerButton} />
    </>
  );
};

interface Props {
  show: boolean;
}

const CommentsButton = ({ show }: Props) => {
  const { selection, setShowNewComment, showNewComment } = useContext(SmartEditorContext);

  if (!show) {
    return null;
  }

  const addCommentEnabled = Range.isRange(selection) && Range.isExpanded(selection);

  return (
    <ToolbarIconButton
      label="Legg til kommentar (Ctrl/⌘ + K)"
      icon={<DialogDots width={ICON_SIZE} />}
      active={showNewComment}
      onClick={() => setShowNewComment(true)}
      disabled={!addCommentEnabled}
    />
  );
};

const AnnotationsButton = ({ show }: Props) => {
  const { showMaltekstTags, setShowMaltekstTags } = useContext(SmartEditorContext);

  if (!show) {
    return null;
  }

  const prefix = showMaltekstTags ? 'Skjul' : 'Vis';

  return (
    <ToolbarIconButton
      label={`${prefix} tilknytning til hjemler/ytelse/utfall/enhet (Ctrl/⌘ + D)`}
      icon={<Information width={ICON_SIZE} />}
      active={showMaltekstTags}
      onClick={() => setShowMaltekstTags(!showMaltekstTags)}
    />
  );
};

const GodeFormuleringerButton = ({ show }: Props) => {
  const { showGodeFormuleringer, setShowGodeFormuleringer } = useContext(SmartEditorContext);

  if (!show) {
    return null;
  }

  const prefix = showGodeFormuleringer ? 'Skjul' : 'Vis';

  return (
    <ToolbarIconButton
      label={`${prefix} gode formuleringer (Ctrl/⌘ + Shift + F)`}
      icon={<Law width={ICON_SIZE} />}
      active={showGodeFormuleringer}
      onClick={() => setShowGodeFormuleringer(!showGodeFormuleringer)}
    />
  );
};

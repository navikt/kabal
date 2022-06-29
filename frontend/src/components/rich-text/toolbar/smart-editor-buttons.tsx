import { DialogDots, Information, Law } from '@navikt/ds-icons';
import React, { useContext } from 'react';
import { Range } from 'slate';
import { SmartEditorContext } from '../../smart-editor/context/smart-editor-context';
import { ToolbarSeparator } from './separator';
import { ToolbarIconButton } from './toolbarbutton';

const ICON_SIZE = 24;

export interface SmartEditorButtonsProps {
  showCommentsButton?: boolean;
  showAnnotationsButton?: boolean;
  showGodeFormuleringerButton?: boolean;
}

export const SmartEditorButtons = ({
  showCommentsButton = false,
  showAnnotationsButton = false,
  showGodeFormuleringerButton = false,
}: SmartEditorButtonsProps) => {
  // const malteksterEnabled = useFeatureToggle(FeatureToggles.MALTEKSTER);
  //
  // const showGodeFormuleringer = malteksterEnabled && showGodeFormuleringerButton;
  // const showAnnotations = malteksterEnabled && showAnnotationsButton;
  //
  if (!showCommentsButton && !showAnnotationsButton && !showGodeFormuleringerButton) {
    return null;
  }

  return (
    <>
      <CommentsButton show={showCommentsButton} />
      <AnnotationsButton show={showAnnotationsButton} />
      <GodeFormuleringerButton show={showGodeFormuleringerButton} />

      <ToolbarSeparator />
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

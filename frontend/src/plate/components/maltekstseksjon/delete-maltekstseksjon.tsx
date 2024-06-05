import { Path } from 'slate';
import { useSmartEditorLanguage } from '@app/hooks/use-smart-editor-language';
import { DeleteSection } from '@app/plate/components/common/delete-section';
import { useIsChanged } from '@app/plate/components/maltekstseksjon/use-is-changed';
import { MaltekstseksjonElement } from '@app/plate/types';

interface Props {
  element: MaltekstseksjonElement;
  path: Path | undefined;
}

export const DeleteMaltekstseksjon = ({ element, path }: Props) => {
  const language = useSmartEditorLanguage();
  const [changedIsLoading, isChanged] = useIsChanged(element, language);

  return (
    <DeleteSection
      isLoading={changedIsLoading}
      isChanged={isChanged}
      path={path}
      errorTooltip="Teknisk feil. Kan ikke slette maltekstseksjon."
      defaultTooltip="Slett hele maltekstseksjonen (markert med blå marg)."
      isChangedWarning="Maltekstseksjonen er endret. Er du sikker på at du vil slette den?"
    />
  );
};

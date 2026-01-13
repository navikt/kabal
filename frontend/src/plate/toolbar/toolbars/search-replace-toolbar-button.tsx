import { SmartEditorContext } from '@app/components/smart-editor/context';
import { MOD_KEY_TEXT } from '@app/keys';
import { pushEvent } from '@app/observability';
import { ToolbarIconButton } from '@app/plate/toolbar/toolbarbutton';
import { SearchReplaceDialog } from '@app/plate/toolbar/toolbars/search-replace-dialog';
import { MagnifyingGlassIcon } from '@navikt/aksel-icons';
import { useContext } from 'react';

export const SearchReplaceToolbarButton = () => {
  const { showSearchReplace, setShowSearchReplace } = useContext(SmartEditorContext);

  return (
    <div className="relative">
      <ToolbarIconButton
        label="Søk og erstatt"
        keys={[MOD_KEY_TEXT, 'F']}
        icon={<MagnifyingGlassIcon aria-hidden />}
        active={showSearchReplace}
        onClick={() => {
          pushEvent('open-search-replace', 'smart-editor', { enabled: showSearchReplace.toString() });
          setShowSearchReplace(!showSearchReplace);
        }}
      />

      {showSearchReplace ? <SearchReplaceDialog /> : null}
    </div>
  );
};

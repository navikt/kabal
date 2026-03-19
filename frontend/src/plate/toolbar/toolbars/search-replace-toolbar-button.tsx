import { MagnifyingGlassIcon } from '@navikt/aksel-icons';
import { useContext } from 'react';
import { SmartEditorContext } from '@/components/smart-editor/context';
import { MOD_KEY_TEXT } from '@/keys';
import { pushEvent } from '@/observability';
import { ToolbarIconButton } from '@/plate/toolbar/toolbarbutton';
import { SearchReplaceDialog } from '@/plate/toolbar/toolbars/search-replace-dialog';

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

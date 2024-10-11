import { UseAsAttachments } from '@app/components/documents/journalfoerte-documents/heading/use-as-attachments';
import { ViewCombinedPDF } from '@app/components/documents/journalfoerte-documents/heading/view-combined-pdf-button';
import { SelectContext } from '@app/components/documents/journalfoerte-documents/select-context/select-context';
import {
  ARCHIVED_DOCUMENTS_COLUMN_OPTIONS,
  ARCHIVED_DOCUMENTS_COLUMN_OPTIONS_LABELS,
  type ArchivedDocumentsColumn,
  useArchivedDocumentsColumns,
} from '@app/hooks/settings/use-archived-documents-setting';
import { pushEvent } from '@app/observability';
import { MenuHamburgerIcon } from '@navikt/aksel-icons';
import { Button, Checkbox, CheckboxGroup, Dropdown } from '@navikt/ds-react';
import { useContext } from 'react';
import { styled } from 'styled-components';
import { useIsExpanded } from '../../use-is-expanded';

export const Menu = () => {
  const [isExpanded] = useIsExpanded();
  const { selectedCount } = useContext(SelectContext);

  if (selectedCount === 0 && !isExpanded) {
    return null;
  }

  return (
    <Dropdown>
      <Button
        as={Dropdown.Toggle}
        icon={<MenuHamburgerIcon aria-hidden />}
        size="xsmall"
        title="Verktøy for visning"
        variant="tertiary-neutral"
      />

      <StyledDropdownMenu>
        <SelectedMenu />

        {isExpanded ? <ColumnOptions /> : null}
      </StyledDropdownMenu>
    </Dropdown>
  );
};

const SelectedMenu = () => {
  const { selectedCount } = useContext(SelectContext);

  if (selectedCount === 0) {
    return null;
  }

  return (
    <>
      <Dropdown.Menu.GroupedList>
        <Dropdown.Menu.GroupedList.Heading>Verktøy for dokumenter</Dropdown.Menu.GroupedList.Heading>
        {selectedCount > 1 ? (
          <Dropdown.Menu.GroupedList.Item as={ViewCombinedPDF}>1</Dropdown.Menu.GroupedList.Item>
        ) : null}

        <Dropdown.Menu.GroupedList.Item as={UseAsAttachments}>2</Dropdown.Menu.GroupedList.Item>
      </Dropdown.Menu.GroupedList>
      <Dropdown.Menu.Divider />
    </>
  );
};

const ColumnOptions = () => {
  const { value, setValue } = useArchivedDocumentsColumns();

  return (
    <CheckboxGroup size="small" legend="Kolonner" value={value} onChange={setValue}>
      {ARCHIVED_DOCUMENTS_COLUMN_OPTIONS.map((option) => (
        <Checkbox
          key={option}
          value={option}
          onChange={({ target }) => {
            logColumnEvent(option, target.checked);
          }}
        >
          {ARCHIVED_DOCUMENTS_COLUMN_OPTIONS_LABELS[option]}
        </Checkbox>
      ))}
    </CheckboxGroup>
  );
};

const StyledDropdownMenu = styled(Dropdown.Menu)`
  width: 350px;
`;

const logColumnEvent = (column: ArchivedDocumentsColumn, checked: boolean) =>
  pushEvent(`toggle-col-archived-docs-${column.toLowerCase()}`, 'documents', { checked: checked.toString() });

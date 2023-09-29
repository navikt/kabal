import { MenuHamburgerIcon } from '@navikt/aksel-icons';
import { Button, Checkbox, CheckboxGroup, Dropdown } from '@navikt/ds-react';
import React, { useContext } from 'react';
import { styled } from 'styled-components';
import { UseAsAttachments } from '@app/components/documents/journalfoerte-documents/heading/use-as-attachments';
import { ViewCombinedPDF } from '@app/components/documents/journalfoerte-documents/heading/view-combined-pdf-button';
import { SelectContext } from '@app/components/documents/journalfoerte-documents/select-context/select-context';
import {
  ARCHIVED_DOCUMENTS_COLUMN_OPTIONS,
  ARCHIVED_DOCUMENTS_COLUMN_OPTIONS_LABELS,
  useArchivedDocumentsColumns,
} from '@app/hooks/settings/use-archived-documents-setting';

export const Menu = () => (
  <Dropdown>
    <Button
      as={Dropdown.Toggle}
      icon={<MenuHamburgerIcon aria-hidden />}
      size="small"
      title="Verktøy for visning"
      variant="tertiary-neutral"
    />

    <StyledDropdownMenu>
      <SelectedMenu />

      <ColumnOptions />
    </StyledDropdownMenu>
  </Dropdown>
);

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
  const { value, setValue, isLoading } = useArchivedDocumentsColumns();

  return (
    <CheckboxGroup size="small" legend="Kolonner" disabled={isLoading} value={value} onChange={setValue}>
      {ARCHIVED_DOCUMENTS_COLUMN_OPTIONS.map((option) => (
        <Checkbox key={option} value={option}>
          {ARCHIVED_DOCUMENTS_COLUMN_OPTIONS_LABELS[option]}
        </Checkbox>
      ))}
    </CheckboxGroup>
  );
};

const StyledDropdownMenu = styled(Dropdown.Menu)`
  width: auto;
`;

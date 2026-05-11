import {
  DocPencilIcon,
  ExternalLinkIcon,
  FileIcon,
  FilePdfIcon,
  FilesIcon,
  MenuHamburgerIcon,
} from '@navikt/aksel-icons';
import { ActionMenu, Button, Tooltip } from '@navikt/ds-react';
import { useContext } from 'react';
import {
  useAttachVedleggFn,
  useOptions,
} from '@/components/documents/journalfoerte-documents/heading/use-as-attachments';
import { useViewCombinedPDF } from '@/components/documents/journalfoerte-documents/heading/view-combined-pdf-button';
import { SelectContext } from '@/components/documents/journalfoerte-documents/select-context/select-context';
import { useIsExpanded } from '@/components/documents/use-is-expanded';
import {
  ARCHIVED_DOCUMENTS_COLUMN_OPTIONS,
  ARCHIVED_DOCUMENTS_COLUMN_OPTIONS_LABELS,
  type ArchivedDocumentsColumn,
  useArchivedDocumentsColumns,
} from '@/hooks/settings/use-archived-documents-setting';
import { isMetaKey, MOD_KEY_TEXT } from '@/keys';
import { pushEvent } from '@/observability';
import { DocumentTypeEnum } from '@/types/documents/documents';

export const Menu = () => {
  const [isExpanded] = useIsExpanded();
  const { selectedDocuments } = useContext(SelectContext);

  if (selectedDocuments.size === 0 && !isExpanded) {
    return null;
  }

  return (
    <ActionMenu>
      <ActionMenu.Trigger>
        <Button
          data-color="neutral"
          icon={<MenuHamburgerIcon aria-hidden />}
          size="xsmall"
          title="Verktøy for visning"
          variant="tertiary"
        />
      </ActionMenu.Trigger>

      <ActionMenu.Content className="w-96">
        <SelectedMenu />

        {isExpanded ? <ColumnOptions /> : null}
      </ActionMenu.Content>
    </ActionMenu>
  );
};

const SelectedMenu = () => {
  const { selectedDocuments, getSelectedDocuments } = useContext(SelectContext);
  const {
    onSelect: onViewCombinedPDF,
    onSelectNewTab: onViewCombinedPDFNewTab,
    isLoading: combinedPdfLoading,
  } = useViewCombinedPDF();
  const selectedDocumentsList = getSelectedDocuments();
  const attachmentOptions = useOptions(selectedDocumentsList);
  const attachFn = useAttachVedleggFn();

  if (selectedDocuments.size === 0) {
    return null;
  }

  const count = selectedDocuments.size;

  return (
    <>
      <ActionMenu.Group label={`Verktøy for ${count === 1 ? 'valgt dokument' : `${count} valgte dokumenter`}`}>
        {count > 1 ? (
          <>
            <Tooltip
              content={`Trykk med musehjulet / midterste knapp eller ${MOD_KEY_TEXT} + klikk for å åpne i ny fane.`}
            >
              <ActionMenu.Item
                icon={<FileIcon aria-hidden />}
                onClick={(e: React.MouseEvent) => {
                  if (isMetaKey(e)) {
                    onViewCombinedPDFNewTab();
                  } else {
                    onViewCombinedPDF();
                  }
                }}
                onAuxClick={onViewCombinedPDFNewTab}
                disabled={combinedPdfLoading}
              >
                Vis {count} valgte dokumenter kombinert
              </ActionMenu.Item>
            </Tooltip>

            <ActionMenu.Item
              icon={<ExternalLinkIcon aria-hidden />}
              onSelect={onViewCombinedPDFNewTab}
              disabled={combinedPdfLoading}
            >
              Vis {count} valgte dokumenter kombinert i ny fane
            </ActionMenu.Item>
          </>
        ) : null}

        {attachFn !== null ? (
          <ActionMenu.Sub>
            <ActionMenu.SubTrigger icon={<FilesIcon aria-hidden />}>
              Bruk {count === 1 ? 'valgt dokument' : `${count} valgte dokumenter`} som vedlegg for ...
            </ActionMenu.SubTrigger>

            <ActionMenu.SubContent>
              <ActionMenu.Group label="Dokumenter under arbeid">
                {attachmentOptions.map(({ id, tittel, type }) => (
                  <ActionMenu.Item
                    key={id}
                    onSelect={() => attachFn(id, ...selectedDocumentsList)}
                    icon={getDocumentIcon(type)}
                  >
                    {tittel}
                  </ActionMenu.Item>
                ))}
              </ActionMenu.Group>
            </ActionMenu.SubContent>
          </ActionMenu.Sub>
        ) : null}
      </ActionMenu.Group>

      <ActionMenu.Divider />
    </>
  );
};

const ColumnOptions = () => {
  const { value, setValue } = useArchivedDocumentsColumns();

  return (
    <ActionMenu.Group label="Kolonner">
      {ARCHIVED_DOCUMENTS_COLUMN_OPTIONS.map((option) => {
        const checked = value.includes(option);

        return (
          <ActionMenu.CheckboxItem
            key={option}
            checked={checked}
            onCheckedChange={() => {
              setValue((prev = value) => {
                const prevChecked = prev.includes(option);
                const nextChecked = !prevChecked;
                logColumnEvent(option, nextChecked);
                return prevChecked ? prev.filter((v) => v !== option) : [...prev, option];
              });
            }}
          >
            {ARCHIVED_DOCUMENTS_COLUMN_OPTIONS_LABELS[option]}
          </ActionMenu.CheckboxItem>
        );
      })}
    </ActionMenu.Group>
  );
};

const logColumnEvent = (column: ArchivedDocumentsColumn, checked: boolean) =>
  pushEvent(`toggle-col-archived-docs-${column.toLowerCase()}`, 'documents', { checked: checked.toString() });

const getDocumentIcon = (type: DocumentTypeEnum) => {
  switch (type) {
    case DocumentTypeEnum.SMART:
      return <DocPencilIcon aria-hidden />;
    case DocumentTypeEnum.UPLOADED:
      return <FilePdfIcon aria-hidden />;
    case DocumentTypeEnum.JOURNALFOERT:
      return <FilesIcon aria-hidden />;
    case DocumentTypeEnum.VEDLEGGSOVERSIKT:
      return <FilesIcon aria-hidden />;
  }
};

import {
  ExternalLinkIcon,
  FilePlusIcon,
  FileTextIcon,
  PasswordHiddenIcon,
  XMarkIcon,
  ZoomMinusIcon,
  ZoomPlusIcon,
} from '@navikt/aksel-icons';
import {
  Alert,
  Box,
  Button,
  type ButtonProps,
  HStack,
  Loader,
  Tag,
  ToggleGroup,
  Tooltip,
  VStack,
} from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useCallback, useContext, useMemo, useState } from 'react';
import { FeilTag, PolTag } from '@/components/documents/document-warnings';
import { TabContext } from '@/components/documents/tab-context';
import { getActiveFormat, getSelectableFormats } from '@/components/documents/variants';
import { Pdf, usePdfData } from '@/components/pdf/pdf';
import { toast } from '@/components/toast/store';
import { Header } from '@/components/view-pdf/header';
import { ReloadButton } from '@/components/view-pdf/reload-button';
import { useMarkVisited } from '@/components/view-pdf/use-mark-visited';
import { useMergedDocument } from '@/components/view-pdf/use-merged-document';
import { useShownDocumentMetadata } from '@/components/view-pdf/use-shown-document-metadata';
import { useOppgaveId } from '@/hooks/oppgavebehandling/use-oppgave-id';
import { useDocumentsPdfWidth, useFilesViewed } from '@/hooks/settings/use-setting';
import { useShownDocuments } from '@/hooks/use-shown-documents';
import { Skjerming, VariantFormat } from '@/types/arkiverte-documents';
import { DocumentTypeEnum } from '@/types/documents/documents';

const DEFAULT_PDF_WIDTH = 800;
const MIN_PDF_WIDTH = 400;
const ZOOM_STEP = 150;
const MAX_PDF_WIDTH = MIN_PDF_WIDTH + ZOOM_STEP * 10;

export const ViewPDF = () => {
  const { getTabRef, setTabRef } = useContext(TabContext);
  const { value: pdfWidth = DEFAULT_PDF_WIDTH, setValue: setPdfWidth } = useDocumentsPdfWidth();
  const { remove: close } = useFilesViewed();
  const { showDocumentList, title, isLoading } = useShownDocuments();
  const increase = () => setPdfWidth(Math.min(pdfWidth + ZOOM_STEP, MAX_PDF_WIDTH));
  const decrease = () => setPdfWidth(Math.max(pdfWidth - ZOOM_STEP, MIN_PDF_WIDTH));
  const oppgaveId = useOppgaveId();
  const showsArchivedDocument = showDocumentList.some((doc) => doc.type === DocumentTypeEnum.JOURNALFOERT);
  const selectableFormats = useMemo(
    () =>
      getSelectableFormats(
        showDocumentList.flatMap((doc) => (doc.type === DocumentTypeEnum.JOURNALFOERT ? doc.varianter : [])),
      ),
    [showDocumentList],
  );
  const [selectedFormat, setSelectedFormat] = useState<VariantFormat>(VariantFormat.SLADDET);

  const { mergedDocument, mergedDocumentIsError, mergedDocumentIsLoading } = useMergedDocument(showDocumentList);
  const { inlineUrl, tabUrl, tabId } = useShownDocumentMetadata(oppgaveId, mergedDocument, showDocumentList);
  const format = getActiveFormat(selectableFormats, selectedFormat) ?? VariantFormat.ARKIV;
  const formatQuery = useMemo(() => ({ format }), [format]);
  const { loading, data, refresh, error } = usePdfData(inlineUrl, formatQuery);

  useMarkVisited(tabUrl);

  const onNewTabClick: React.MouseEventHandler<HTMLButtonElement> = useCallback(
    (e) => {
      if (e.button !== 1 && e.button !== 0) {
        return;
      }

      e.preventDefault();

      if (tabId === undefined) {
        return;
      }

      const tabRef = getTabRef(tabId);

      // There is a reference to the tab and it is open.
      if (tabRef !== undefined && !tabRef.closed) {
        tabRef.focus();

        return;
      }

      const ref = window.open(tabUrl, tabId);

      if (ref === null) {
        toast.error('Kunne ikke åpne dokumentet i ny fane');

        return;
      }
      setTabRef(tabId, ref);
    },
    [getTabRef, setTabRef, tabId, tabUrl],
  );

  if (showDocumentList.length === 0 || oppgaveId === skipToken) {
    return null;
  }

  if (mergedDocumentIsError || inlineUrl === undefined) {
    return (
      <Container minWidth={pdfWidth}>
        <Alert variant="error" size="small">
          Kunne ikke vise dokument(er)
        </Alert>
      </Container>
    );
  }

  if (mergedDocumentIsLoading || isLoading) {
    return (
      <Container minWidth={pdfWidth}>
        <Loader title="Laster dokument" size="3xlarge" />
      </Container>
    );
  }

  const showsPol = showDocumentList.some(
    (d) =>
      d.type === DocumentTypeEnum.JOURNALFOERT &&
      d.varianter.some((v) => v.hasAccess && v.format === format && v.skjerming === Skjerming.POL),
  );

  const showsFeil = showDocumentList.some(
    (d) =>
      d.type === DocumentTypeEnum.JOURNALFOERT &&
      d.varianter.some((v) => v.hasAccess && v.format === format && v.skjerming === Skjerming.FEIL),
  );

  return (
    <Container minWidth={pdfWidth}>
      <Header>
        <Button onClick={close} title="Lukk forhåndsvisning" icon={<XMarkIcon aria-hidden />} {...BUTTON_PROPS} />
        <Button onClick={decrease} title="Smalere PDF" icon={<ZoomMinusIcon aria-hidden />} {...BUTTON_PROPS} />
        <Button onClick={increase} title="Bredere PDF" icon={<ZoomPlusIcon aria-hidden />} {...BUTTON_PROPS} />
        <ReloadButton isLoading={loading} onClick={refresh} />
        <Variant
          showsArchivedDocument={showsArchivedDocument}
          showsPol={showsPol}
          showsFeil={showsFeil}
          format={format}
          selectableFormats={selectableFormats}
          setSelectedFormat={setSelectedFormat}
        />
        <h1 className="m-0 truncate border-ax-border-neutral border-l py-1 pl-1 font-ax-bold text-base">
          {title ?? mergedDocument?.title ?? 'Ukjent dokument'}
        </h1>
        <Button
          as="a"
          href={showsArchivedDocument && selectableFormats.length > 1 ? `${tabUrl}?format=${format}` : tabUrl}
          target={tabId}
          title="Åpne i ny fane"
          icon={<ExternalLinkIcon aria-hidden />}
          onClick={onNewTabClick}
          onAuxClick={onNewTabClick}
          {...BUTTON_PROPS}
        />
      </Header>
      <Pdf data={data} loading={loading} error={error} refresh={refresh} />
    </Container>
  );
};

interface VariantSelectorProps {
  showsArchivedDocument: boolean;
  format: VariantFormat;
  selectableFormats: VariantFormat[];
  setSelectedFormat: (format: VariantFormat) => void;
}

interface VariantProps extends VariantSelectorProps {
  showsPol: boolean;
  showsFeil: boolean;
}

const Variant = ({ showsPol, showsFeil, ...props }: VariantProps) => {
  return (
    <HStack gap="space-4" wrap={false}>
      <VariantSelector {...props} />

      {showsPol ? <PolTag /> : null}
      {showsFeil ? <FeilTag /> : null}
    </HStack>
  );
};

const VARIANT_ITEMS: Record<VariantFormat, { label: string; icon: React.ReactNode }> = {
  [VariantFormat.SLADDET]: { label: 'Sladdet', icon: <PasswordHiddenIcon aria-hidden className="text-xl" /> },
  [VariantFormat.ARKIV]: { label: 'Usladdet', icon: <FileTextIcon aria-hidden className="text-xl" /> },
  [VariantFormat.FULLVERSJON]: { label: 'Fullversjon', icon: <FilePlusIcon aria-hidden className="text-xl" /> },
};

const VariantSelector = ({
  showsArchivedDocument,
  format,
  selectableFormats,
  setSelectedFormat,
}: VariantSelectorProps) => {
  if (!showsArchivedDocument) {
    return null;
  }

  if (selectableFormats.length < 2) {
    return <VariantTag format={format} />;
  }

  const onChange = (value: string) => {
    const selected = selectableFormats.find((f) => f === value);

    if (selected !== undefined) {
      setSelectedFormat(selected);
    }
  };

  return (
    <div className={LEFT_DIVIDER_CLASSES}>
      <ToggleGroup size="small" data-color="neutral" value={format} onChange={onChange} aria-label="Velg variant">
        {selectableFormats.map((f) => (
          <ToggleGroup.Item
            key={f}
            value={f}
            icon={VARIANT_ITEMS[f].icon}
            label={VARIANT_ITEMS[f].label}
            className="min-h-6 px-1.5 py-0.5"
          />
        ))}
      </ToggleGroup>
    </div>
  );
};

interface VariantTagProps {
  format: VariantFormat;
}

/** Non-interactive tag shown when the user cannot choose between variants. */
const VariantTag = ({ format }: VariantTagProps): React.ReactElement | null => {
  switch (format) {
    case VariantFormat.SLADDET:
      return (
        <Tooltip content="Du har ikke tilgang til å se usladdet versjon" placement="top">
          <div className={LEFT_DIVIDER_CLASSES}>
            <Tag data-color="meta-purple" variant="strong" size="small">
              Sladdet
            </Tag>
          </div>
        </Tooltip>
      );
    case VariantFormat.FULLVERSJON:
      return (
        <div className={LEFT_DIVIDER_CLASSES}>
          <Tag data-color="info" variant="strong" size="small">
            Fullversjon
          </Tag>
        </div>
      );
    case VariantFormat.ARKIV:
      return null;
  }
};

const LEFT_DIVIDER_CLASSES = 'border-ax-border-neutral border-l pl-1';

const BUTTON_PROPS: ButtonProps = {
  size: 'xsmall',
  variant: 'tertiary-neutral',
};

interface ContainerProps {
  minWidth: number;
  children: React.ReactNode | React.ReactNode[];
}

const Container = ({ minWidth, children }: ContainerProps) => (
  <VStack asChild minWidth={`${minWidth}px`} className="snap-start" align="center" justify="center">
    <Box as="section" background="default" shadow="dialog" borderRadius="4" position="relative" aria-label="PDF-viser">
      {children}
    </Box>
  </VStack>
);

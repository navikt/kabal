import { FeilTag, PolTag } from '@app/components/documents/document-warnings';
import { TabContext } from '@app/components/documents/tab-context';
import { Pdf, usePdfData } from '@app/components/pdf/pdf';
import { toast } from '@app/components/toast/store';
import { Header } from '@app/components/view-pdf/header';
import { ReloadButton } from '@app/components/view-pdf/reload-button';
import { useMarkVisited } from '@app/components/view-pdf/use-mark-visited';
import { useShownDocumentMetadata } from '@app/components/view-pdf/use-shown-document-metadata';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useDocumentsPdfViewed, useDocumentsPdfWidth } from '@app/hooks/settings/use-setting';
import { useShownDocuments } from '@app/hooks/use-shown-documents';
import { Skjerming, VariantFormat } from '@app/types/arkiverte-documents';
import { DocumentTypeEnum } from '@app/types/documents/documents';
import { ExternalLinkIcon, XMarkIcon, ZoomMinusIcon, ZoomPlusIcon } from '@navikt/aksel-icons';
import {
  Alert,
  BoxNew,
  Button,
  type ButtonProps,
  HStack,
  Loader,
  Switch,
  Tag,
  Tooltip,
  VStack,
} from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useMergedDocument } from './use-merged-document';

const DEFAULT_PDF_WIDTH = 800;
const MIN_PDF_WIDTH = 400;
const ZOOM_STEP = 150;
const MAX_PDF_WIDTH = MIN_PDF_WIDTH + ZOOM_STEP * 10;

export const ViewPDF = () => {
  const { getTabRef, setTabRef } = useContext(TabContext);
  const { value: pdfWidth = DEFAULT_PDF_WIDTH, setValue: setPdfWidth } = useDocumentsPdfWidth();
  const { remove: close } = useDocumentsPdfViewed();
  const { showDocumentList, title } = useShownDocuments();
  const increase = () => setPdfWidth(Math.min(pdfWidth + ZOOM_STEP, MAX_PDF_WIDTH));
  const decrease = () => setPdfWidth(Math.max(pdfWidth - ZOOM_STEP, MIN_PDF_WIDTH));
  const oppgaveId = useOppgaveId();
  const showsArchivedDocument = showDocumentList.some((doc) => doc.type === DocumentTypeEnum.JOURNALFOERT);
  const hasRedactedDocuments = showDocumentList.some(
    (doc) =>
      doc.type === DocumentTypeEnum.JOURNALFOERT &&
      doc.varianter.some(({ format }) => format === VariantFormat.SLADDET),
  );
  const hasAccessToArchivedDocuments = showDocumentList.some(
    (doc) =>
      doc.type === DocumentTypeEnum.JOURNALFOERT &&
      doc.varianter.some(({ hasAccess, format }) => hasAccess && format === VariantFormat.ARKIV),
  );
  const [showRedacted, setShowRedacted] = useState(hasRedactedDocuments);
  useEffect(() => {
    setShowRedacted(hasRedactedDocuments);
  }, [hasRedactedDocuments]);
  const { mergedDocument, mergedDocumentIsError, mergedDocumentIsLoading } = useMergedDocument(showDocumentList);
  const { inlineUrl, tabUrl, tabId } = useShownDocumentMetadata(oppgaveId, mergedDocument, showDocumentList);
  const format = showRedacted ? VariantFormat.SLADDET : VariantFormat.ARKIV;
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

  if (mergedDocumentIsLoading) {
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
          hasRedactedDocuments={hasRedactedDocuments}
          hasAccessToArchivedDocuments={hasAccessToArchivedDocuments}
          showRedacted={showRedacted}
          setShowRedacted={setShowRedacted}
        />
        <h1 className="m-0 truncate border-ax-border-neutral border-l py-1 pl-1 font-bold text-base">
          {title ?? mergedDocument?.title ?? 'Ukjent dokument'}
        </h1>
        <Button
          as="a"
          href={
            showsArchivedDocument && hasRedactedDocuments && hasAccessToArchivedDocuments
              ? `${tabUrl}?format=${format}`
              : tabUrl
          }
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

interface RedactedSwitchProps {
  showsArchivedDocument: boolean;
  hasRedactedDocuments: boolean;
  hasAccessToArchivedDocuments: boolean;
  showRedacted: boolean;
  setShowRedacted: (showRedacted: boolean) => void;
}

interface VariantProps extends RedactedSwitchProps {
  showsPol: boolean;
  showsFeil: boolean;
}

const Variant = ({ showsPol, showsFeil, ...props }: VariantProps) => {
  return (
    <HStack gap="1" wrap={false}>
      <RedactedSwitch {...props} />

      {showsPol ? <PolTag /> : null}
      {showsFeil ? <FeilTag /> : null}
    </HStack>
  );
};

const RedactedSwitch = ({
  showsArchivedDocument,
  hasRedactedDocuments,
  hasAccessToArchivedDocuments,
  showRedacted,
  setShowRedacted,
}: RedactedSwitchProps) => {
  if (!showsArchivedDocument || !hasRedactedDocuments) {
    return null;
  }

  if (!hasAccessToArchivedDocuments) {
    return (
      <Tooltip content="Du har ikke tilgang til å se usladdet versjon" placement="top">
        <div className={LEFT_DIVIDER_CLASSES}>
          <Tag variant="alt1-filled" size="small">
            Sladdet
          </Tag>
        </div>
      </Tooltip>
    );
  }

  return (
    <div className={LEFT_DIVIDER_CLASSES}>
      <Switch size="small" checked={showRedacted} onChange={() => setShowRedacted(!showRedacted)} className="py-0">
        Sladdet
      </Switch>
    </div>
  );
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
  <VStack
    asChild
    minWidth={`${minWidth}px`}
    className="snap-start"
    align="center"
    justify="center"
    data-testid="show-document"
  >
    <BoxNew as="section" background="default" shadow="dialog" borderRadius="medium" position="relative">
      {children}
    </BoxNew>
  </VStack>
);

import { Tooltip, type TooltipProps } from '@navikt/ds-react';

interface Props {
  documentErrors?: string[];
  attachmentErrors?: string[];
  children: React.ReactElement;
  placement?: TooltipProps['placement'];
}

export const AccessErrorsSummary = ({ documentErrors = [], attachmentErrors = [], children, placement }: Props) => {
  if (documentErrors.length === 0 && attachmentErrors.length === 0) {
    return children;
  }

  const text = formatText(documentErrors, attachmentErrors);

  if (text === null) {
    return children;
  }

  return (
    <Tooltip
      content={text}
      maxChar={Number.POSITIVE_INFINITY}
      className="whitespace-pre text-left"
      placement={placement}
    >
      {children}
    </Tooltip>
  );
};

const formatText = (documentErrors: string[], attachmentErrors: string[]): string | null => {
  const hasDocumentErrors = documentErrors.length !== 0;
  const hasAttachmentErrors = attachmentErrors.length !== 0;

  if (!hasDocumentErrors && !hasAttachmentErrors) {
    return null;
  }

  if (hasDocumentErrors) {
    return `${toLines(documentErrors).join('\n')}`;
  }

  if (hasAttachmentErrors) {
    return `Vedlegg:\n${toLines(attachmentErrors).join('\n')}`;
  }

  return `${toLines(documentErrors).join('\n')}\n\n\tVedlegg:\n${indent(toLines(attachmentErrors)).join('\n')}`;
};

const toLines = (errors: string[]): string[] => errors.map((error) => `- ${error}`);
const indent = (lines: string[]): string[] => lines.map((line) => `\t${line}`);

import { FieldLabel } from '@app/components/documents/new-documents/modal/finish-document/address/layout';
import { ArrowUndoIcon } from '@navikt/aksel-icons';
import { Button, Tag, TextField, type TextFieldProps, Tooltip } from '@navikt/ds-react';
import { useMemo } from 'react';

interface Props extends Omit<TextFieldProps, 'value' | 'onChange' | 'defaultValue' | 'size'> {
  value: string | null;
  originalValue: string | null;
  onChange: (value: string | null) => void;
  error?: boolean;
}

export const AddressField = ({
  label,
  value,
  originalValue,
  onChange,
  autoFocus,
  required = false,
  error = false,
  pattern,
  ...props
}: Props) => {
  const isOverridden = (value ?? '') !== (originalValue ?? '');

  const patternRegex = useMemo(() => (pattern === undefined ? undefined : new RegExp(pattern)), [pattern]);

  return (
    <TextField
      size="small"
      label={
        <FieldLabel>
          {label}
          {required ? (
            <Tag size="xsmall" variant="info">
              Påkrevd
            </Tag>
          ) : null}
          {isOverridden ? (
            <Tag size="xsmall" variant="warning">
              Overstyrt
            </Tag>
          ) : null}
          {isOverridden ? (
            <Tooltip content={`Tilbakestill til «${originalValue}»`}>
              <Button
                size="xsmall"
                variant="tertiary"
                onClick={() => onChange(originalValue)}
                icon={<ArrowUndoIcon aria-hidden />}
              />
            </Tooltip>
          ) : null}
        </FieldLabel>
      }
      value={value ?? ''}
      onChange={({ currentTarget }) => {
        onChange(
          patternRegex === undefined || patternRegex.test(currentTarget.value) ? line(currentTarget.value) : value,
        );
      }}
      autoFocus={autoFocus}
      error={error ? 'Feltet er påkrevd' : undefined}
      pattern={pattern}
      {...props}
    />
  );
};

const line = (s: string) => (s.trim().length === 0 ? null : s);

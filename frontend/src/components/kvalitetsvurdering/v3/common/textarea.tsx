import { ContainerWithHelpText } from '@app/components/kvalitetsvurdering/common/container-with-helptext';
import type { TextParams } from '@app/components/kvalitetsvurdering/v3/common/types';
import { useKvalitetsvurderingV3 } from '@app/components/kvalitetsvurdering/v3/common/use-kvalitetsvurdering-v3';
import { useValidationError } from '@app/components/kvalitetsvurdering/v3/common/use-validation-error';
import { SavedStatus } from '@app/components/saved-status/saved-status';
import { useCanEditBehandling } from '@app/hooks/use-can-edit';
import type { KvalitetsvurderingV3Boolean } from '@app/types/kaka-kvalitetsvurdering/v3';
import { BodyLong, HStack, Label, Textarea } from '@navikt/ds-react';
import { useEffect, useState } from 'react';

interface Props extends TextParams {
  parentKey?: keyof KvalitetsvurderingV3Boolean;
}

export const KvalitetsskjemaTextarea = (props: Props) => {
  const { kvalitetsvurdering, isLoading } = useKvalitetsvurderingV3();
  const canEdit = useCanEditBehandling();

  if (isLoading) {
    return null;
  }

  const { label, helpText, field } = props;

  if (!canEdit) {
    return (
      <div>
        <ContainerWithHelpText helpText={helpText}>
          <Label htmlFor={field}>{label}</Label>
        </ContainerWithHelpText>
        <BodyLong id={field} className="border-ax-border-neutral-subtle border-l-2 pl-2">
          {kvalitetsvurdering[field]}
        </BodyLong>
      </div>
    );
  }

  return <KvalitetsskjemaTextareaInternal {...props} initialValue={kvalitetsvurdering[field] ?? ''} />;
};

interface InternalProps extends Props {
  initialValue: string;
}

const KvalitetsskjemaTextareaInternal = ({
  label,
  helpText,
  field,
  parentKey,
  description,
  initialValue,
}: InternalProps) => {
  const { kvalitetsvurdering, isLoading, update, updateStatus } = useKvalitetsvurderingV3();
  const [localValue, setLocalValue] = useState<string>(initialValue);
  const error = useValidationError(field);

  useEffect(() => {
    if (
      isLoading ||
      localValue === kvalitetsvurdering[field] ||
      (localValue === '' && kvalitetsvurdering[field] === null)
    ) {
      return;
    }

    const timeout = setTimeout(() => update({ [field]: localValue?.length === 0 ? null : localValue }), 1000);

    return () => clearTimeout(timeout);
  }, [field, isLoading, kvalitetsvurdering, localValue, update]);

  if (isLoading || localValue === null) {
    return null;
  }

  const show = parentKey === undefined ? true : kvalitetsvurdering[parentKey];

  if (!show) {
    return null;
  }

  return (
    <>
      <Textarea
        label={<ContainerWithHelpText helpText={helpText}>{label}</ContainerWithHelpText>}
        value={localValue}
        onChange={({ target }) => setLocalValue(target.value)}
        description={description}
        error={error}
      />
      <HStack align="center" justify="end" marginBlock="1 0" height="21px">
        <SavedStatus {...updateStatus} />
      </HStack>
    </>
  );
};

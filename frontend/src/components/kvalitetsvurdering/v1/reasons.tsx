import { CheckboxGroup, Loader } from '@navikt/ds-react';
import { Fragment } from 'react';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { useKvalitetsvurdering } from '@app/hooks/use-kvalitetsvurdering';
import { useUpdateKvalitetsvurderingMutation } from '@app/redux-api/kaka-kvalitetsvurdering/v1';
import { IKvalitetsvurderingBooleans, IKvalitetsvurderingTexts } from '@app/types/kaka-kvalitetsvurdering/v1';
import { CommentField } from './comment-field';
import { StyledCheckbox, StyledCheckboxContainer, StyledHelpText } from './styled-components';

export interface Reason {
  id: keyof IKvalitetsvurderingBooleans;
  label: string;
  textareaId?: keyof IKvalitetsvurderingTexts;
  helpText?: string;
  show?: boolean;
  checked: boolean;
}
interface ReasonsProps {
  reasons: Reason[];
  show?: boolean;
  legendText?: string;
  error?: string | undefined;
}

export const Reasons = ({ error, show = true, legendText = '', reasons }: ReasonsProps) => {
  const [kvalitetsvurdering, isLoading] = useKvalitetsvurdering();
  const [updateKvalitetsvurdering] = useUpdateKvalitetsvurderingMutation();
  const canEdit = useCanEdit();

  if (isLoading) {
    return <Loader size="xlarge" />;
  }

  if (!show || typeof kvalitetsvurdering === 'undefined') {
    return null;
  }

  const { id } = kvalitetsvurdering;

  const value = reasons.filter((reason) => reason.checked).map((reason) => reason.id);

  return (
    <CheckboxGroup legend={legendText} error={error} size="small" value={value}>
      {reasons
        .filter((reason) => reason.show !== false)
        .map((reason) => {
          const showTextArea = reason.checked === true && typeof reason.textareaId !== 'undefined';

          return (
            <Fragment key={String(reason.id)}>
              <StyledCheckboxContainer>
                <StyledCheckbox
                  size="small"
                  value={reason.id}
                  onChange={({ target }) =>
                    updateKvalitetsvurdering({
                      id,
                      [reason.id]: target.checked,
                    })
                  }
                  disabled={!canEdit}
                >
                  {reason.label}
                </StyledCheckbox>
                <HjelpetekstDisplay helpText={reason.helpText} />
              </StyledCheckboxContainer>
              <CommentFieldDisplay textareaId={reason.textareaId} show={showTextArea} />
            </Fragment>
          );
        })}
    </CheckboxGroup>
  );
};

interface CommentFieldDisplayProps {
  textareaId: keyof IKvalitetsvurderingTexts | undefined;
  show: boolean;
}

const CommentFieldDisplay = ({ textareaId, show }: CommentFieldDisplayProps) => {
  if (!show || typeof textareaId === 'undefined') {
    return null;
  }

  return <CommentField textareaId={textareaId} />;
};

interface HjelpetekstDisplayProps {
  helpText: string | undefined;
}

const HjelpetekstDisplay = ({ helpText }: HjelpetekstDisplayProps) => {
  if (typeof helpText === 'undefined') {
    return null;
  }

  return <StyledHelpText title="Hjelpetekst">{helpText}</StyledHelpText>;
};

import { Loader } from '@navikt/ds-react';
import { CheckboxGruppe } from 'nav-frontend-skjema';
import React, { Fragment } from 'react';
import { useCanEdit } from '../../hooks/use-can-edit';
import { useKvalitetsvurdering } from '../../hooks/use-kvalitetsvurdering';
import { useUpdateKvalitetsvurderingMutation } from '../../redux-api/kaka-kvalitetsvurdering';
import { IKvalitetsvurderingBooleans } from '../../types/kaka-kvalitetsvurdering';
import { CommentField } from './comment-field';
import { ReasonsField, StyledCheckbox, StyledCheckboxContainer, StyledHelpText } from './styled-components';

export interface Reason {
  id: keyof IKvalitetsvurderingBooleans;
  label: string;
  textareaId?: string;
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

  return (
    <ReasonsField>
      <CheckboxGruppe legend={legendText} feil={error}>
        {reasons
          .filter((reason) => reason.show !== false)
          .map((reason) => {
            const showTextArea = reason.checked === true && typeof reason.textareaId !== 'undefined';
            return (
              <Fragment key={String(reason.id)}>
                <StyledCheckboxContainer>
                  <StyledCheckbox
                    label={reason.label}
                    value={reason.id}
                    checked={reason.checked}
                    onChange={({ target }) =>
                      updateKvalitetsvurdering({
                        id,
                        [reason.id]: target.checked,
                      })
                    }
                    disabled={!canEdit}
                  />
                  <HjelpetekstDisplay helpText={reason.helpText} />
                </StyledCheckboxContainer>
                <CommentFieldDisplay textareaId={reason.textareaId} show={showTextArea} />
              </Fragment>
            );
          })}
      </CheckboxGruppe>
    </ReasonsField>
  );
};

interface CommentFieldDisplayProps {
  textareaId: string | undefined;
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

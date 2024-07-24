import { CogRotationIcon } from '@navikt/aksel-icons';
import { BodyShort, Button } from '@navikt/ds-react';
import { CLOSE_TOAST_EVENT_TYPE } from '@app/components/toast/toast';
import { pushEvent } from '@app/observability';

interface Props {
  isRequired?: boolean;
}

export const VersionToast = ({ isRequired = false }: Props) => (
  <>
    <BodyShort size="small">Det finnes en ny versjon av Kabal.</BodyShort>
    {isRequired ? (
      <BodyShort size="small">Det er viktig at du oppdaterer så raskt som mulig.</BodyShort>
    ) : (
      <Button
        variant="secondary"
        size="small"
        onClick={(e) => {
          pushEvent('close_update_toast', 'update', { required: isRequired ? 'true' : 'false' });
          e.target.dispatchEvent(new Event(CLOSE_TOAST_EVENT_TYPE, { bubbles: true }));
        }}
      >
        Ignorer
      </Button>
    )}

    <Button
      variant="primary"
      size="small"
      icon={<CogRotationIcon aria-hidden />}
      onClick={() => {
        pushEvent('click_update_toast', 'update', { required: isRequired ? 'true' : 'false' });
        window.location.reload();
      }}
      data-testid="update-kabal-button"
    >
      Oppdater Kabal
    </Button>
  </>
);

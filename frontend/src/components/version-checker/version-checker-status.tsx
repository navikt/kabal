import { CogRotationIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, Modal } from '@navikt/ds-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from '@app/components/toast/store';
import { VersionToast } from '@app/components/version-checker/toast';
import { ENVIRONMENT } from '@app/environment';
import { pushEvent } from '@app/observability';
import { UpdateRequest, VERSION_CHECKER } from './version-checker';

const IGNORE_UPDATE_KEY = 'ignoreUpdate';
const IGNORE_UPDATE_TIMEOUT = ENVIRONMENT.isProduction ? 1_000 * 60 * 60 : 10_000; // 1 hour for production, 10 seconds for development.

const UPDATE_TOAST_TIMEOUT: number = Infinity;
const UPDATED_TOAST_TIMEOUT: number = 5_000;

export const VersionCheckerStatus = () => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const [ignoredAt, setIgnoredAt] = useState(getIgnoredAt());
  const ignoredUntil = ignoredAt === 0 ? 0 : ignoredAt + IGNORE_UPDATE_TIMEOUT;
  const closeToast = useRef<() => void>(() => undefined);

  const showToast = useCallback((isRequired: boolean) => {
    closeToast.current();

    if (isRequired) {
      closeToast.current = toast.warning(<VersionToast isRequired />, UPDATE_TOAST_TIMEOUT);

      return;
    }

    closeToast.current = toast.info(<VersionToast />, UPDATE_TOAST_TIMEOUT);
  }, []);

  const handleUpdateRequest = useCallback(
    (updateRequest: UpdateRequest) => {
      if (updateRequest === UpdateRequest.NONE) {
        return;
      }

      const isIgnored = ignoredUntil > Date.now();

      if (isIgnored) {
        return;
      }

      const isNonDisturbPage = getIsNonDisturbPage();
      const isRequired = updateRequest === UpdateRequest.REQUIRED;

      if (isRequired && !isNonDisturbPage) {
        closeToast.current();
        modalRef.current?.showModal();
      } else {
        showToast(isRequired);
      }
    },
    [ignoredUntil, showToast],
  );

  useEffect(() => {
    VERSION_CHECKER.addUpdateRequestListener(handleUpdateRequest);

    return () => VERSION_CHECKER.removeUpdateRequestListener(handleUpdateRequest);
  }, [handleUpdateRequest]);

  useEffect(() => {
    const isIgnored = ignoredUntil > Date.now();

    if (!isIgnored) {
      return;
    }

    const timeout = setTimeout(
      () => handleUpdateRequest(VERSION_CHECKER.getUpdateRequest()),
      ignoredUntil - Date.now(),
    );

    return () => clearTimeout(timeout);
  }, [handleUpdateRequest, ignoredUntil]);

  useEffect(() => {
    const lastViewedVersion = localStorage.getItem('lastViewedVersion');

    if (ENVIRONMENT.version !== lastViewedVersion) {
      toast.success('Kabal er oppdatert.', UPDATED_TOAST_TIMEOUT);
      localStorage.setItem('lastViewedVersion', ENVIRONMENT.version);
    }
  }, []);

  const onCloseModal = useCallback(() => {
    pushEvent('close_update_modal', 'update');
    const now = Date.now();
    setIgnoredAt(now);
    window.localStorage.setItem(IGNORE_UPDATE_KEY, now.toString(10));
    showToast(true);
  }, [showToast]);

  const onIgnoreModal = useCallback(() => modalRef.current?.close(), []);

  return (
    <Modal
      onClose={onCloseModal}
      closeOnBackdropClick
      header={{
        heading: 'Ny versjon av Kabal er tilgjengelig!',
      }}
      ref={modalRef}
      width={500}
    >
      <Modal.Body>
        <BodyShort>Det er viktig at du oppdaterer så raskt som mulig.</BodyShort>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="primary"
          icon={<CogRotationIcon aria-hidden />}
          onClick={() => {
            pushEvent('click_update_modal', 'update');
            window.location.reload();
          }}
          data-testid="update-button"
          size="medium"
        >
          Oppdater Kabal
        </Button>
        <Button variant="secondary" onClick={onIgnoreModal} size="medium">
          Ignorer i {ENVIRONMENT.isProduction ? '1 time' : '10 sekunder'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const getIgnoredAt = () => {
  const raw = window.localStorage.getItem(IGNORE_UPDATE_KEY);

  if (raw === null) {
    return 0;
  }

  const parsed = Number.parseInt(raw, 10);

  if (Number.isNaN(parsed)) {
    return 0;
  }

  return parsed;
};

const NON_DISTURB_PATHS = ['/klagebehandling/', '/ankebehandling/', '/trygderettsankebehandling/'];

const getIsNonDisturbPage = () => {
  const { pathname } = window.location;

  return NON_DISTURB_PATHS.some((path) => pathname.startsWith(path));
};

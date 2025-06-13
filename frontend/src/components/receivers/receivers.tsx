import { CustomReceivers } from '@app/components/receivers/custom-receivers';
import type { IErrorProperty } from '@app/components/receivers/is-send-error';
import { SingleReceiver } from '@app/components/receivers/single-receiver';
import { SuggestedReceivers } from '@app/components/receivers/suggested-receivers';
import { UnreachableSuggestedReceivers } from '@app/components/receivers/unreachable-suggested-receivers';
import { type IBrevmottaker, useSuggestedBrevmottakere } from '@app/hooks/use-suggested-brevmottakere';
import { DistribusjonsType, type IMottaker } from '@app/types/documents/documents';
import { PartStatusEnum } from '@app/types/oppgave-common';
import type { TemplateIdEnum } from '@app/types/smart-editor/template-enums';
import { Alert, VStack } from '@navikt/ds-react';
import { useCallback, useEffect } from 'react';

interface Props {
  setMottakerList: (mottakere: IMottaker[]) => void;
  mottakerList: IMottaker[];
  sendErrors?: IErrorProperty[];
  templateId?: TemplateIdEnum | undefined;
  dokumentTypeId?: DistribusjonsType;
  isLoading: boolean;
}

export const Receivers = ({
  setMottakerList,
  mottakerList,
  sendErrors = [],
  templateId,
  dokumentTypeId,
  isLoading,
}: Props) => {
  const [suggestedBrevmottakere] = useSuggestedBrevmottakere(mottakerList, templateId);

  const reachableSuggestedReceivers = suggestedBrevmottakere.filter((s) => s.reachable);

  const addMottakere = useCallback(
    (mottakere: IMottaker[]) => {
      const newMottakere =
        mottakerList.length === 0 &&
        reachableSuggestedReceivers.length === 1 &&
        dokumentTypeId !== DistribusjonsType.EKSPEDISJONSBREV_TIL_TRYGDERETTEN
          ? [
              ...reachableSuggestedReceivers.filter((s) => !mottakerList.some((m) => m.part.id === s.part.id)),
              ...mottakerList,
            ]
          : [...mottakerList];

      for (const mottaker of mottakere) {
        if (newMottakere.some((m) => m.part.id === mottaker.part.id)) {
          continue;
        }

        newMottakere.push(mottaker);
      }

      setMottakerList(newMottakere);
    },
    [mottakerList, setMottakerList, reachableSuggestedReceivers, dokumentTypeId],
  );

  const removeMottakere = useCallback(
    (ids: string[]) => {
      const newMottakere = mottakerList.filter((m) => !ids.includes(m.part.id));

      if (newMottakere.length === mottakerList.length) {
        return;
      }

      setMottakerList(newMottakere);
    },
    [mottakerList, setMottakerList],
  );

  const changeMottaker = useCallback(
    (changedMottaker: IMottaker) => {
      const mottakerCount = mottakerList.length;
      const newMottakere = new Array<IMottaker>(mottakerCount);
      let found = false;

      for (let i = mottakerCount; i >= 0; i--) {
        const mottaker = mottakerList[i];

        if (mottaker === undefined) {
          continue;
        }

        if (mottaker.part.id === changedMottaker.part.id) {
          found = true;
          newMottakere[i] = {
            part: mottaker.part,
            handling: changedMottaker.handling ?? mottaker.handling,
            overriddenAddress:
              changedMottaker.overriddenAddress === undefined
                ? mottaker.overriddenAddress
                : changedMottaker.overriddenAddress,
          };
        } else {
          newMottakere[i] = mottaker;
        }
      }

      if (!found) {
        newMottakere.push(changedMottaker);
      }

      setMottakerList(newMottakere);
    },
    [mottakerList, setMottakerList],
  );

  useEffect(() => {
    const unreachableReceivers = mottakerList.filter(
      (m) =>
        m.part.statusList?.some((s) => s.status === PartStatusEnum.DEAD || s.status === PartStatusEnum.DELETED) ??
        false,
    );

    if (unreachableReceivers.length > 0) {
      removeMottakere(unreachableReceivers.map((r) => r.part.id));
    }
  }, [mottakerList, removeMottakere]);

  const customReceivers = mottakerList.filter((m) => suggestedBrevmottakere.every((s) => s.part.id !== m.part.id));
  const unreachableSuggestedReceivers = suggestedBrevmottakere.filter((s) => !s.reachable);
  const [firstReachableReceiver, ...restReachableSuggestedReceivers] = reachableSuggestedReceivers;
  const onlyOneReachableReceiver =
    restReachableSuggestedReceivers.length === 0 &&
    customReceivers.length === 0 &&
    firstReachableReceiver !== undefined;

  return (
    <VStack gap="4 0" position="relative" as="section">
      <DefaultReceivers
        selectedIds={mottakerList.map((m) => m.part.id)}
        addMottakere={addMottakere}
        removeMottakere={removeMottakere}
        changeMottaker={changeMottaker}
        sendErrors={sendErrors}
        templateId={templateId}
        onlyOneReachable={onlyOneReachableReceiver}
        receivers={reachableSuggestedReceivers}
        dokumentTypeId={dokumentTypeId}
        isLoading={isLoading}
      />

      <UnreachableSuggestedReceivers receivers={unreachableSuggestedReceivers} />

      <CustomReceivers
        mottakerList={customReceivers}
        addMottakere={addMottakere}
        removeMottakere={removeMottakere}
        changeMottaker={changeMottaker}
        sendErrors={sendErrors}
        templateId={templateId}
      />

      {reachableSuggestedReceivers.length === 0 && customReceivers.length === 0 ? (
        <Alert variant="warning" size="small">
          Ingen gyldige mottakere.
        </Alert>
      ) : null}

      {sendErrors.length === 0 ? null : (
        <Alert variant="error" size="small">
          Brevet er ikke sendt til noen. Se feil over.
        </Alert>
      )}
    </VStack>
  );
};

interface DefaultReceiversProps {
  selectedIds: string[];
  addMottakere: (mottakere: IMottaker[]) => void;
  removeMottakere: (ids: string[]) => void;
  changeMottaker: (mottaker: IMottaker) => void;
  sendErrors: IErrorProperty[];
  templateId: TemplateIdEnum | undefined;
  dokumentTypeId?: DistribusjonsType;
  receivers: IBrevmottaker[];
  onlyOneReachable: boolean;
  isLoading: boolean;
}

const DefaultReceivers = ({ onlyOneReachable, receivers, dokumentTypeId, ...props }: DefaultReceiversProps) => {
  if (dokumentTypeId === DistribusjonsType.EKSPEDISJONSBREV_TIL_TRYGDERETTEN) {
    return (
      <>
        <Alert variant="info" size="small" inline>
          Forhåndsvalgt mottaker: Trygderetten
        </Alert>

        <SuggestedReceivers {...props} receivers={receivers} />
      </>
    );
  }

  const [first, ...rest] = receivers;

  if (onlyOneReachable && first !== undefined) {
    return <SingleReceiver receiver={first} changeMottaker={props.changeMottaker} templateId={props.templateId} />;
  }

  return <SuggestedReceivers {...props} receivers={onlyOneReachable ? rest : receivers} />;
};

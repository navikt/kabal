import React, { useCallback, useState } from 'react';
import { Copy } from '@navikt/ds-icons';
import { IKlagebehandling } from '../../../tilstand/moduler/klagebehandling/stateTypes';
import { IFaner } from '../KlageBehandling';
import { EksterneLenker } from './EksterneLenker';
// @ts-ignore
import IkonMann from '../../mann.svg';
// @ts-ignore
import IkonKvinne from '../../kvinne.svg';
// @ts-ignore
import CloseSVG from '../../cancel.svg';
// @ts-ignore
import HakeSVG from '../../hake.svg';
import {
  IkonHake,
  IkonLukk,
  Kjonn,
  Klagebehandling,
  Knapper,
  Kontrollpanel,
  Navn,
  Person,
  Personnummer,
  SjekkboksLabel,
} from '../../../styled-components/Klagebehandling';

interface TopplinjeProps {
  klagebehandling: IKlagebehandling;
  faner: IFaner;
  settAktiveFaner: (faner: IFaner) => void;
}

function StrengtFortrolig({ vises }: { vises: boolean }) {
  return vises ? <Klagebehandling className={'etikett'}>Strengt fortrolig</Klagebehandling> : null;
}
function Fortrolig({ vises }: { vises: boolean }) {
  return vises ? <Klagebehandling className={'etikett'}>Fortrolig</Klagebehandling> : null;
}
function EgenAnsatt({ vises }: { vises: boolean }) {
  return vises ? <Klagebehandling className={'etikett'}>Habilitetsak</Klagebehandling> : null;
}

export const Topplinje = ({ klagebehandling, faner, settAktiveFaner }: TopplinjeProps) => {
  const toggleFane = useCallback(
    (id: string) =>
      settAktiveFaner({
        ...faner,
        [id]: {
          checked: !faner[id].checked,
        },
      }),
    [faner]
  );

  const kjonn = klagebehandling.sakenGjelderKjoenn?.substr(0, 1).toLocaleUpperCase();

  const [copied, setCopied] = useState(false);
  const [timerId, setTimerId] = useState<any>(null);
  const timer = () => setTimeout(() => setCopied(false), 3000);

  const copy2clip = useCallback((tekst: string) => {
    clearTimeout(timerId);
    const timerfnc = timer();
    setTimerId(timerfnc);
    navigator.clipboard.writeText(tekst);
    setCopied(true);
  }, []);

  return (
    <Kontrollpanel>
      <Person
        data-tip={`${fornavn(klagebehandling)} ${mellomnavn(klagebehandling)} ${etternavn(klagebehandling)}`}
        data-delay-show={1000}
      >
        <Kjonn theme={{ bgColor: kjonn === 'M' ? '#3385D1' : '#ba3a26' }}>
          {kjonn === 'M' ? <img alt="Ekstern lenke" src={IkonMann} /> : <img alt="Ekstern lenke" src={IkonKvinne} />}
        </Kjonn>
        <Navn>{`${fornavn(klagebehandling)} ${mellomnavn(klagebehandling)} ${etternavn(klagebehandling)}`}</Navn>
        <span>/</span>
        <Personnummer>{klagebehandling.sakenGjelderFoedselsnummer}</Personnummer>
        <Copy
          aria-label="Kopier personnummer til clipboard"
          role="button"
          focusable="true"
          className={'copy-button'}
          onClick={() => copy2clip(klagebehandling.sakenGjelderFoedselsnummer!.toString())}
        />
        {copied && <div className={'copy-tekst'}>Kopiert</div>}
        <StrengtFortrolig vises={klagebehandling.strengtfortrolig} />
        <Fortrolig vises={klagebehandling.fortrolig} />
        <EgenAnsatt vises={klagebehandling.egenansatt} />
      </Person>

      <Knapper>
        <ToggleKnapp id={'dokumenter'} label={'Dokumenter'} clickFn={() => toggleFane('dokumenter')} faner={faner} />
        <ToggleKnapp id={'detaljer'} label={'Behandling'} clickFn={() => toggleFane('detaljer')} faner={faner} />
        <ToggleKnapp
          id={'kvalitetsvurdering'}
          label={'Kvalitetsvurdering'}
          clickFn={() => toggleFane('kvalitetsvurdering')}
          faner={faner}
        />
        <ToggleKnapp id={'vedtak'} label={'Fullfør vedtak'} clickFn={() => toggleFane('vedtak')} faner={faner} />
      </Knapper>

      <EksterneLenker fnr={klagebehandling.sakenGjelderFoedselsnummer} />
    </Kontrollpanel>
  );
};

function ToggleKnapp({ id, clickFn, label, faner }: { id: string; clickFn: Function; label: string; faner: any }) {
  return (
    <label htmlFor="toggle" className="toggle-flex" onClick={() => clickFn(id)}>
      <div className="toggle-kontainer">
        <input type="checkbox" readOnly={true} checked={faner[id].checked} id={id} className="real-checkbox" />
        <div className="toggle-button">
          <IkonHake alt="Slå av fane" src={HakeSVG} theme={{ display: faner[id].checked ? 'unset' : 'none' }} />
          <IkonLukk alt="Slå på fane" src={CloseSVG} theme={{ display: !faner[id].checked ? 'unset' : 'none' }} />
        </div>
      </div>
      <SjekkboksLabel className={`toggle-label ${faner[id].checked ? 'fet' : ''}`}>{label}</SjekkboksLabel>
    </label>
  );
}

function fornavn(klage: Partial<IKlagebehandling>) {
  if (klage.sakenGjelderNavn?.fornavn) {
    return klage.sakenGjelderNavn.fornavn;
  }
  return '';
}

function etternavn(klage: Partial<IKlagebehandling>) {
  if (klage.sakenGjelderNavn?.etternavn) {
    return klage.sakenGjelderNavn.etternavn.padStart(1, ' ');
  }
  return '';
}

function mellomnavn(klage: Partial<IKlagebehandling>) {
  if (klage.sakenGjelderNavn?.mellomnavn) {
    return klage.sakenGjelderNavn.mellomnavn.padStart(1, ' ');
  }
  return '';
}

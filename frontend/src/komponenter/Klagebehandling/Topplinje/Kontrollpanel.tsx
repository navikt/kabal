import React, { useCallback } from "react";
import styled from "styled-components";
import { IKlagebehandling } from "../../../tilstand/moduler/klagebehandling/stateTypes";
import { IFaner } from "../KlageBehandling";
import { EksterneLenker } from "./EksterneLenker";
// @ts-ignore
import IkonMann from "../../mann.svg";
// @ts-ignore
import IkonKvinne from "../../kvinne.svg";
// @ts-ignore
import CloseSVG from "../../cancel.svg";
// @ts-ignore
import HakeSVG from "../../hake.svg";

interface TopplinjeProps {
  klagebehandling: IKlagebehandling;
  faner: IFaner;
  settAktiveFaner: (faner: IFaner) => void;
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

  return (
    <Kontrollpanel>
      <Person
        data-tip={`${fornavn(klagebehandling)} ${mellomnavn(klagebehandling)} ${etternavn(
          klagebehandling
        )}`}
        data-delay-show={1000}
      >
        <Kjonn theme={{ bgColor: kjonn === "M" ? "#3385D1" : "#ba3a26" }}>
          {kjonn === "M" ? (
            <img alt="Ekstern lenke" src={IkonMann} />
          ) : (
            <img alt="Ekstern lenke" src={IkonKvinne} />
          )}
        </Kjonn>
        <Navn>{`${fornavn(klagebehandling)} ${mellomnavn(klagebehandling)} ${etternavn(
          klagebehandling
        )}`}</Navn>
        <span>/</span>
        <Personnummer>{klagebehandling.sakenGjelderFoedselsnummer}</Personnummer>
      </Person>

      <Knapper>
        <ToggleKnapp
          id={"dokumenter"}
          label={"Dokumenter"}
          clickFn={() => toggleFane("dokumenter")}
          faner={faner}
        />
        <ToggleKnapp
          id={"detaljer"}
          label={"Behandling"}
          clickFn={() => toggleFane("detaljer")}
          faner={faner}
        />
        <ToggleKnapp
          id={"kvalitetsvurdering"}
          label={"Kvalitetsvurdering"}
          clickFn={() => toggleFane("kvalitetsvurdering")}
          faner={faner}
        />
        <ToggleKnapp
          id={"vedtak"}
          label={"Fullfør vedtak"}
          clickFn={() => toggleFane("vedtak")}
          faner={faner}
        />
      </Knapper>

      <EksterneLenker fnr={klagebehandling.sakenGjelderFoedselsnummer} />
    </Kontrollpanel>
  );
};

function ToggleKnapp({
  id,
  clickFn,
  label,
  faner,
}: {
  id: string;
  clickFn: Function;
  label: string;
  faner: any;
}) {
  return (
    <label htmlFor="toggle" className="toggle-flex" onClick={() => clickFn(id)}>
      <div className="toggle-kontainer">
        <input
          type="checkbox"
          readOnly={true}
          checked={faner[id].checked}
          id={id}
          className="real-checkbox"
        />
        <div className="toggle-button">
          <IkonHake
            alt="Slå av fane"
            src={HakeSVG}
            theme={{ display: faner[id].checked ? "unset" : "none" }}
          />
          <IkonLukk
            alt="Slå på fane"
            src={CloseSVG}
            theme={{ display: !faner[id].checked ? "unset" : "none" }}
          />
        </div>
      </div>
      <SjekkboksLabel className={`toggle-label ${faner[id].checked ? "fet" : ""}`}>
        {label}
      </SjekkboksLabel>
    </label>
  );
}

const IkonHake = styled.img`
  position: absolute;
  display: ${(props) => props.theme.display};
  margin: 0.25em 0 0 -2em;
  -webkit-transition: all 0.4s ease-in-out;
  transition: all 0.4s ease-in-out;
`;
const IkonLukk = styled.img`
  position: absolute;
  display: ${(props) => props.theme.display};
  margin: 0.25em 0 0 0.2em;
  -webkit-transition: all 0.4s ease-in-out;
  transition: all 0.4s ease-in-out;
`;

const Kontrollpanel = styled.div`
  display: grid;
  background: #f8f8f8;
  grid-template-columns: auto repeat(3, 1fr);
  grid-template-areas: "Person Toggles Toggles Knapper";
  height: 3em;

  @media screen and (max-width: 1460px) {
    height: 6.25em;
    grid-template-areas:
      "Person Knapper Knapper Knapper"
      "Toggles Toggles Toggles Toggles";
  }
`;

const Knapper = styled.div`
  display: flex;
  grid-area: Toggles;
  user-select: none;
  cursor: pointer;
  justify-content: space-between;
  max-width: 47 em;
  justify-self: left;
  @media screen and (max-width: 1400px) {
    justify-content: flex-start;
    justify-self: flex-start;
  }
`;
const Person = styled.div`
  border: 1px solid #e7e9e9;
  border-left: 0;
  grid-area: Person;
  border-bottom: 0;
  border-top: 0;
  margin: 0.5em 1em;
  white-space: nowrap;
  padding: 0.5em 1em;
  max-width: 23em;
  overflow: hidden;
  text-overflow: ellipsis;
  @media screen and (max-width: 1400px) {
    padding: 0.5em 0 0 0;
    border: none;
  }
`;
const Navn = styled.span`
  font-weight: bold;
  padding-right: 0.1em;
`;
const Kjonn = styled.span`
  font-weight: bold;
  padding-right: 0.1em;
  background: ${(props) => props.theme.bgColor};
  border-radius: 50%;
  width: 1.3em;
  height: 1.3em;
  padding: 2px;
  color: white;
  justify-content: center;
  display: inline-flex;
  margin: 0 5px 0 0;
`;

const Personnummer = styled.span`
  padding-left: 0.1em;
`;
const SjekkboksLabel = styled.div`
  z-index: 5;
`;

function fornavn(klage: Partial<IKlagebehandling>) {
  if (klage.sakenGjelderNavn?.fornavn) {
    return klage.sakenGjelderNavn.fornavn;
  }
  return "";
}

function etternavn(klage: Partial<IKlagebehandling>) {
  if (klage.sakenGjelderNavn?.etternavn) {
    return klage.sakenGjelderNavn.etternavn.padStart(1, " ");
  }
  return "";
}

function mellomnavn(klage: Partial<IKlagebehandling>) {
  if (klage.sakenGjelderNavn?.mellomnavn) {
    return klage.sakenGjelderNavn.mellomnavn.padStart(1, " ");
  }
  return "";
}

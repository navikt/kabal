import React, { ReactNode, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { NavLink, useHistory } from "react-router-dom";
import classNames from "classnames";
import styled from "styled-components";
import IkonSystem from "./icons/IkonSystem";
import { velgMeg } from "../../tilstand/moduler/meg.velgere";
import { settEnhetHandling } from "../../tilstand/moduler/meg";
import { useOnInteractOutside } from "../Tabell/FiltrerbarHeader";
import { velgFeatureToggles } from "../../tilstand/moduler/unleash.velgere";
import { useAppDispatch } from "../../tilstand/konfigurerTilstand";
import isDevLocation from "../../utility/isDevLocation";
import "./Header.less";

const BrukerBoks = styled.div`
  z-index: 2;
`;

export type Brukerinfo = {
  navn: string;
  ident: string;
  enhet?: string;
  rolle?: string;
};

export interface HeaderProps {
  tittel: ReactNode;
  backLink: string;
  brukerinfo: Brukerinfo;
  children?: ReactNode | ReactNode[];
}

export const Bruker = ({ navn }: Brukerinfo) => {
  const [aapen, setAapen] = useState(false);
  const [harAdminTilgang, settHarAdminTilgang] = useState(false);
  const person = useSelector(velgMeg);
  const dispatch = useAppDispatch();
  const { enheter, valgtEnhet } = person;
  const ref = useRef<HTMLDivElement>(null);
  const featureToggles = useSelector(velgFeatureToggles);

  useEffect(() => {
    const adminEnabled = featureToggles.features.find((f) => f?.navn === "klage.admin");
    if (adminEnabled?.isEnabled !== undefined) {
      if (isDevLocation()) settHarAdminTilgang(true);
      else settHarAdminTilgang(adminEnabled.isEnabled);
    }
  }, [featureToggles]);

  useOnInteractOutside({
    ref,
    onInteractOutside: () => setAapen(false),
    active: aapen,
  });

  const settEnhet = (id: string) => {
    dispatch(settEnhetHandling({ enhetId: id, navIdent: person.graphData.id }));
    setAapen(false);
  };

  const visValgtEnhet = () => {
    return valgtEnhet.navn ?? "";
  };

  return (
    <BrukerBoks className={"bruker-boks"}>
      <button
        className={classNames(aapen ? "header__lukkeknapp" : "header__aapneknapp")}
        onClick={() => setAapen((a) => !a)}
      >
        <div className={classNames("header__brukerinfo", "header__rad", "header__gap")}>
          <div className={"header__tekstNormal"}>
            <div>{navn}</div>
            <div>{visValgtEnhet()}</div>
          </div>
          <div className="header__knapp ">
            <div className={classNames(aapen ? "header__aapen" : "header__lukket")} />
          </div>
        </div>
      </button>
      <div className={classNames(aapen ? "velg-enhet maksimert" : "minimert")} ref={ref}>
        <div className={"enheter"}>
          <EnhetListe>
            {(() => {
              if (isDevLocation() || !harAdminTilgang) {
                return enheter.map((enhet) => (
                  <li key={enhet.id}>
                    <EnhetKnapp
                      onClick={() => settEnhet(enhet.id)}
                      disabled={person.valgtEnhet.id === enhet.id}
                    >
                      {enhet.id} {enhet.navn}
                    </EnhetKnapp>
                  </li>
                ));
              }
            })()}
          </EnhetListe>
          {harAdminTilgang && (
            <NavLink to={"/admin"} className={classNames({ enhet: true, navlink: true })}>
              Admin
            </NavLink>
          )}
          <NavLink to={"/innstillinger"} className={classNames({ enhet: true, navlink: true })}>
            Innstillinger
          </NavLink>
          <a href={"/internal/logout"} className={classNames({ enhet: true, navlink: true })}>
            Logg ut
          </a>
        </div>
      </div>
    </BrukerBoks>
  );
};

export const Header = ({ tittel, backLink, children, brukerinfo }: HeaderProps) => {
  const history = useHistory();

  return (
    <header className={"header__kontainer"}>
      <div
        className={"header__rad pointer"}
        onClick={() => history.push(backLink ? backLink : `/`)}
      >
        <h1 className={"header__tittel"}>{tittel}</h1>
        <div className={"header__avdeler skjult"} />
        {children}
      </div>
      <div className={"header__rad"}>
        <button className={"header__systemknapp skjult"}>
          <IkonSystem />
        </button>
        <div className={"header__avdeler skjult"} />
        <Bruker {...brukerinfo}>
          <IkonSystem />
        </Bruker>
      </div>
    </header>
  );
};

const EnhetListe = styled.ul`
  list-style: none;
  border-bottom: 1px solid grey;
  padding: 0;
  margin: 0;
`;

const EnhetKnapp = styled.button`
  display: block;
  width: 100%;
  background-color: transparent;
  padding-left: 2em;
  padding-top: 0.5em;
  padding-bottom: 0.5em;
  color: black;
  font-size: 1em;
  border: none;
  cursor: pointer;
  text-align: left;

  :hover,
  :active {
    background-color: #e7e9e9;
  }
`;

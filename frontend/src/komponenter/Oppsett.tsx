import React, { useCallback, useEffect, useRef, useState } from "react";
import { Header } from "./Header/Header";
import Alertstripe from "nav-frontend-alertstriper";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import Cookies from "js-cookie";
import { NavLink, Redirect } from "react-router-dom";
import { velgMeg } from "../tilstand/moduler/meg.velgere";
import { velgFeatureToggles } from "../tilstand/moduler/unleash.velgere";
import { velgToaster, velgToasterMelding } from "../tilstand/moduler/toaster.velgere";
import { hentFeatureToggleHandling } from "../tilstand/moduler/unleash";
import NavFrontendSpinner from "nav-frontend-spinner";
import { toasterSkjul } from "../tilstand/moduler/toaster";
import { useAppDispatch } from "../tilstand/konfigurerTilstand";
import { hentKodeverk } from "../tilstand/moduler/kodeverk";
import { velgKodeverk } from "../tilstand/moduler/kodeverk.velgere";
import { hentMegHandling, hentMegUtenEnheterHandling } from "../tilstand/moduler/meg";
import isDevLocation from "../utility/isDevLocation";
import useInterval from "../utility/useInterval";
import { hentToken, sjekkAuth } from "../tilstand/moduler/auth";
import { velgAuth } from "../tilstand/moduler/auth.velgere";

const R = require("ramda");

interface LayoutType {
  visMeny: boolean;
  backLink?: string;
  customClass?: string;
  contentClass?: string;
  children: JSX.Element[] | JSX.Element;
}

export default function Oppsett({
  visMeny,
  backLink,
  customClass,
  contentClass,
  children,
}: LayoutType) {
  const person = useSelector(velgMeg);
  const visToaster = useSelector(velgToaster);
  const toastBeskjed = useSelector(velgToasterMelding);
  const featureToggles = useSelector(velgFeatureToggles);
  const isAuth = useSelector(velgAuth);
  const kodeverk = useSelector(velgKodeverk);
  const dispatch = useAppDispatch();
  const [generellTilgang, settTilgang] = useState<boolean | undefined>(undefined);
  const isFirstRun = useRef(true);

  useInterval(() => {
    dispatch(hentToken());
  }, 50000);

  useEffect(() => {
    dispatch(hentFeatureToggleHandling("klage.generellTilgang"));
    dispatch(hentFeatureToggleHandling("klage.admin"));
    dispatch(hentFeatureToggleHandling("klage.listFnr"));

    if (R.empty(kodeverk)) {
      dispatch(hentKodeverk());
    }
  }, [dispatch, hentKodeverk, hentFeatureToggleHandling]);

  const adminEnabled = featureToggles.features.find((f) => f?.navn === "klage.admin");
  const tilgangEnabled = featureToggles.features.find((f) => f?.navn === "klage.generellTilgang");

  useEffect(() => {
    if (isFirstRun.current) {
      console.debug({ isFirstRun: isFirstRun.current, isAuth });
      isFirstRun.current = false;
      dispatch(sjekkAuth());
      return;
    }
    console.debug({ isAuth });
    if (isAuth === false) {
      window.location.href = "/internal/login";
    }
  }, [isAuth]);

  useEffect(() => {
    if (adminEnabled !== undefined) {
      if (adminEnabled.isEnabled) {
        if (isDevLocation()) dispatch(hentMegHandling());
        else dispatch(hentMegUtenEnheterHandling());
      } else {
        dispatch(hentMegHandling());
      }
    }
  }, [adminEnabled]);

  useEffect(() => {
    const tilgangEnabled = featureToggles.features.find((f) => f?.navn === "klage.generellTilgang");
    if (tilgangEnabled?.isEnabled !== undefined) {
      settTilgang(tilgangEnabled.isEnabled);
    }
  }, [tilgangEnabled]);
  if (generellTilgang === undefined) {
    return <NavFrontendSpinner />;
  }
  if (!generellTilgang) {
    return <div>Beklager, men din bruker har ikke tilgang til denne siden</div>;
  }
  if (R.isEmpty(kodeverk) || R.isEmpty(person.graphData.id)) {
    return <NavFrontendSpinner />;
  }

  return (
    <>
      <main className={`main kontainer ${customClass}`} data-testid="klagesiden">
        <Header
          backLink={backLink ?? "/"}
          tittel="KABAL"
          brukerinfo={{ navn: person.graphData.navn, ident: person.graphData.id }}
        >
          {/* <Sok onSok={() => Promise.resolve("test")} /> */}
        </Header>
        <nav className={`main-nav ${!visMeny ? "skjult" : ""}`} role="navigation" aria-label="Meny">
          <ul>
            <li>
              <NavLink className="link" to="/oppgaver">
                Oppgaver
              </NavLink>
            </li>
            <li>
              <NavLink className="link" to="/mineoppgaver">
                Mine&nbsp;Oppgaver
              </NavLink>
            </li>
            <li>
              <NavLink className="link" to="/sok">
                Søk&nbsp;på&nbsp;person
              </NavLink>
            </li>
          </ul>
        </nav>
        {(() => {
          if (!visToaster.display) {
            return null;
          }
          return (
            <div
              role={"alert"}
              className="toaster"
              onClick={() => {
                dispatch(toasterSkjul(0));
              }}
            >
              <Alertstripe type={visToaster.type}>
                <span>{toastBeskjed}</span>
              </Alertstripe>
            </div>
          );
        })()}
        <article className={`content ${contentClass}`}>{children}</article>
      </main>
      <footer className="main-footer">Klagesaksbehandling</footer>
    </>
  );
}

Oppsett.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element.isRequired,
  ]),
};

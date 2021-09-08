import React, { useEffect, useRef, useState } from "react";
import { Header } from "./Header/Header";
import Alertstripe from "nav-frontend-alertstriper";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import * as R from "ramda";
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

interface LayoutType {
  visMeny: boolean;
  backLink?: string;
  customClass?: string;
  contentClass?: string;
  children: JSX.Element[] | JSX.Element;
}

export const OppgaverPage = (): JSX.Element => {
  return (
    <>
      <main className={`main kontainer`} data-testid="klagesiden">
        <nav className={`main-nav}`} role="navigation" aria-label="Meny">
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
        <pre>Hei jeg heter Gjermund og jobber på en knappefabrikk!</pre>
      </main>
      <footer className="main-footer">Klagesaksbehandling</footer>
    </>
  );
};

export default OppgaverPage;

import { IKlageState } from "../klage-reducer";
import { NavLink } from "react-router-dom";
import classNames from "classnames";
//@ts-ignore
import ExtLink from "../extlink.svg";
import React from "react";
import styled from "styled-components";

const Knapper = styled.div`
  display: flex;
  justify-content: space-between;
  border: 1px solid #e7e9e9;
  border-right: 0;
  border-bottom: 0;
  border-top: 0;
  padding: 1em;
`;
const Lenke = styled.a`
  margin: 0 0.25em 0 0.5em;
  white-space: nowrap;
  text-decoration: none;
  color: black;
`;
const Lenke2 = styled.a`
  position: relative;
`;
const Ikon = styled.img`
  position: absolute;
  margin: 0.35em 0 0 0.15em;
`;

const Knapperad = styled.div`
  display: block;
  width: 100%;
  margin: 0 0.5em;
`;

export default function EksterneLenker({
  klage_state,
  id,
}: {
  klage_state: IKlageState;
  id: string;
}) {
  return (
    <Knapper>
      <Knapperad>
        <Lenke
          target="_blank"
          aria-label={"Ekstern lenke til Gosys for denne personen"}
          href={`/gosys/personoversikt/fnr=`}
        >
          Gosys
        </Lenke>
        <Lenke2
          target="_blank"
          aria-label={"Ekstern lenke til Gosys for denne personen"}
          href={`/gosys/personoversikt/fnr=`}
        >
          <Ikon alt="Ekstern lenke" src={ExtLink} />
        </Lenke2>
      </Knapperad>

      <Knapperad>
        <Lenke
          target="_blank"
          aria-label={"Ekstern lenke til Gosys for denne personen"}
          href={`/gosys/personoversikt/fnr=`}
        >
          Vedtaksløsning og sak
        </Lenke>
        <Lenke2
          target="_blank"
          aria-label={"Ekstern lenke til Gosys for denne personen"}
          href={`/gosys/personoversikt/fnr=`}
        >
          <Ikon alt="Ekstern lenke" src={ExtLink} />
        </Lenke2>
      </Knapperad>

      <Knapperad>
        <Lenke
          target="_blank"
          aria-label={"Ekstern lenke til A-inntekt for denne personen"}
          href={`/gosys/personoversikt/fnr=`}
        >
          A-inntekt
        </Lenke>
        <Lenke2
          target="_blank"
          aria-label={"Ekstern lenke til Gosys for denne personen"}
          href={`/gosys/personoversikt/fnr=`}
        >
          <Ikon alt="Ekstern lenke" src={ExtLink} />
        </Lenke2>
      </Knapperad>

      <Knapperad>
        <Lenke
          target="_blank"
          aria-label={"Ekstern lenke til Modia for denne personen"}
          href={`/gosys/personoversikt/fnr=`}
        >
          Modia
        </Lenke>
        <Lenke2
          target="_blank"
          aria-label={"Ekstern lenke til Gosys for denne personen"}
          href={`/gosys/personoversikt/fnr=`}
        >
          <Ikon alt="Ekstern lenke" src={ExtLink} />
        </Lenke2>
      </Knapperad>
    </Knapper>
  );
}

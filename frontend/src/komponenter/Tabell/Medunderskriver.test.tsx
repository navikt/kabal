/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render } from '../../utility/test-util.jsx';
import Medunderskriver from './Medunderskriver';
import { screen } from '@testing-library/dom';

describe('Medunderskriver', () => {
  test('Vis "medunderskriver" som status', () => {
    const meg = {
      graphData: {
        id: 'saksbehandler1',
      },
    };
    const klagebehandlinger = {
      rader: [
        {
          id: 'abc',
          medunderskriverident: 'saksbehandler1',
          type: '',
          klagebehandlingVersjon: 1,
          tema: '',
          hjemmel: '',
          frist: '',
          mottatt: '',
          saksbehandler: 'saksbehandler1',
        },
      ],
      antallTreffTotalt: 1,
      start: 1,
      antall: 1,
      transformasjoner: {
        filtrering: {
          typer: [],
          temaer: [],
          hjemler: [],
        },
        sortering: {
          type: 'mottatt' as const,
          frist: 'stigende' as const,
          mottatt: 'stigende' as const,
        },
      },
    };

    const tableRow = document.createElement('tr');
    render(
      <Medunderskriver id={'abc'}>
        <td>Tomt innhold</td>
      </Medunderskriver>,
      {
        initialState: { klagebehandlinger, meg },
        container: document.body.appendChild(tableRow),
      }
    );
    const node = screen.getByTestId('abc-text');
    expect(node.textContent).toEqual('Medunderskriver');
  });

  test('Vis "sendt til medunderskriver" som status', () => {
    const meg = {
      graphData: {
        id: 'saksbehandler1',
      },
    };
    const klagebehandlinger = {
      rader: [
        {
          id: 'abc',
          medunderskriverident: 'saksbehandler2',
          type: '',
          klagebehandlingVersjon: 1,
          tema: '',
          hjemmel: '',
          frist: '',
          mottatt: '',
          saksbehandler: 'saksbehandler1',
        },
      ],
      antallTreffTotalt: 1,
      start: 1,
      antall: 1,
      transformasjoner: {
        filtrering: {
          typer: [],
          temaer: [],
          hjemler: [],
        },
        sortering: {
          type: 'mottatt' as const,
          frist: 'stigende' as const,
          mottatt: 'stigende' as const,
        },
      },
    };

    const tableRow = document.createElement('tr');
    render(
      <Medunderskriver id={'abc'}>
        <td>Tomt innhold</td>
      </Medunderskriver>,
      {
        initialState: { klagebehandlinger, meg },
        container: document.body.appendChild(tableRow),
      }
    );
    const node = screen.getByTestId('abc-text');
    expect(node.textContent).toEqual('Sendt til medunderskriver');
  });

  test('Vis default innhold hvis "medunderskriver"-status er ugyldig', () => {
    const meg = {
      graphData: {
        id: 'saksbehandler1',
      },
    };
    const klagebehandlinger = {
      rader: [
        {
          id: 'abc',
          medunderskriverident: '', //tom streng/null/falsy
          type: '',
          klagebehandlingVersjon: 1,
          tema: '',
          hjemmel: '',
          frist: '',
          mottatt: '',
          saksbehandler: '',
        },
      ],
      antallTreffTotalt: 1,
      start: 1,
      antall: 1,
      transformasjoner: {
        filtrering: {
          typer: [],
          temaer: [],
          hjemler: [],
        },
        sortering: {
          type: 'mottatt' as const,
          frist: 'stigende' as const,
          mottatt: 'stigende' as const,
        },
      },
    };

    const tableRow = document.createElement('tr');
    render(
      <Medunderskriver id={'abc'}>
        <td>Tomt innhold</td>
      </Medunderskriver>,
      {
        initialState: { klagebehandlinger, meg },
        container: document.body.appendChild(tableRow),
      }
    );
    const node = screen.findAllByText('Tomt innhold');
    expect(node).toBeTruthy();
  });
});

import React from 'react';

export const SearchResults = (personsoek: PersonSoekApiResponse) => (
  <div>
    <p>`Antall treff totalt: ${personsoek.antallTreffTotalt}`</p>
  </div>
);

const ResultList = (personer: IPersonResultat[]) => (
    <table className="tabell">
  <Rows/>
</table>
)

const Rows: React.FC<IPersonResultat[]> = () => (
    <tbody>
      {oppgaver.map((k) => (
        <tr>
          <td></td>
          {...k} key={k.id}
          </tr>
      ))}
    </tbody>
)
import { getHeaders } from '@app/headers';
import { INNSTILLINGER_BASE_PATH } from '@app/redux-api/common';
import { IUserData } from '@app/types/bruker';

const loadUser = async (attempt: number = 0): Promise<IUserData> => {
  const res = await fetch(`${INNSTILLINGER_BASE_PATH}/me/brukerdata`, {
    method: 'GET',
    headers: getHeaders(),
  });

  if (res.status === 401) {
    throw new Error('Ikke innlogget');
  }

  if (!res.ok) {
    console.error('Kunne ikke hente brukerdata', res.status, res.statusText);

    if (attempt >= 3) {
      throw new Error('Kunne ikke hente brukerdata');
    }

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        loadUser(attempt + 1)
          .then(resolve)
          .catch(reject);
      }, 1000);
    });
  }

  return await res.json();
};

export const user = loadUser();

import { defer, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { settOppAxios } from '../utility/axiosOppsett';

const axiosInstance = settOppAxios();

const get = <T>(url: string, queryParams?: object): Observable<T> =>
  defer(() => axiosInstance.get<T>(url, { params: queryParams })).pipe(map((result) => result.data));

const post = <T>(url: string, body: object, queryParams?: object): Observable<T | void> =>
  defer(() => axiosInstance.post<T>(url, body, { params: queryParams })).pipe(map((result) => result.data));

const put = <T>(url: string, body: object, queryParams?: object): Observable<T | void> =>
  defer(() => axiosInstance.put<T>(url, body, { params: queryParams })).pipe(map((result) => result.data));

const patch = <T>(url: string, body: object, queryParams?: object): Observable<T | void> =>
  defer(() => axiosInstance.patch<T>(url, body, { params: queryParams })).pipe(map((result) => result.data));

const deleteR = <T>(url: string, id: number): Observable<T | void> =>
  defer(() => axiosInstance.delete(`${url}/${id}`)).pipe(map((result) => result.data));

export default { get, post, put, patch, delete: deleteR };

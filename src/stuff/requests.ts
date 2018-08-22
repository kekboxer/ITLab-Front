import { AxiosResponse } from 'axios';

export const getResponseData = <T>(
  response: AxiosResponse<any>
): Promise<T> => {
  return new Promise((resolve, reject) => {
    const body = response && response.data;

    if (body && body.statusCode === 1 && body.data) {
      resolve(body.data as T);
    } else {
      reject();
    }
  });
};

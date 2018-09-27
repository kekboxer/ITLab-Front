import Vue from 'vue';
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

export const setOneElement = <T extends { id: string }>(
  array: T[],
  element: T
) => {
  const currentElementIndex = array.findIndex((value) => {
    return value.id === element.id;
  });

  if (currentElementIndex === -1) {
    array.push(element);
  } else {
    Vue.set(
      array,
      currentElementIndex,
      Object.assign({}, array[currentElementIndex], element)
    );
  }
};

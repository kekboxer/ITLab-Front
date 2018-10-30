import { AxiosResponse } from 'axios';

export class Response<T> {
  public data: T;
  public statusCode: number;

  constructor(axiosResponse: AxiosResponse<{ data: T; statusCode: number }>) {
    const body = axiosResponse.data;
    this.data = body.data;
    this.statusCode = body.statusCode;
  }
}

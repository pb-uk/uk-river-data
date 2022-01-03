import axios from 'axios';

export type RequestOptions = {
  path?: string;
  url?: string;
  params?: Record<string, unknown>;
};

const baseRequest = axios.create({
  baseURL: 'https://environment.data.gov.uk',
  timeout: 10000,
  headers: {
    accept: 'application/json',
  },
});

export function request<T>(options: RequestOptions = {}) {
  if (options.path) {
    options.url = options.path;
    delete options.path;
  }
  return baseRequest.request<T>(options);
}

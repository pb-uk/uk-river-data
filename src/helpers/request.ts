import axios from 'axios';

export type RequestOptions = {
  path?: string;
  url?: string;
  params?: Record<string, unknown>;
};

export type Response = {
  data: Record<string, unknown>;
};

const baseRequest = axios.create({
  baseURL: 'https://environment.data.gov.uk',
  timeout: 5000,
  headers: {
    accept: 'application/json',
  },
});

export function request(options: RequestOptions = {}): Promise<Response> {
  if (options.path) {
    options.url = options.path;
    delete options.path;
  }
  return baseRequest(options);
}

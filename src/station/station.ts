import { request } from '../api-client/request';

// Implement a global cache.

export interface StationInterface {
  id: string;
  name: string;
  // original: Record<string, unknown>,
}

type StationResponse = {
  items: Record<string, unknown>;
};

class Station implements StationInterface {
  _props: Record<string, unknown>;
  constructor(props: Record<string, unknown>) {
    this._props = props;
  }

  get id() {
    return `${this._props.stationReference}`;
  }

  get name() {
    return `${this._props.label}`;
  }
}

export const fetchStation = async (reference: string): Promise<Station> => {
  const path = `/flood-monitoring/id/stations/${reference}`;
  const params = {};
  // const response = await (options.request || request)({ path, params });
  const { data } = await request<StationResponse>({ path, params });
  return new Station(data.items);
};

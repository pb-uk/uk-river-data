import { request, RequestOptions, Response } from '../helpers/request';

/** Stations are stored as an object keyed by the station id. */
export type Stations = Record<string, StationData>;
export type StationData = {
  stationReference: string;
  status: string | null;
};

type StationsOptions = {
  request?: (options: RequestOptions) => Response;
};

/** Get a collection of stations. */
export const getStations = async (
  options: StationsOptions = {}
): Promise<Stations> => {
  try {
    const path = `/flood-monitoring/id/stations`;
    const params = {};
    const response = await (options.request || request)({ path, params });
    //const response: ReadingsResponse = await (options.request || request)({ path, params });
    return parseStationsResponse(response);
  } catch (err) {
    const e = new Error('Error requesting readings');
    // e.error = err;
    throw e;
  }
};

const fieldMappings: Record<string, Record<string, string>> = {
  status: {
    'http://environment.data.gov.uk/flood-monitoring/def/core/statusActive':
      'active',
    'http://environment.data.gov.uk/flood-monitoring/def/core/statusSuspended':
      'suspended',
    'http://environment.data.gov.uk/flood-monitoring/def/core/statusukcmf':
      'ukcmf',
    'http://environment.data.gov.uk/flood-monitoring/def/core/statusClosed':
      'closed',
  },
};

const parseStationsResponse = (response: Response): Stations => {
  // .@context
  // .meta
  // .items
  const { items } = response.data;
  if (!Array.isArray(items)) {
    throw new Error('API response has no items');
  }
  const mapped: Stations = {};
  items.forEach((item) => {
    const { stationReference, status } = item;
    // if (typeof dateTime !== 'string' || typeof value !== 'number') return;
    // if (mapped[id] == null) mapped[id] = [];

    mapped[stationReference] = {
      stationReference, // : `${stationReference}`,
      status:
        typeof status === 'string'
          ? fieldMappings.status[status] ?? status
          : null,
      // status: fieldMappings.status[status] ?? status,
    };
  });
  return mapped;
};

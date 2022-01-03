import { request, RequestOptions, Response } from '../helpers/request';

const measureTypeRegEx = /\/[^-/]*-([^/]*)$/;
const humanMeasureTypeMap: Record<string, string> = {
  'level-groundwater-i-15_min-m': 'groundwater',
  'rainfall-tipping_bucket_raingauge-t-15_min-mm': 'rainfall',
  'level-4-i-15_min-m': 'level',
  'level-1-i-15_min-mAOD': 'level',
  'level-1-i-15_min-m': 'level',
  'level-2-i-15_min-m': 'level',
  'level-3-i-15_min-m': 'level',
  'level-groundwater-i-15_min-mAOD': 'groundwater',
  'level-groundwater-i-1_h-mBDAT': 'groundwater',
  'level-groundwater-i-15_min-mBDAT': 'groundwater',
  'level-stage-i-15_min-m': 'level',
  'level-stage-i-15_min-mAOD': 'level',
  'temperature-dry_bulb-i-15_min-deg_C': 'temperature',
  'temperature-dry_bulb-i-1_h-deg_C': 'temperature',
};

const getHumanMeasureType = (stationMeasure: string): string => {
  const [, id] = stationMeasure.match(measureTypeRegEx) ?? [];
  return humanMeasureTypeMap[id] ?? id;
};

/** Stations are stored as an object keyed by the station id. */
export type Stations = Record<string, StationData>;
export type StationData = {
  stationReference: string;
  status: string | null;
  name: string;
  catchment: string;
  river: string;
  latlong: [number, number];
  measures: string[];
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
    const {
      catchmentName,
      stationReference,
      status,
      label,
      lat,
      long,
      riverName,
      measures,
    } = item;
    // if (typeof dateTime !== 'string' || typeof value !== 'number') return;
    // if (mapped[id] == null) mapped[id] = [];

    mapped[stationReference] = {
      // ...item,
      stationReference, // : `${stationReference}`,
      name: label,
      status:
        typeof status === 'string'
          ? fieldMappings.status[status] ?? status
          : null,
      catchment: catchmentName,
      river: riverName,
      latlong: [lat, long],
      measures: (measures ?? []).map(({ '@id': id }: { '@id': string }) => {
        return getHumanMeasureType(id);
      }),
    };
  });
  return mapped;
};

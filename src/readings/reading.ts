import { request } from '../api-client/request';

// Implement a global cache.

type SingleReading = [Date, number];

export type StationReadings = Record<string, SingleReading[]>;

type ReadingsResponse = {
  items: Array<{
    measure: string;
    dateTime: string;
    value: number;
  }>;
};

type ReadingsOptions = {
  limit?: number;
};

const readingsDefaults = {};

export const fetchStationReadings = async (
  stationReference: string,
  options: ReadingsOptions = {}
): Promise<StationReadings> => {
  const settings: ReadingsOptions = {
    ...readingsDefaults,
    ...options,
  };

  const since =
    new Date(Date.now() - MS_PER_DAY * 7).toISOString().substring(0, 19) + 'Z';
  const path = `/flood-monitoring/id/stations/${stationReference}/readings`;
  const params = {
    since,
    _sorted: '',
    _limit: 5000, // settings.limit,
  };

  // const response = await (options.request || request)({ path, params });
  const { data } = await request<ReadingsResponse>({ path, params });
  return parseReadingsResponse(data);
};

// Refactor after here.

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/*
@id: "http://environment.data.gov.uk/flood-monitoring/data/readings/3400TH-flow--i-15_min-m3_s/2021-12-31T02-15-00Z"
dateTime: "2021-12-31T02:15:00Z"
measure: "http://environment.data.gov.uk/flood-monitoring/id/measures/3400TH-flow--i-15_min-m3_s"
value: 138.3

@id: "http://environment.data.gov.uk/flood-monitoring/data/readings/3400TH-level-stage-i-15_min-mAOD/2021-12-31T02-15-00Z"
dateTime: "2021-12-31T02:15:00Z"
measure: "http://environment.data.gov.uk/flood-monitoring/id/measures/3400TH-level-stage-i-15_min-mAOD"
value: 4.699
*/

const parseReadingsResponse = (data: ReadingsResponse): StationReadings => {
  // .@context
  // .meta
  // .items
  const { items } = data;
  const mapped: StationReadings = {};
  items.forEach((item) => {
    const { measure, dateTime, value } = item;
    if (typeof dateTime !== 'string' || typeof value !== 'number') return;
    if (mapped[measure] == null) mapped[measure] = [];
    mapped[measure].push([new Date(dateTime), value]);
  });
  return mapped;
};

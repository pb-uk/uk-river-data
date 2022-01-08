import { parseMeasureUrl } from './measure';
import { request } from './request';

// Implement a global cache.

type StationMeasure = Record<string, unknown>;

type StationResponse = {
  items: Record<string, unknown>;
};

/*
  RLOIid?: string; // "7267"
  catchmentName?: string; // "Thames from Hurley to Teddington"
  dateOpened?: string; // "1983-01-01"
  eaAreaName?: string; // "Thames - West Thames"
  eaRegionName?: string; // "Thames"
  easting?: string; // 517700
  label: string; // "Kingston"
  lat?: string; // 51.415005
  long?: string; //  -0.308869
  measures: Array(3) [ {…}, {…}, {…} ]
  northing: 169800
  notation: "3400TH"
  riverName: "River Thames"
  stageScale: Object { "@id": "http://environment.data.gov.uk/flood-monitoring/id/stations/3400TH/stageScale", datum: 0, scaleMax: 6, … }
  stationReference: "3400TH"
  status: "http://environment.data.gov.uk/flood-monitoring/def/core/statusActive"
  town: "Kingston Upon Thames"
*/

export class Station {
  private _props: Record<string, unknown>;
  private _measures: Record<string, StationMeasure> | null = null;
  private _id: string | null = null;

  constructor(props: Record<string, unknown>) {
    this._props = props;
  }

  get id(): string {
    if (this._id === null) {
      const uri = `${this._props['@id']}`;
      this._id = uri.substring(uri.lastIndexOf('/'));
    }
    return this._id;
  }

  get measures(): Record<string, StationMeasure> {
    if (this._measures === null) {
      this._measures = parseRawStationMeasures(this._props.measures);
    }
    return this._measures;
  }

  get rawMeasures(): unknown {
    return `${this._props.measures}`;
  }

  get name(): string {
    return `${this._props.label}`;
  }
}

export const fetchStation = async (id: string): Promise<Station> => {
  const path = `/flood-monitoring/id/stations/${id}`;
  const params = {};
  // const response = await (options.request || request)({ path, params });
  const { data } = await request<StationResponse>({ path, params });
  return new Station(data.items);
};

export const parseRawStationMeasures = (
  rawMeasures: unknown
): Record<string, StationMeasure> => {
  if (!Array.isArray(rawMeasures)) return {};

  const measures: Record<string, StationMeasure> = {};
  rawMeasures.forEach((measure) => {
    if (typeof measure.latestReading === 'object') {
      // If a measure is no longer current the `latestReading` property
      // may be the URI of the last active reading.
      const { dateTime, value } = measure.latestReading;
      const { type, typeId, unit } = parseMeasureUrl(
        measure.latestReading.measure
      );
      if (measures[type] == null) {
        // Only set the first measure of this type.
        measures[type] = {
          typeId,
          dateTime: new Date(dateTime),
          value,
          unit,
        };
      }
    }
  });
  return measures;
};

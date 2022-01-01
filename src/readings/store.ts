import { ActionContext, MutationContext } from 'vuex';
import { request, RequestOptions, Response } from '../helpers/request';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

type ReadingsOptions = {
  request?: (options: RequestOptions) => Response,
};

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

// TODO rewrite for multiple stations.
const getSince = async (options: ReadingsOptions = {}): Promise<Response> => {
  try {
    const stationReference = '3400TH';
    const since =
      new Date(Date.now() - MS_PER_DAY * 7).toISOString().substring(0, 19) +
      'Z';
    /*
      new Date(Math.floor(Date.now() / DAY - 1) * DAY)
        .toISOString().substring(0, 19) + 'Z';
        */
    const path = `/flood-monitoring/id/stations/${stationReference}/readings`;
    const params = {
      since,
      _sorted: '',
      _limit: 500,
    };
    const response = await (options.request || request)({ path, params });
    //const response: ReadingsResponse = await (options.request || request)({ path, params });
    return response;

    /*
    mapTimeSeriesMeasures(
      response.data.items,
      this.measures,
      this.measuresMap,
      this.readings
    );
    return options.response ? [this.readings, response] : this.readings;
    */
  } catch (err) {
    const e = new Error('Error requesting readings');
    // e.error = err;
    throw e;
  }
};
type Readings = Record<string, Array<TimedReading>>;

type TimedReading = [
  // ISO DateTime.
  string,
  // Value.
  number,
];

const parseReadingsResponse = (response: Response): Readings => {
  // .@context
  // .meta
  // .items
  const { items } = response.data;
  if (!Array.isArray(items)) {
    throw new Error ('API response has no items');
  }
  const mapped: Record<string, Array<TimedReading>> = {};
  items.forEach((item) => {
    const { measure, dateTime, value } = item;
    if (typeof dateTime !== 'string' || typeof value !== 'number') return;
    if (mapped[measure] == null) mapped[measure] = [];
    mapped[measure].push([dateTime, value]);
  });
  return mapped;
};

export default {
  namespaced: true,
  state: () => {
    return {
      readings: {},
    };
  },

  mutations: {
    set(state, readings: Readings) {
      Object.entries(readings).forEach(([key, readingsOne]) => {
        if (!(key in state.readings)) {
          state.readings[key] = [];
        }
        readingsOne.forEach((reading) => {
          state.readings[key].push(reading)
        });
      });
    }
  },

  actions: {
    // Request some readings.
    get: async ({ commit }) => {
      const since = parseReadingsResponse(await getSince());
      commit('set', since);
      return since;
      // return Promise.resolve([123, 456]);
    },
  },
};

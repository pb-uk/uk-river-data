import {
  fetchPlotly,
  ChartSeriesType,
  ChartOptionsType,
  ChartAxisType,
  ChartLayoutType,
  ChartConfigType,
} from './chart';

export const createTimeSeriesChart = async (
  el: HTMLElement,
  data: ChartSeriesType,
  options: ChartOptionsType
) => {
  // props.data[0]
  const { newPlot } = await fetchPlotly();
  const layout: ChartLayoutType = {
    // margin: { t: 0 },
    xaxis: {
      autorange: true,

      // range: ['2015-02-17', '2017-02-16'],

      rangeselector: {
        buttons: [
          {
            count: 12,
            label: '12h',
            step: 'hour',
            stepmode: 'backward',
          },
          {
            count: 1,
            label: '1d',
            step: 'day',
            stepmode: 'backward',
          },
          {
            count: 7,
            label: '1w',
            step: 'day',
            stepmode: 'backward',
          },
          { step: 'all' },
        ],
      },

      // rangeslider: { range: ['2015-02-17', '2017-02-16'] },
      type: 'date',
    },
    ...(options.layout ?? {}),
  };
  const config: ChartConfigType = {
    responsive: true,
    ...(options.config ?? {}),
  };
  newPlot(el, data, layout, config);
};

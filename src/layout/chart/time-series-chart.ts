import {
  fetchPlotly,
  ChartSeries,
  ChartOptions,
  ChartAxisOptions,
  ChartLayoutOptions,
  ChartConfigOptions,
} from './chart';

export const createTimeSeriesChart = async (
  el: HTMLElement,
  series: ChartSeries[],
  options: ChartOptions
) => {
  // props.data[0]
  const { newPlot } = await fetchPlotly();
  const layout: ChartLayoutOptions = {
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
  const config: ChartConfigOptions = {
    responsive: true,
    ...(options.config ?? {}),
  };

  newPlot(el, series, layout, config);
};

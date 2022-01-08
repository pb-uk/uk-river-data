export type ChartAxisOptions = {
  title?: string;
  titlefont?: { color: string };
  tickfont?: { color: string };
  side?: string;
  overlaying?: string;
  showgrid?: boolean;
  autorange?: boolean;
  rangeselector?: Record<string, unknown>;
  type?: string; // e.g. `date`.
};

export type ChartConfigOptions = {
  name?: string;
  responsive?: boolean;
};

export type ChartLayoutOptions = {
  title?: {
    text: string;
  };
  xaxis?: ChartAxisOptions;
  yaxis?: ChartAxisOptions;
  name?: string;
};

export type ChartOptions = {
  layout?: ChartLayoutOptions;
  config?: ChartConfigOptions;
};

export type ChartSeries = {
  x: Date[];
  y: number[];
  type?: string;
  name?: string;
  yaxis?: string;
  fill?: string;
};

interface Plotly {
  newPlot: (
    el: HTMLElement,
    data: ChartSeries[],
    layout: Record<string, unknown>,
    config?: Record<string, unknown>
  ) => void;
}

const tryWindow = async (resolve: (v: Plotly) => void) => {
  if ('Plotly' in window) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore-next-line
    resolve(window.Plotly);
  } else {
    setTimeout(() => tryWindow(resolve), 200);
  }
};

export const fetchPlotly = async (): Promise<Plotly> => {
  return new Promise((resolve) => {
    tryWindow(resolve);
  });
};

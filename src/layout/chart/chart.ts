interface PlotlyInterface {
  newPlot: (
    el: HTMLElement | null,
    data: Record<string, unknown>,
    layout: Record<string, unknown>,
    config?: Record<string, unknown>
  ) => void;
}

const tryWindow = async (resolve: (p: PlotlyInterface) => void) => {
  if ('Plotly' in window) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore-next-line
    resolve(window.Plotly);
  } else {
    setTimeout(() => tryWindow(resolve), 200);
  }
};

export const fetchPlotly = async (): Promise<PlotlyInterface> => {
  return new Promise((resolve) => {
    tryWindow(resolve);
  });
};

export type ChartSeriesType = {
  x: Date[];
  y: number[];
  type?: string;
  name?: string;
  yaxis?: string;
};

export type ChartAxisType = {
  title?: string;
  titlefont?: { color: string };
  tickfont?: { color: string };
  side?: string;
  overlaying?: string;
  showgrid?: boolean;
};

export interface ChartLayoutType extends Record<string, unknown> {
  title?: string;
  yaxis?: ChartAxisType;
  name?: string;
}

export interface ChartConfigType extends Record<string, unknown> {
  name?: string;
}

export interface ChartLayoutType extends Record<string, unknown> {
  title?: string;
  yaxis?: ChartAxisType;
  name?: string;
}

export type ChartOptionsType = {
  layout?: ChartLayoutType;
  config?: ChartConfigType;
};

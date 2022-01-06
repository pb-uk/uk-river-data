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

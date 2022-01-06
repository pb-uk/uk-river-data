// Parse a measure URL from the api into usable elements.

//                       (.*\/)* Everything including the last `/`.
//                              ([^-]+)- The station reference.
//                                      ([^-]+)* The measure type.
const measureUrlRegEx = /(.*\/)*([^-]+)-(([^-]*)-.*)$/;

export const parseMeasureUrl = (
  url: string
): {
  stationReference: string;
  measureTypeExtended: string;
  measureType: string;
} => {
  const [, , stationReference, measureTypeExtended, measureType] =
    url.match(measureUrlRegEx) ?? [];
  return { stationReference, measureTypeExtended, measureType };
};

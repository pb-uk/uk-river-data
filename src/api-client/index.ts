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
  console.log('Parsing');
  const [, , stationReference, measureTypeExtended, measureType] =
    url.match(measureUrlRegEx) ?? [];
  console.log('Parsed');
  return { stationReference, measureTypeExtended, measureType };
};

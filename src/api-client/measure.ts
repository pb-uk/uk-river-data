// Parse a measure URL from the api into usable elements.

//                       .*\/ Ignore everything including the last `/`.
//                           ([^-]*) station reference
//                                   (([^-]*)-.*-([^-]+)) measure type id
//                                    ([^-]*) measure type
//                                            .* ignore
//                                               ([^-]*) unit
const measureUrlRegEx = /.*\/([^-]*)-(([^-]*)-.*-([^-]*))$/;

export const parseMeasureUrl = (
  url: string
): {
  stationReference: string;
  typeId: string;
  type: string;
  unit: string;
} => {
  const [, stationReference, typeId, type, unit] =
    url.match(measureUrlRegEx) ?? [];
  return { stationReference, typeId, type, unit };
};

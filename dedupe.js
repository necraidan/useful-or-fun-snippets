/**
 * Remove duplicate entries from array usin Map
 */
const dedupe = array => {
  return [...new Map(array.map(elt => [elt, true])).keys()];
};

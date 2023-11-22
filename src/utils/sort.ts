// Receives an array and an attribute and returns the array sorted.
export default function sort(
  list: unknown[],
  attributeName: string,
): unknown[] {
  return list.sort((a, b) => {
    if (a.attributes[attributeName] > b.attributes[attributeName]) {
      return 1;
    }
    if (a.attributes[attributeName] < b.attributes[attributeName]) {
      return -1;
    }
    return 0;
  });
}

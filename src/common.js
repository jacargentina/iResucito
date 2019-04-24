// @flow
// Utilerias comunes (no atadas a react-native ni a NodeJS)

export const asyncForEach = async (array: Array<any>, callback: Function) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

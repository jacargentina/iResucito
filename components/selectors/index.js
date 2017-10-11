import { createSelector } from 'reselect';

const getLists = state => state.ui.get('lists');

export const getProcessedLists = createSelector(getLists, lists => {
  var listNames = lists.keySeq().toArray();
  return listNames.map(name => {
    var list = lists.get(name);
    return {
      name: name,
      count: list.size
    };
  });
});

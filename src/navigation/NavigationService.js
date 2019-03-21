// @flow
import { StackActions, NavigationActions } from 'react-navigation';

let navigator;

function setTopLevelNavigator(navigatorRef) {
  navigator = navigatorRef;
}

function navigate(routeName, params) {
  navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params
    })
  );
}

function applyCancelHandler(router) {
  const defaultGetStateForAction = router.getStateForAction;
  router.getStateForAction = (action, state) => {
    if (state && action.type === NavigationActions.BACK) {
      if (state.routes[state.index].params) {
        var cancelHandler = state.routes[state.index].params.cancelHandler;
        if (typeof cancelHandler === 'function') {
          cancelHandler();
          return null;
        }
      }
    }
    return defaultGetStateForAction(action, state);
  };
}

function goMenu() {
  const resetAction = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'Menu' })]
  });
  navigator.dispatch(resetAction);
}

function dispatch(action: any) {
  navigator.dispatch(action);
}

// NavigationActions.navigate({
//   routeName: 'ListDetail',
//   params: { list: { name } }
// })

export default {
  navigate,
  setTopLevelNavigator,
  applyCancelHandler,
  goMenu,
  dispatch
};

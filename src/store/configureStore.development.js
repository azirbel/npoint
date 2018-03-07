import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { browserHistory } from "react-router";
import { routerMiddleware } from "react-router-redux";
import rootReducer from "../reducers";

const router = routerMiddleware(browserHistory);

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const enhancer = composeEnhancers(applyMiddleware(thunk, router));

export default function configureStore(initialState) {
  const store = createStore(rootReducer, initialState, enhancer);

  if (module.hot) {
    module.hot.accept(
      "../reducers",
      () => store.replaceReducer(require("../reducers")) // eslint-disable-line global-require
    );
  }

  return store;
}

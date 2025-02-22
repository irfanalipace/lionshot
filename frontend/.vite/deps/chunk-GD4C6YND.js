// node_modules/.pnpm/redux-thunk@2.4.2_redux@4.2.1/node_modules/redux-thunk/es/index.js
function createThunkMiddleware(extraArgument) {
  var middleware = function middleware2(_ref) {
    var dispatch = _ref.dispatch, getState = _ref.getState;
    return function(next) {
      return function(action) {
        if (typeof action === "function") {
          return action(dispatch, getState, extraArgument);
        }
        return next(action);
      };
    };
  };
  return middleware;
}
var thunk = createThunkMiddleware();
thunk.withExtraArgument = createThunkMiddleware;
var es_default = thunk;

export {
  es_default
};
//# sourceMappingURL=chunk-GD4C6YND.js.map

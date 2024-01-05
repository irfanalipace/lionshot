import {
  identifier_default,
  init_identifier
} from "./chunk-YS7ZXHZ4.js";
import {
  ThemeProvider_default,
  init_esm
} from "./chunk-MZL5JIU2.js";
import {
  require_jsx_runtime,
  require_prop_types
} from "./chunk-3OY6MCS2.js";
import {
  _extends,
  _objectWithoutPropertiesLoose,
  init_extends,
  init_objectWithoutPropertiesLoose
} from "./chunk-I3VG2RCT.js";
import {
  require_react
} from "./chunk-NBV6D2RD.js";
import {
  __toESM
} from "./chunk-ROME4SDB.js";

// node_modules/.pnpm/@mui+material@5.15.2_@emotion+react@11.11.3_@emotion+styled@11.11.0_@types+react@18.2.46_react-dom@18.2.0_react@18.2.0/node_modules/@mui/material/styles/ThemeProvider.js
init_extends();
init_objectWithoutPropertiesLoose();
var React = __toESM(require_react());
var import_prop_types = __toESM(require_prop_types());
init_esm();
init_identifier();
var import_jsx_runtime = __toESM(require_jsx_runtime());
var _excluded = ["theme"];
function ThemeProvider(_ref) {
  let {
    theme: themeInput
  } = _ref, props = _objectWithoutPropertiesLoose(_ref, _excluded);
  const scopedTheme = themeInput[identifier_default];
  return (0, import_jsx_runtime.jsx)(ThemeProvider_default, _extends({}, props, {
    themeId: scopedTheme ? identifier_default : void 0,
    theme: scopedTheme || themeInput
  }));
}
true ? ThemeProvider.propTypes = {
  /**
   * Your component tree.
   */
  children: import_prop_types.default.node,
  /**
   * A theme object. You can provide a function to extend the outer theme.
   */
  theme: import_prop_types.default.oneOfType([import_prop_types.default.object, import_prop_types.default.func]).isRequired
} : void 0;

export {
  ThemeProvider
};
//# sourceMappingURL=chunk-RRZZ4372.js.map

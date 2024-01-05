import {
  defaultTheme_default,
  init_defaultTheme
} from "./chunk-6XHE2BYH.js";
import {
  identifier_default,
  init_identifier
} from "./chunk-YS7ZXHZ4.js";
import {
  init_esm
} from "./chunk-MZL5JIU2.js";
import {
  useTheme_default
} from "./chunk-3OY6MCS2.js";
import {
  require_react
} from "./chunk-NBV6D2RD.js";
import {
  __toESM
} from "./chunk-ROME4SDB.js";

// node_modules/.pnpm/@mui+material@5.15.2_@emotion+react@11.11.3_@emotion+styled@11.11.0_@types+react@18.2.46_react-dom@18.2.0_react@18.2.0/node_modules/@mui/material/styles/useTheme.js
var React = __toESM(require_react());
init_esm();
init_defaultTheme();
init_identifier();
function useTheme() {
  const theme = useTheme_default(defaultTheme_default);
  if (true) {
    React.useDebugValue(theme);
  }
  return theme[identifier_default] || theme;
}

export {
  useTheme
};
//# sourceMappingURL=chunk-S2FQBMZT.js.map

/* global ace */

/* Copied from brace/theme/github.js and modified */

ace.define(
  'ace/theme/npoint',
  ['require', 'exports', 'module', 'ace/lib/dom'],
  function(acequire, exports, module) {
    exports.isDark = false
    exports.cssClass = 'ace-npoint'
    exports.cssText = require('./npointAceTheme.css')

    var dom = acequire('../lib/dom')
    dom.importCssString(exports.cssText, exports.cssClass)
  }
)

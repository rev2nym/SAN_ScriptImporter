(function() {
'use strict';

var imports = [
    "js/plugins/TestScripts_2/TestScript_2_1.js",
    "js/plugins/TestScripts_2/TestScript_2_2.js"
];

var body = function() {
'use strict';
console.trace();
};

ScriptImporter.add(imports, body);
})();

function ca_getStyle(file) {
    $("<link/>", {
       rel: "stylesheet",
       type: "text/css",
       href: "http://www.mattkenefick.com/_code/codearea/" + file
    }).appendTo("head");
}
function ca_getScript(file, cb) {
    $.getScript('http://www.mattkenefick.com/_code/codearea/' + file, cb);
}

if (!window['$'] || !window['jQuery']) {
    console.log("jQuery is required for CodeArea.");
}
else {
    var CODEAREA_SCRIPT = true;
    var CODEAREA_THEME  = 'monokai';

    // style assets
    ca_getStyle("style/main.css");
    ca_getStyle("editor/lib/codemirror.css");
    ca_getStyle("editor/theme/" + CODEAREA_THEME + ".css");

    // script assets
    ca_getScript('editor/lib/codemirror.js', function() {
        ca_getScript("editor/mode/clike/clike.js");
        ca_getScript("editor/mode/css/css.js");
        ca_getScript("editor/mode/htmlmixed/htmlmixed.js");
        ca_getScript("editor/mode/javascript/javascript.js");
        ca_getScript("editor/mode/less/less.js");
        ca_getScript("editor/mode/mysql/mysql.js");
        ca_getScript("editor/mode/php/php.js");
        ca_getScript("editor/mode/python/python.js");
        ca_getScript("editor/mode/ruby/ruby.js");
        ca_getScript("editor/mode/shell/shell.js");
        ca_getScript("editor/mode/xml/xml.js", function () {
            ca_getScript('script/main.js');
        });
      });
}
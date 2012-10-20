var CodeArea = new(function() {

    // constants
    var MAX_WIDTH = 200;
    var MIN_WIDTH = 24;

    // private
    var _self = this;
    var _editor;
    var _lang = {
        "clike"      : "C",
        "css"        : "CSS",
        "htmlmixed"  : "HTML",
        "javascript" : "Javascript",
        "less"       : "LESS",
        "mysql"      : "MySQL",
        "php"        : "PHP",
        "python"     : "Python",
        "ruby"       : "Ruby",
        "shell"      : "Shell"
    };
    var _themes = {
        'ambiance'    : "Ambiance",
        'blackboard'  : "Blackboard",
        'cobalt'      : "Cobalt",
        'eclipse'     : "Eclipse",
        'elegant'     : "Elegant",
        'erlang-dark' : "Erlang Dark",
        'lesser-dark' : "Lesser Dark",
        'monokai'     : "Monokai",
        'neat'        : "Neat",
        'night'       : "Night",
        'rubyblue'    : "Ruby Blue",
        'vibrant-ink' : "Vibrant Ink",
        'xq-dark'     : "XQ Dark"
    };
    var _theme = 'monokai';

    // public
    this.name = CodeArea;


    // Public Methods ________________________________________

    /**
     * Function: bind
     *
     * Binds a live event to the body tag so we can cover all
     * dynamic creation of textareas... including new forms.
     *
     * Returns:
     *
     *   return void
     */
    this.bind = function bind() {
        $('body').on('mouseenter', 'textarea', _onTextareaMouseEnter);

        chrome.extension.onMessage.addListener(function(message, sender, sendResponse) {
            console.log("Received theme: ", message.theme);
            _theme = message.theme;

            if (_editor) {
                _editor.setOption("theme", _theme);
            }
        });
    };

    /**
     * Function: cssSetup
     *
     * Some files in Chrome Extensions aren't accessible with relative
     * CSS urls for repeating and such. To solve this, we assign dynamically
     * where we have access to chrom.extension.getURL
     *
     * Parameters:
     *
     *   icon - [jQuery element]
     *
     * Returns:
     *
     *   return icon
     */
    this.cssSetup = function(icon) {
        icon.css('background-image', "url('" + chrome.extension.getURL('/images/bg24.png') + "')");
        icon.find('i').css('background-image', "url('"  + chrome.extension.getURL('/images/icon24.png') + "')");
        return icon;
    };

    /**
     * Function: createIcon
     *
     * Main method to create icon each time a textarea is rolled over.
     * The icon is later destroyed on roll out.
     *
     * Parameters:
     *
     *   $textarea - [jQuery element]
     *   id        - [string]
     *
     * Returns:
     *
     *   return icon
     */
    this.createIcon = function createIcon($textarea, id) {
        // don't create if exists
        if ($('caIcon' + id).size())
            return false;

        // build main object
        var icon = $('<div></div>')
            .addClass("ca-icon")
            .html([
                "<i></i><span>Select Language</span>",
                "<ul>",
                $.map(_lang, function(v, k) {
                    return "<li id='" + k + "'>" + v + "</li>";
                }).join(''),
                "</ul>"
            ].join(''))
            .appendTo($textarea.parent());

        // position object, we also use this for specific css targeting
        icon
            .css({
                left   : $textarea.offset().left,
                top    : $textarea.offset().top + $textarea.outerHeight() - icon.outerHeight(),
                zIndex : 9999
            })
            .attr({
                "data-ca" : id,
                "id"      : "caIcon" + id
            })
            .on('mouseenter', _onIconEnter)
            .on('mouseleave', _onIconLeave)
            .find('li')
                .click(_onIconItemClick);

        return icon;
    };


    // Event Handlers _______________________________________
    //
    function _onTextareaMouseEnter() {
        var icon,
            id = Math.floor(Math.random() * 1000);

        // set ID
        $(this).attr('data-ca', id);
        icon  = _self.createIcon($(this), id);
                _self.cssSetup(icon);

        /**
         * Attaching to the parent may cause problems or strangeness
         * if there are multiple textareas in the same scope. However,
         * we don't want to wrap elements and ruin the integrity of the
         * DOM. TODO later.
         */
        $(this).parent().bind('mouseleave', function() {
            $('#caIcon' + id).remove();
            $(this).unbind('mouseleave');
        });
    };

    function _onIconEnter() {
        $(this).css('width', MAX_WIDTH + 'px');
    };

    function _onIconLeave() {
        $(this).css('width', MIN_WIDTH + 'px');
    };

    function _onIconItemClick() {
        var el,
            id = $(this).attr('id'),
            options = {
                tabSize: 4,
                lineNumbers: true,
                matchBrackets: true
            };

        // fresh code mirror to prevent overlap in syntax highlighting
        create_codemirror();

        // load setup params
        switch (id) {
            case 'php':
                load_xml(); load_javascript(); load_css(); load_clike();
                options.mode = "application/x-httpd-php";
                break;

            case 'htmlmixed':
                load_xml(); load_javascript(); load_css();
                options.mode = "text/html";
                break;

            case 'mysql':
                options.mode = "text/x-mysql";
                break;

            case 'python':
                options.mode = {name: "python",
                               version: 2,
                               singleLineStringErrors: false};
                break;

            case 'ruby':
                options.mode = "text/x-ruby";
                break;

            case 'shell':
                options.mode = 'shell';
                break;
        };

        // load language
        window['load_' + id]();

        // yeah yeah its ugly. works fine cause we build syntax here.
        el = $('textarea[data-ca=' + $(this).parent().parent().data('ca') +']').get(0);

        // create the actual area
        _editor = CodeMirror.fromTextArea(el, options);
        _editor.setOption("theme", _theme);

        // remove icon
        $(this).parent().parent().remove();
    };
})();

// Start.
CodeArea.bind();
console.log("CodeArea enabled.");

function addScript(scriptURL, onload) {
   var script = document.createElement('script');
   script.setAttribute("type", "application/javascript");
   script.setAttribute("src", scriptURL);
   if (onload) script.onload = onload;
   document.documentElement.appendChild(script);
}

var TAE = new(function() {

    // private
    var _self = this;

    // public
    this.name = TAE;


    // Public Methods ________________________________________
    //
    this.bind = function bind() {
        $('form').on('mouseenter', 'textarea', _onTextareaMouseEnter);
    };

    this.createIcon = function createIcon($textarea, id) {
        // var imgURL = chrome.extension.getURL("images/icon24.png");

        var icon = $('<div></div>')
            .addClass("tae-icon")
            .html([
                "<i></i><span>Convert to CodeArea</span><ul>",
                "<li id='clike'>C</li>",
                "<li id='css'>CSS</li>",
                "<li id='htmlmixed'>HTML</li>",
                "<li id='javascript'>Javascript</li>",
                "<li id='less'>LESS</li>",
                "<li id='mysql'>MySQL</li>",
                "<li id='php'>PHP</li>",
                "<li id='python'>Python</li>",
                "<li id='ruby'>Ruby</li>",
                "<li id='shell'>Shell</li>",
                "</ul>"].join(''))
            .appendTo($textarea.parent());
        icon
            .css({
                left: $textarea.offset().left,
                top : $textarea.offset().top + $textarea.outerHeight() - icon.outerHeight()
                // background: "url('" + imgURL + "') left bottom no-repeat"
            })
            .attr({
                "data-tae": id,
                "id": "taeIcon" + id
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
        var $this = $(this);
        var id = Math.floor(Math.random() * 1000);

        // corresponding button already exists
        if ($this.data('tae') && $('#taeIcon' + $this.data('tae')).size()) {
            return false;
        }

        $this.attr('data-tae', id);
        _self.createIcon($this, id);

        // this may show problems later
        $this.parent().bind('mouseleave', function(e) {
            $('#taeIcon' + id).remove();
            $(this).unbind('mouseleave');
        });
    };

    function _onIconEnter() {
        $(this).css('width', '200px');
    };

    function _onIconLeave() {
        $(this).css('width', '24px');
    };

    function _onIconItemClick() {
        var id = $(this).attr('id');
        var options = {
            lineNumbers: true,
            tabSize: 4,
            matchBrackets: true
        };

        // fresh code
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

        var el = $('textarea[data-tae=' + $(this).parent().parent().data('tae') +']').get(0);
        var editor = CodeMirror.fromTextArea(el, options);
        editor.setOption("theme", "ambiance");

        // remove icon
        $(this).remove();
    };
})();

// Start.
TAE.bind();
console.log("TextAreaEditor enabled.");

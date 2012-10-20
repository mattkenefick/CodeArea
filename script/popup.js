
function onSelect() {
    alert("Selected");
}

function sendMessage() {
    var theme = this.value;

    console.log( "Selecting theme: ", theme );

    chrome.tabs.getSelected(null, function(tab) {
        chrome.tabs.sendMessage(tab.id, {theme: theme}, function(response) {
            console.log(response);
        });
    });
};

document.addEventListener('DOMContentLoaded', function () {
    var theme = document.getElementById('theme');
        theme.addEventListener('change', sendMessage);
});
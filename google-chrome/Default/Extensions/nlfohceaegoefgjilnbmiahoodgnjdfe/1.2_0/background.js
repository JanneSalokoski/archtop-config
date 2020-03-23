chrome.app.runtime.onLaunched.addListener(function() {
    createAppWindow();
});

chrome.runtime.onMessageExternal.addListener(function (request, sender, sendResponse) {
    console.log(request);
    if (chrome.app.window.get("MainWindow") == null) {
        createAppWindow(function (createdWindow) {
            createdWindow.contentWindow.launchUrl = request.data.url;
            createdWindow.contentWindow.launchContent = request.data.content;
        });
    }
});

function createAppWindow(callback) {
    chrome.app.window.create('window.html', {
        id: "MainWindow",
        innerBounds: {
            width: 900,
            height: 600
        }
    }, callback);
}
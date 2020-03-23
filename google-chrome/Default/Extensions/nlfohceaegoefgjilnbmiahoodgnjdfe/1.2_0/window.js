function generateScriptText(fn) {
    var fnText = fn.toString()
      .replace(/"/g, '\\"')           // Escape double-quotes.
      .replace(/(\r?\n|\r)/g, '\\n'); // Insert newlines correctly.

    var scriptText =
        '(function() {\n' +
        '  var script = document.createElement("script");\n' +
        '  script.innerHTML = "(function() { ' + fnText + ' })()" \n' +
        '  document.body.appendChild(script);\n' +
        '})()';
    return scriptText;
}

function generateScriptText2(fn) {
    var fnText = fn.toString()
      .replace(/"/g, '\\"')           // Escape double-quotes.
      .replace(/(\r?\n|\r)/g, '\\n'); // Insert newlines correctly.


    var jQueryText =
        '(function() {\n' +
        '  var script = document.createElement("script");\n' +
        '  script.src = "https://code.jquery.com/jquery-2.1.4.min.js" \n' +
        '  script.onload = function(){ '+ fnText +'} \n' +
        '  document.head.appendChild(script);\n' +
        '})() ';

    return jQueryText;
}






window.addEventListener('load', function () {
   
    var webview = document.querySelector('webview');

    //webview.addEventListener('loadstart', function () {
    //    webview.executeScript({ file: "code.js" });
    //    //        webview.executeScript({ code: generateScriptText2("document.body.innerHTML='';   $('<style type=\"text/css\">html,body{height:100%;margin:0;}object,iframe{ width: 100% !important;height: 100% !important; }</style>').appendTo(document.head); $('" + launchContent + "').appendTo('body');") }, function () {

    //    //            document.querySelector('#ind').style.display = "none";
    //    //            document.querySelector('webview').style.display = "";

    //    //        });
    //});
    
    webview.addEventListener('contentload', function () {
        webview.executeScript({ file: "app.js" }, function () {
            setTimeout(function () {
                document.querySelector('#ind').style.display = "none";
                document.querySelector('webview').style.display = "";
            },800);
        });
    });


    if (window.launchUrl != undefined) {
        console.log("loading" + launchUrl);
        loadVideo(launchUrl);
    } else {
        chrome.storage.sync.get("vp-video-url", function (data) {
            var url = data["vp-video-url"];
            loadVideo(url);
        });
    } 
       
});



chrome.runtime.onMessageExternal.addListener(function (request, sender, sendResponse) {
    loadVideo(request.data.url);
});


function loadVideo(url) {
    chrome.storage.sync.set({ 'vp-video-url': url }, function() {
        console.log("setting");
    });

    var webview = document.querySelector('webview');
    webview.setAttribute("src", url);

    document.querySelector('webview').style.display = "none";
    document.querySelector('#ind').style.display = "";
}

var kHiddenWindowDelay = 3000;
var kDefaultWidth = 900;
var kDefaultHeight = 600;
chrome.app.window.current().setAlwaysOnTop(true);
// Utils:


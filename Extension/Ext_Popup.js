
/**Injects a function as plain code */
function InjectCode(tabId, func, callback) {
    var code = JSON.stringify(func.toString());
    code = code.slice(code.indexOf('{') + 1, code.length - 2);
    var code = 'var script = document.createElement("script");' +
        'script.innerHTML = "' + code + '";' +
        'document.body.appendChild(script)';
    chrome.tabs.executeScript(tabId, { code: code },
        function () {
            if (callback)
                return callback.apply(this, arguments);
        });
}

//Start
document.getElementById("btnStart").addEventListener("click", e => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs)  {
        InjectCode(tabs[0].id, CursedStarter);
    });
});

//Stop
document.getElementById("btnStop").addEventListener("click", e => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs)  {
        InjectCode(tabs[0].id, CursedStopper);
    });
});
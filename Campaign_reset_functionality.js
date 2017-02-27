function resetLocalStorage(campaignId, resetTime) {
    var localStorageObj = "";  
    for(var item in localStorage) {
        if(item.match(campaignId)) { 
            localStorageObj = item;
        }
    }
    var localStorageArray = localStorage.getItem(localStorageObj).split('/');
    localStorageArray.splice(5, 2, "", Date.now() + resetTime);
    localStorageStr = localStorageArray.join('/');
    localStorage.setItem(localStorageObj, localStorageStr);
}

usabilla_live("setEventCallback", function(category, action, label, value) {
    if (action != "Campaign:Open") {
        return;
    }
    window.addEventListener("message", function(event) {
        // Listen to messages from the Usabilla Cloudfront domain
        if (!/d6tizftlrpuof\.cloudfront\.net/.test(event.origin)) {
            return;
        }
        try {
            var data = JSON.parse(event.data);
            // On the final page
            if (data.type === "pageSwitch" && data.end) {                
                if (data.data.checkbox == "true") { //Change "checkbox" and true" to your "remind me later" value as specified in the Usabilla interface
                    setTimeout(function() {
                        resetLocalStorage(label, 172800);
                    }, 300);
                }
            }
        } catch (e) {
            // Ignore errors, usually JSON decode problems
        }
    });
});
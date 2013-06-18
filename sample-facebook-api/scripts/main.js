// This sample is using jso.js from https://github.com/andreassolberg/jso

var deviceready = function() {

    var debug = true,
        cmdLogin = document.getElementById("cmdLogin"),
        cmdWipe = document.getElementById("cmdWipe"),
        cmdPost = document.getElementById("cmdPost"),
     cmdGetFeed = document.getElementById("cmdGetFeed"),
        cmdDelete = document.getElementById("cmdDelete"),
        cmdClearLog = document.getElementById("cmdClearLog"),
        inAppBrowserRef;
    
    jso_registerRedirectHandler(function(url) {
        inAppBrowserRef = window.open(url, "_blank");
        inAppBrowserRef.addEventListener('loadstop', function(e){LocationChange(e.url)}, false);
    });

    /*
* Register a handler that detects redirects and
* lets JSO to detect incomming OAuth responses and deal with the content.
*/
    
    function LocationChange(url){
        console.log("in location change");
        url = decodeURIComponent(url);
        console.log("Checking location: " + url);

        jso_checkfortoken('facebook', url, function() {
            console.log("Closing InAppBrowser, because a valid response was detected.");
            inAppBrowserRef.close();
        });
    };

    /*
* Configure the OAuth providers to use.
*/
    jso_configure({
        "facebook": {
            client_id: "537761576263898",
            redirect_uri: "http://www.facebook.com/connect/login_success.html",
            authorization: "https://www.facebook.com/dialog/oauth",
            presenttoken: "qs"
        }
    }, {"debug": debug});
    
    // jso_dump displays a list of cached tokens using console.log if debugging is enabled.
    jso_dump();
    
    cmdClearLog.addEventListener("click", function() {
        console.clear();
    });
    
    cmdDelete.addEventListener("click", function() {
console.log("delete permissions");
       
        $.oajax({
            type: "DELETE",
            url: "https://graph.facebook.com/me/permissions",
            jso_provider: "facebook",
            jso_allowia: true,
            dataType: 'json',
            success: function(data) {
                console.log("Delete response (facebook):");
                console.log(data);
            },
            error: function(e) {
                console.log(e);
            }
        });

        console.log("wipe tokens");
       jso_wipe();
    });
    
    cmdLogin.addEventListener("click", function() {
        // For debugging purposes you can wipe existing cached tokens...
        jso_ensureTokens({
                "facebook": ["read_stream", "publish_stream"]
            });
    });
    
    cmdWipe.addEventListener("click", function() {
        // For debugging purposes you can wipe existing cached tokens...
        
        console.log("wipe tokens");
        jso_wipe();
    });
    
    cmdGetFeed.addEventListener("click", function() {
        console.log("Loading home feed...");
        // Perform the protected OAuth calls.
        $.oajax({
            url: "https://graph.facebook.com/me/home",
            jso_provider: "facebook",
            jso_scopes: ["read_stream", "publish_stream"],
            jso_allowia: true,
            dataType: 'json',
            success: function(data) {
                var i, l, item;
                console.log("Response (facebook):");
                //console.log(data.data);
                try {
                    for ( i = 0, l = data.data.length; i < l; i++) {
                        item = data.data[i];
                        console.log("\n");
                        console.log(item.story || [item.from.name,":\n", item.message].join("") );
                    }
                }
                catch (e) {
                    console.log(e);
                }
            }
        });
    });

    cmdPost.addEventListener("click", function() {
        console.log("Post to wall...");
        // Perform the protected OAuth calls.
        $.oajax({
            type: "POST",
            url: "https://graph.facebook.com/me/feed",
            jso_provider: "facebook",
            jso_scopes: ["read_stream", "publish_stream"],
            jso_allowia: true,
            dataType: 'json',
            data: {
                message: "WOW with my Icenium mobile application I can post to my Facebook wall!",
                link: "http://icenium.com/?utm_source=facebook&utm_medium=post&utm_campaign=sampleapp",
                picture: "http://www.icenium.com/iceniumImages/features-main-images/how-it-works.png"
            },
            success: function(data) {
                console.log("Post response (facebook):");
                console.log(data);
            },
            error: function(e) {
                console.log(e);
            }
        });
    });
};

console.log = function (m) {
    var resultsField = document.getElementById("result");
    resultsField.innerText += typeof m === 'string' ? m : JSON.stringify(m);
    resultsField.innerText += '\n';
}

console.clear = function () {
    var resultsField = document.getElementById("result");
    resultsField.innerText = "";
}

document.addEventListener('deviceready', this.deviceready, false);

//Activate :active state
document.addEventListener("touchstart", function() {}, false);
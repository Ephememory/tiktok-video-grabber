chrome.action.onClicked.addListener(handle_action_clicked); //connect the function to handle clicking the extension icon.

//This function just finds the (one) <video> HMTL element on the 
//TikTok web page, and returns the video mp4 url.
//Yes you need to use "chrome.scripting" to inject into
//the context that lets you access the document.
let stupid_func = function () {
    let videos = document.getElementsByTagName('video');
    let video = videos.item(0);

    if (video) {
        let vidSrc = video.getAttribute("src");
        if (vidSrc) {
            return vidSrc;
        }
    }
}

//The icon click event function
let handle_action_clicked = function () {

    getCurrentTab().then(tab => {
		if(tab === undefined) return;
        if (!tab.url.includes("tiktok.com")) return;

        const tabId = tab.id;
        chrome.scripting.executeScript(
            {
                target: { tabId: tabId, allFrames: true },
                func: stupid_func,
            },
            (callback) => {
                let url = callback[0].result;
                if (url) {
                    chrome.tabs.create({ url: url });
                }
            });
    });
}

async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}
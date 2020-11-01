class FrameManager {
    static async getFrames() {
        let currentTabId = await FrameManager.#getCurrentTabId();
        return await FrameManager.#getFramesForTab(currentTabId);
    }

    static async #getFramesForTab(tab) {
        let message = {  
            action: 'openPopup'
        };

        let dirtyFrames = await chrome.tabs.sendMessage(tab, message);
        if (!dirtyFrames) {
            return null;
        }

        return await FrameManager.#generateFrames(dirtyFrames);
    }

    static async #generateFrames(dirtyFrames) {
        let frames = []; 

        for (const dirtyFrame of dirtyFrames) {
            frames.push({
                title: dirtyFrame.title,
                page: UrlUtil.getPage(dirtyFrame.url),
                params: Array.from(UrlUtil.getParams(dirtyFrame.url))
            });
        }

        return frames;
    }
    

    static async #getCurrentTabId() {
        const tabsQuery = { 
            currentWindow: true, 
            active: true
        };
    
        let tabs = await chrome.tabs.query(tabsQuery);
        return tabs[0].id;
    }
}
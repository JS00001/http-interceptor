import CDP from "chrome-remote-interface";

import { GREEN, YELLOW, RED } from "./util";

const activeTabs = new Map();

/**
 * Start listening to the browser for any changes to tabs. When a tab is created or destroy, start or stop
 * listening to its network traffic
 */
async function connectToChrome() {
  try {
    const client = await CDP({ port: 9222 }); // connects to localhost:9222 by default
    const { Target } = client;

    await Target.setDiscoverTargets({ discover: true });
    const { targetInfos } = await Target.getTargets();

    for (const targetInfo of targetInfos) {
      if (targetInfo.type === "page" && !activeTabs.has(targetInfo.targetId)) {
        await connectToTarget(targetInfo.targetId, targetInfo.url);
      }
    }

    // Listen for new tabs. Wait 500ms to make sure tab is fully loaded
    Target.targetCreated(async ({ targetInfo }) => {
      if (targetInfo.type === "page" && !activeTabs.has(targetInfo.targetId)) {
        setTimeout(() => {
          return connectToTarget(targetInfo.targetId, targetInfo.url);
        }, 500);
      }
    });

    // Listen for tabs closing, so we can clean up
    Target.targetDestroyed(async ({ targetId }) => {
      if (activeTabs.has(targetId)) {
        const connection = activeTabs.get(targetId);
        connection.close();
        activeTabs.delete(targetId);
        console.log(`${YELLOW} Tab closed: ${targetId}`);
      }
    });

    // Listen for tab changes
    Target.targetInfoChanged(async ({ targetInfo }) => {
      if (targetInfo.type === "page" && !activeTabs.has(targetInfo.targetId)) {
        await connectToTarget(targetInfo.targetId, targetInfo.url);
      }
    });

    console.log(`${GREEN} Chrome connected, listening to all network events`);
    return true;
  } catch (err: any) {
    console.log(`${RED} Failed to connect to Chrome: ${err.message}`);
    return false;
  }
}

/**
 * Start listening to a specific tab. When the tab is closed, stop listening
 */
async function connectToTarget(targetID: string, targetURL = "unknown") {
  try {
    const client = await CDP({ target: targetID });
    const { Network, Page, Fetch } = client;

    await Network.enable();
    await Page.enable();

    Network.requestWillBeSent((params) => {
      const { method, url, headers, postData } = params.request;
    });

    activeTabs.set(targetID, client);

    console.log(`${GREEN} Connected to target: ${targetURL}`);

    client.on("disconnect", () => {
      console.log(`${YELLOW} Disconnected from target: ${targetURL}`);
      activeTabs.delete(targetID);
    });

    return client;
  } catch (err: any) {
    // prettier-ignore
    console.log(`${RED} Failed to connect to target ${targetID}: ${err.message}`);
    return null;
  }
}

async function listenToNetwork() {
  let attempts = 0;
  while (attempts < 10) {
    const success = await connectToChrome();
    if (success) break;
    await new Promise((resolve) => setTimeout(resolve, 1000 * attempts));
    console.log(`${YELLOW} Attempt ${attempts} failed. Retrying...`);
    attempts++;
  }

  if (attempts === 10) {
    console.log(`${RED} Failed to connect to Chrome`);
  }
}

export default { listenToNetwork };

import chrome from "./lib/chrome";
import websocket from "./lib/websocket";

function main() {
  websocket.start();
  chrome.listenToNetwork();
}

main();

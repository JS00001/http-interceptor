import CDP from "chrome-remote-interface";

async function main() {
  let attempts = 0;

  while (attempts < 10) {
    const success = await connectToChrome();
    if (success) break;
    await new Promise((resolve) => setTimeout(resolve, 1000 * attempts));
    console.log(`🟠 Attempt ${attempts} failed. Retrying...`);
    attempts++;
  }
}

async function connectToChrome() {
  try {
    const client = await CDP({ port: 9222 }); // connects to localhost:9222 by default

    const { Network, Page } = client;

    await Network.enable();
    await Page.enable();

    Network.requestWillBeSent((params) => {
      const { method, url } = params.request;
      console.log(`[${method}] ${url}`);
    });

    console.log(
      "🟢 Chrome request interceptor started. Waiting for requests..."
    );

    return true;
  } catch (err) {
    return false;
  }
}

main();

import Protocol from 'devtools-protocol';

export const getRequestParams = (request: Protocol.Network.Request) => {
  const reqParams = {};

  // Get URL params and store them
  const parsedUrl = new URL(request.url);
  const queryParams = new URLSearchParams(parsedUrl.search);

  Object.assign(reqParams, Object.fromEntries(queryParams.entries()));

  if (request.hasPostData && request.postData) {
    Object.assign(reqParams, JSON.parse(request.postData));
  }

  return reqParams;
};

import Protocol from 'devtools-protocol';
import { InterceptorRuleOperator, NetworkEvent } from '../types';

export const RED = '🔴';
export const GREEN = '🟢';
export const YELLOW = '🟡';

type ParsedRequestParams = {
  queryParams: Record<string, any>;
  postData: Record<string, any>;
  postDataType: 'json' | 'form-data' | null;
};

/**
 * Take a CDP request, and convert both its query params and post data
 * into a combined object
 */
export const getRequestParams = (request: Protocol.Network.Request) => {
  const reqParams: ParsedRequestParams = {
    queryParams: {},
    postData: {},
    postDataType: null,
  };

  // Get URL params and store them
  const parsedUrl = new URL(request.url);
  const queryParams = new URLSearchParams(parsedUrl.search);
  reqParams.queryParams = Object.fromEntries(queryParams.entries());

  // Get the post data and store it
  if (request.hasPostData && request.postData) {
    const jsonPayload = parseJSON(request.postData);

    if (jsonPayload) {
      reqParams.postDataType = 'json';
      reqParams.postData = jsonPayload;
      return reqParams;
    }

    // We need to handle multipart form data if the body is not already a JSON payload
    const boundary = getBoundary(request);

    if (boundary) {
      const formData = parseFormData(request.postData, boundary);
      reqParams.postDataType = 'form-data';
      reqParams.postData = formData;
    }
  }

  return reqParams;
};

/**
 * Check if a value matches the provided value, based on its
 * operator
 */
export const matchesInterceptorField = (
  operator: InterceptorRuleOperator,
  expectedValue: string,
  actualValue: string | string[]
) => {
  if (operator == 'equals' && expectedValue != actualValue) {
    return false;
  }

  if (operator == 'contains' && !actualValue.includes(expectedValue)) {
    return false;
  }

  if (operator == 'notEquals' && expectedValue == actualValue) {
    return false;
  }

  if (operator == 'notContains' && actualValue.includes(expectedValue)) {
    return false;
  }

  return true;
};

/**
 * Try to parse a string into a JSON object, returns null
 * if it fails
 */
export const parseJSON = (str: string) => {
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
};

/**
 * Check if a network event errored or not
 */
export const hasError = (event: NetworkEvent) => {
  const status = event.response?.status ?? 0;
  return status >= 400 || event.errorText;
};

/**
 * Format a network error
 */
export const formatError = (errorText?: string) => {
  if (!errorText) return null;

  const error = errorText.split('::')[1];

  if (!error) {
    return `(failed) ${errorText}`;
  }

  if (error === 'ERR_ABORTED') {
    return '(cancelled)';
  }

  if (error === 'ERR_BLOCKED_BY_CLIENT.Inspector') {
    return '(blocked:devtools)';
  }

  if (error === 'ERR_BLOCKED_BY_CLIENT') {
    return '(blocked:other)';
  }

  if (error == 'TIMEOUT') {
    return '(timeout)';
  }

  return `(failed) ${errorText}`;
};

/**
 * Parse multipart-form data
 */
export const parseFormData = (data: string, boundary: string) => {
  const fields: Record<string, string> = {};
  const parts = data.split(`--${boundary}`).filter((p) => p.trim() && p.trim() !== '--');

  for (const part of parts) {
    const [rawHeaders, ...rest] = part.split('\r\n\r\n');
    if (!rawHeaders || !rest.length) continue;

    const nameMatch = rawHeaders.match(/name="([^"]+)"/);
    if (!nameMatch) continue;

    const name = nameMatch[1];
    const value = rest.join('\r\n\r\n').replace(/\r\n$/, ''); // remove trailing newline
    fields[name] = value;
  }

  return fields;
};

/**
 * Turn an object back into form-data
 */
export const assembleFormData = (fields: Record<string, string>, boundary: string) => {
  let body = '';

  for (const [name, value] of Object.entries(fields)) {
    body += `--${boundary}\r\n`;
    body += `Content-Disposition: form-data; name="${name}"\r\n\r\n`;
    body += `${value}\r\n`;
  }
  body += `--${boundary}--\r\n`;
  return body;
};

/**
 * Check if a request is a multipart form data request, if so, return the
 * boundary
 */
export const getBoundary = (request: Protocol.Network.Request) => {
  const contentType = request.headers['Content-Type'] ?? request.headers['content-type'] ?? '';
  const boundary = contentType.split('boundary=')[1];
  return boundary;
};

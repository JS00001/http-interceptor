import Protocol from 'devtools-protocol';
import { InterceptorRuleOperator, NetworkEvent } from '../types';

export const RED = '🔴';
export const GREEN = '🟢';
export const YELLOW = '🟡';

/**
 * Take a CDP request, and convert both its query params and post data
 * into a combined object
 */
export const getRequestParams = (request: Protocol.Network.Request) => {
  const reqParams = {
    queryParams: {},
    postData: {},
  };

  // Get URL params and store them
  const parsedUrl = new URL(request.url);
  const queryParams = new URLSearchParams(parsedUrl.search);
  reqParams.queryParams = Object.fromEntries(queryParams.entries());

  // Get the post data and store it
  if (request.hasPostData && request.postData) {
    const data = parseJSON(request.postData);
    if (!data) return reqParams;
    reqParams.postData = data;
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

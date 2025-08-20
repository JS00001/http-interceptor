import Protocol from 'devtools-protocol';
import { InterceptorRuleOperator } from '../types';

export const RED = '🔴';
export const GREEN = '🟢';
export const YELLOW = '🟡';

/**
 * Take a CDP request, and convert both its query params and post data
 * into a combined object
 */
export const getRequestParams = (request: Protocol.Network.Request) => {
  const reqParams = {};

  // Get URL params and store them
  const parsedUrl = new URL(request.url);
  const queryParams = new URLSearchParams(parsedUrl.search);

  Object.assign(reqParams, Object.fromEntries(queryParams.entries()));

  if (request.hasPostData && request.postData) {
    const data = parseJSON(request.postData);
    if (!data) return reqParams;
    Object.assign(reqParams, data);
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

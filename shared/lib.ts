import Protocol from 'devtools-protocol';
import { InterceptorRuleOperator } from './types';

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

export const parseJSON = (str: string) => {
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
};

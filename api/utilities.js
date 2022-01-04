/**
 * Get a query string parameter from a request, with the ability to have
 * a fallback value
 */
const getParam = (event, key, defaultValue) => {
  if (!event.queryStringParameters || !event.queryStringParameters[key]) {
    return defaultValue;
  }

  return event.queryStringParameters[key];
};

/**
 * Get the ip address from the lambda event
 */
const retrieveUserSourceIp = event => {
  if (
    !event.requestContext ||
    !event.requestContext.identity ||
    !event.requestContext.identity.sourceIp
  ) {
    return "";
  }

  return event.requestContext.identity.sourceIp;
};

module.exports = {
  getParam,
  retrieveUserSourceIp,
};

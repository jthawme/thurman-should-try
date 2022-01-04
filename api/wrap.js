function addCorsHeaders(response) {
  return {
    ...response,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
      "Access-Control-Allow-Headers":
        "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent,X-Access-Token"
    }
  };
}

/** Wraps all API Lambda handlers with common middleware */
function wrap(handler) {
  return async (event, context) => {
    try {
      // make user context available to each request
      const { statusCode = 200, body = {}, ...result } = await handler(
        event,
        context
      );
      return addCorsHeaders({
        statusCode,
        ...result,
        body: JSON.stringify({
          status: "ok",
          ...body
        })
      });
    } catch (e) {
      console.error("Unhandled error", e.message);
      return addCorsHeaders({
        statusCode: 500,
        body: JSON.stringify({
          status: false,
          //
          // If you want to return a useful error message for a reason
          // you can determine if its a 'dictionary' like message and allow it
          // through, or return a general error. This is just so as not
          // to let any 'dev' like messages through to the endpoint
          //
          // message: isErrorMessage(e.message) ? e.message : ERRORS.GENERAL,
          message: "Server error"
        })
      });
    }
  };
}

module.exports = { wrap };

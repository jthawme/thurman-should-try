const { Representations } = require("./common/constants");
const { getDbItem, TABLE, saveDbItem } = require("./common/db");

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
const retrieveUserSourceIp = (event) => {
  if (
    !event.requestContext ||
    !event.requestContext.identity ||
    !event.requestContext.identity.sourceIp
  ) {
    return "";
  }

  return event.requestContext.identity.sourceIp;
};

const Target = {
  At: "at", // tweeted at him
  Read: "read", // read on the internet
};

const Replacements = {
  [Target.At]: {
    "[TARGET]": "Your",
    "[TARGET_OWNED]": "Yourself",
  },
  [Target.Read]: {
    "[TARGET]": "His",
    "[TARGET_OWNED]": "Himself",
  },
};

const replaceStrTarget = (str, target = Target.At) => {
  let text = str;
  const dict = Replacements[target];

  Object.entries(dict).forEach(([k, v]) => {
    text = text.split(k).join(v);
  });

  return text;
};

const infoValue = async (key, defValue, transform = (val) => val) => {
  const value = await getDbItem(key, TABLE.INFO, "key", (item) =>
    transform(item.value)
  );

  return typeof value === "undefined" ? defValue : value;
};

const saveInfoValue = async (key, value) => {
  return saveDbItem(
    {
      key,
      value,
    },
    TABLE.INFO
  );
};

const getRandomIdea = async () => {
  const remaining = await infoValue("remaining", [], (val) => JSON.parse(val));

  if (remaining.length === 0) {
    return false;
  }

  const id = remaining[Math.floor(Math.random() * remaining.length)];

  return getDbItem(id);
};

const prepareIdea = (item, target = Target.At) => {
  return {
    ...item,
    text: replaceStrTarget(item.text, target),
  };
};

const GREETING = ["Big man", "Yo,", "AYYO,", "My Guy", "Here ya,", "Hey lad,"];

const random = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)];
};

const prepareTweet = (item) => {
  return [
    random(GREETING),
    "@alexjoshua_t",
    "you should",
    replaceStrTarget(item.text, Target.At),
    Representations[item.type],
  ].join(" ");
};

const removeId = async (id) => {
  const remaining = await infoValue("remaining", [], (val) => JSON.parse(val));

  const idx = remaining.indexOf(id.toString());
  remaining.splice(idx, 1);

  return saveInfoValue("remaining", JSON.stringify(remaining));
};

module.exports = {
  getParam,
  retrieveUserSourceIp,
  replaceStrTarget,
  infoValue,
  saveInfoValue,
  getRandomIdea,
  prepareIdea,
  Target,
  prepareTweet,
  removeId,
};

const { Types } = require("./common/constants");
const { updateDbItem } = require("./common/db");
const { postTweet } = require("./common/twitter");
const {
  infoValue,
  getRandomIdea,
  prepareIdea,
  Target,
  prepareTweet,
  removeId,
} = require("./utilities");
const { wrap } = require("./wrap");

const ping = wrap((event, context, callback) => {
  return {
    statusCode: 200,
    body: {
      ping: new Date().getTime(),
      name: process.env.SERVICE_NAME,
    },
  };
});

const random = wrap(async (event, context, callback) => {
  const idea = await getRandomIdea();

  return {
    statusCode: 200,
    body: {
      idea: prepareIdea(idea, Target.Read),
    },
  };
});

const tweet = wrap(async () => {
  const { id, ...idea } = await getRandomIdea();
  // console.log(prepareTweet(idea).toLowerCase());
  const body = await postTweet(prepareTweet(idea).toLowerCase());

  await updateDbItem(id, {
    ...idea,
    tweet: body.id,
  });
  await removeId(id);

  return {
    statusCode: 200,
  };
});

module.exports = {
  ping,
  random,
  tweet,
};

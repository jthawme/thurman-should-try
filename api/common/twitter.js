const Twitter = require("twitter-lite");

const getClient = () => {
  return new Twitter({
    consumer_key: process.env.TWITTER_API_KEY,
    consumer_secret: process.env.TWITTER_API_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  });
};

const getTweet = (id) => {
  const client = getClient();

  return client.get(`statuses/show`, {
    id: id.toString(),
    tweet_mode: "extended",
  });
};

const postTweet = (txt) => {
  const client = getClient();

  return client.post("statuses/update", { status: txt });
};

module.exports = { getTweet, postTweet };

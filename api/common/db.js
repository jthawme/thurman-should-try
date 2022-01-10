const { DynamoDB, config } = require("aws-sdk");
config.update({ region: "us-east-1" });

const dynamoDb = new DynamoDB.DocumentClient();

const TABLE = {
  MAIN: "thurman-main",
  INFO: "thurman-info",
};

/**
 * Assumes the primary key on the table is called 'id'. Gets a single row
 *
 * @param {any} key
 * @param {string} tableName
 * @param {function} transformItem Useful to remove anything/grab specific properties from the object, or parse JSON etc.
 *
 * @returns {Promise<false | object>}
 */
const getDbItem = async (
  key,
  tableName = TABLE.MAIN,
  keyName = "id",
  transformItem = (item) => item
) => {
  return dynamoDb
    .get({
      TableName: tableName,
      Key: { [keyName]: key },
    })
    .promise()
    .then((item) => {
      if (item.Item) {
        return transformItem(item.Item);
      }

      return false;
    });
};

/**
 * Save an object to the db.
 *
 * @param {object} item
 * @param {string} tableName
 *
 * @returns {Promise<void>}
 */
const saveDbItem = (item, tableName = TABLE.MAIN) => {
  return dynamoDb
    .put({
      TableName: tableName,
      Item: item,
    })
    .promise();
};

/**
 * This is likely just useful to have as a reference, it gets quite specific
 *
 * @param {string} key
 * @param {object} item
 * @param {string} tableName
 *
 * @returns {Promise<void>}
 */
const updateDbItem = (key, item, tableName = TABLE.MAIN) => {
  // properly just trying to show off here, so unecessary
  const UpdateExpression = `set ${Object.keys(item)
    .map((k) => `#${k.toLowerCase()} = :${k.toLowerCase()}`)
    .join(", ")}`;
  const ExpressionAttributeNames = Object.entries(item).reduce(
    (cumulativeObject, currProperty) => {
      return {
        ...cumulativeObject,
        [`#${currProperty[0].toLowerCase()}`]: currProperty[0],
      };
    },
    {}
  );
  const ExpressionAttributeValues = Object.entries(item).reduce(
    (cumulativeObject, currProperty) => {
      return {
        ...cumulativeObject,
        [`:${currProperty[0].toLowerCase()}`]: currProperty[1],
      };
    },
    {}
  );

  console.log({
    TableName: tableName,
    Key: { id: key },
    UpdateExpression,
    ExpressionAttributeNames,
    ExpressionAttributeValues,
  });

  return dynamoDb
    .update({
      TableName: tableName,
      Key: { id: key },
      UpdateExpression,
      ExpressionAttributeNames,
      ExpressionAttributeValues,
    })
    .promise();
};

const chunk = (arr, chunkSize = 1, cache = []) => {
  const tmp = [...arr];
  if (chunkSize <= 0) return cache;
  while (tmp.length) cache.push(tmp.splice(0, chunkSize));
  return cache;
};

/**
 * Method to batch save items to a DB
 *
 * @param {array} itemsRaw
 * @param {string} tableName
 *
 * @returns {Promise<void[]>}
 */
const saveMultipleItems = (itemsRaw, tableName = TABLE.MAIN) => {
  const items = itemsRaw.map((item) => {
    return {
      Put: {
        TableName: tableName,
        Item: item,
      },
    };
  });

  return Promise.all(
    chunk(items, 25).map((chunk) => {
      return dynamoDb
        .transactWrite({
          TransactItems: chunk,
        })
        .promise();
    })
  );
};

const scanTable = (tableName = TABLE.MAIN) => {
  return new Promise((resolve, reject) => {
    const items = [];

    const get = (key) => {
      const params = {
        TableName: tableName,
      };

      if (key) {
        params.ExclusiveStartKey = key;
      }

      dynamoDb
        .scan(params)
        .promise()
        .then((data) => {
          items.push(...data.Items);
          process.stdout.clearLine();
          process.stdout.cursorTo(0);
          process.stdout.write(`Total records currently: ${items.length}`);

          if (data.LastEvaluatedKey && data.LastEvaluatedKey !== key) {
            get(data.LastEvaluatedKey);
          } else {
            resolve(items);
            console.log("");
          }
        })
        .catch((e) => reject(e));
    };

    get();
  });
};

module.exports = { scanTable };

module.exports = {
  dynamoDb,
  TABLE,
  getDbItem,
  saveDbItem,
  updateDbItem,
  saveMultipleItems,
  scanTable,
  chunk,
};

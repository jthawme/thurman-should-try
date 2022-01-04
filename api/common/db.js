const { chunk } = require("lodash");
const { DynamoDB } = require("aws-sdk");

const dynamoDb = new DynamoDB.DocumentClient();

const TABLE = {
  MAIN: "servicename-main"
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
  transformItem = item => item
) => {
  return dynamoDb
    .get({
      TableName: tableName,
      Key: { id: key }
    })
    .promise()
    .then(item => {
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
      Item: item
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
    .map(k => `${k} = :${k.toLowerCase()}`)
    .join(", ")}`;
  const ExpressionAttributeValues = Object.entries(item).reduce(
    (cumulativeObject, currProperty) => {
      return {
        ...cumulativeObject,
        [`:${currProperty[0].toLowerCase()}`]: currProperty[1]
      };
    },
    {}
  );

  return dynamoDb
    .update({
      TableName: tableName,
      Key: { id: key },
      UpdateExpression,
      ExpressionAttributeValues
    })
    .promise();
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
  const items = itemsRaw.map(item => {
    return {
      Put: {
        TableName: tableName,
        Item: item
      }
    };
  });

  return Promise.all(
    chunk(items, 25).map(chunk => {
      return dynamoDb
        .transactWrite({
          TransactItems: chunk
        })
        .promise();
    })
  );
};

module.exports = {
  dynamoDb,
  TABLE,
  getDbItem,
  saveDbItem,
  updateDbItem,
  saveMultipleItems
};

const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.ITEMS_TABLE;

/**
 * Create a new item in DynamoDB
 * @param {Object} item - The item to create
 * @returns {Promise}
 */
const create = async (item) => {
	const params = {
		TableName: tableName,
		Item: item,
	};

	await dynamoDb.put(params).promise();
	return item;
};

/**
 * Get an item from DynamoDB by id
 * @param {String} id - The id of the item to get
 * @returns {Promise}
 */
const get = async (id) => {
	const params = {
		TableName: tableName,
		Key: { id },
	};

	const result = await dynamoDb.get(params).promise();
	return result.Item;
};

/**
 * List all items from DynamoDB
 * @returns {Promise}
 */
const list = async () => {
	const params = {
		TableName: tableName,
	};

	const result = await dynamoDb.scan(params).promise();
	return result.Items;
};

/**
 * Update an item in DynamoDB
 * @param {String} id - The id of the item to update
 * @param {Object} data - The data to update
 * @returns {Promise}
 */
const update = async (id, data) => {
	const timestamp = new Date().toISOString();
	const { name, description } = data;

	const params = {
		TableName: tableName,
		Key: { id },
		ExpressionAttributeNames: {
			'#item_name': 'name',
		},
		ExpressionAttributeValues: {
			':name': name,
			':description': description,
			':updatedAt': timestamp,
		},
		UpdateExpression: 'SET #item_name = :name, description = :description, updatedAt = :updatedAt',
		ReturnValues: 'ALL_NEW',
	};

	const result = await dynamoDb.update(params).promise();
	return result.Attributes;
};

/**
 * Delete an item from DynamoDB
 * @param {String} id - The id of the item to delete
 * @returns {Promise}
 */
const remove = async (id) => {
	const params = {
		TableName: tableName,
		Key: { id },
		ReturnValues: 'ALL_OLD',
	};

	const result = await dynamoDb.delete(params).promise();
	return result.Attributes;
};

module.exports = {
	create,
	get,
	list,
	update,
	remove,
};

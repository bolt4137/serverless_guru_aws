'use strict';

const dynamoDb = require('../../utils/dynamodb');

/**
 * List all items
 * @param {Object} event - API Gateway Lambda Proxy Input
 * @returns {Object} - API Gateway Lambda Proxy Output
 */
module.exports.list = async (event) => {
	try {
		const items = await dynamoDb.list();

		return {
			statusCode: 200,
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Credentials': true,
			},
			body: JSON.stringify(items),
		};
	} catch (error) {
		console.error('Error listing items:', error);
		return {
			statusCode: 500,
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Credentials': true,
			},
			body: JSON.stringify({
				message: 'Could not list the items',
				error: error.message,
			}),
		};
	}
};

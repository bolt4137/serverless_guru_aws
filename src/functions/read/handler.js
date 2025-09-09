'use strict';

const dynamoDb = require('../../utils/dynamodb');

/**
 * Get an item by id
 * @param {Object} event - API Gateway Lambda Proxy Input
 * @returns {Object} - API Gateway Lambda Proxy Output
 */
module.exports.get = async (event) => {
	try {
		const id = event.pathParameters.id;

		const item = await dynamoDb.get(id);

		if (!item) {
			return {
				statusCode: 404,
				headers: {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Credentials': true,
				},
				body: JSON.stringify({
					message: `Item with id ${id} not found`,
				}),
			};
		}

		return {
			statusCode: 200,
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Credentials': true,
			},
			body: JSON.stringify(item),
		};
	} catch (error) {
		console.error('Error getting item:', error);
		return {
			statusCode: 500,
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Credentials': true,
			},
			body: JSON.stringify({
				message: 'Could not get the item',
				error: error.message,
			}),
		};
	}
};

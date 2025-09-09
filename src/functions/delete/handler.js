'use strict';

const dynamoDb = require('../../utils/dynamodb');

/**
 * Delete an item by id
 * @param {Object} event - API Gateway Lambda Proxy Input
 * @returns {Object} - API Gateway Lambda Proxy Output
 */
module.exports.delete = async (event) => {
	try {
		const id = event.pathParameters.id;

		const existingItem = await dynamoDb.get(id);
		if (!existingItem) {
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

		const deletedItem = await dynamoDb.remove(id);

		return {
			statusCode: 200,
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Credentials': true,
			},
			body: JSON.stringify({
				message: 'Item deleted successfully',
				deletedItem,
			}),
		};
	} catch (error) {
		console.error('Error deleting item:', error);
		return {
			statusCode: 500,
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Credentials': true,
			},
			body: JSON.stringify({
				message: 'Could not delete the item',
				error: error.message,
			}),
		};
	}
};

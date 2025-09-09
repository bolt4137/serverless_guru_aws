'use strict';

const dynamoDb = require('../../utils/dynamodb');

/**
 * Update an item by id
 * @param {Object} event - API Gateway Lambda Proxy Input
 * @returns {Object} - API Gateway Lambda Proxy Output
 */
module.exports.update = async (event) => {
	try {
		const id = event.pathParameters.id;
		const data = JSON.parse(event.body);

		if (!data.name || !data.description) {
			return {
				statusCode: 400,
				headers: {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Credentials': true,
				},
				body: JSON.stringify({
					message: 'Name and description are required',
				}),
			};
		}

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

		const updatedItem = await dynamoDb.update(id, data);

		return {
			statusCode: 200,
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Credentials': true,
			},
			body: JSON.stringify(updatedItem),
		};
	} catch (error) {
		console.error('Error updating item:', error);
		return {
			statusCode: 500,
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Credentials': true,
			},
			body: JSON.stringify({
				message: 'Could not update the item',
				error: error.message,
			}),
		};
	}
};

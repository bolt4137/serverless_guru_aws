'use strict';

const { v4: uuidv4 } = require('uuid');
const dynamoDb = require('../../utils/dynamodb');

/**
 * Create a new item
 * @param {Object} event - API Gateway Lambda Proxy Input
 * @returns {Object} - API Gateway Lambda Proxy Output
 */
module.exports.create = async (event) => {
	try {
		const timestamp = new Date().toISOString();
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

		const item = {
			id: uuidv4(),
			name: data.name,
			description: data.description,
			createdAt: timestamp,
			updatedAt: timestamp,
		};

		await dynamoDb.create(item);

		return {
			statusCode: 201,
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Credentials': true,
			},
			body: JSON.stringify(item),
		};
	} catch (error) {
		console.error('Error creating item:', error);
		return {
			statusCode: 500,
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Credentials': true,
			},
			body: JSON.stringify({
				message: 'Could not create the item',
				error: error.message,
			}),
		};
	}
};

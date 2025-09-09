'use strict';

// Mock the dynamodb module
jest.mock('../../../src/utils/dynamodb', () => ({
  get: jest.fn(),
  update: jest.fn()
}));

const dynamoDb = require('../../../src/utils/dynamodb');
const { update } = require('../../../src/functions/update/handler');

describe('Update Item Lambda', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should update an item successfully', async () => {
    // Mock existing item
    const existingItem = {
      id: 'test-id-1234',
      name: 'Original Name',
      description: 'Original Description',
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z'
    };

    // Mock updated item
    const updatedItem = {
      id: 'test-id-1234',
      name: 'Updated Name',
      description: 'Updated Description',
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-02T00:00:00.000Z'
    };

    // Mock dynamoDb.get to return the existing item
    dynamoDb.get.mockResolvedValueOnce(existingItem);
    
    // Mock dynamoDb.update to return the updated item
    dynamoDb.update.mockResolvedValueOnce(updatedItem);

    // Mock event
    const event = {
      pathParameters: {
        id: 'test-id-1234'
      },
      body: JSON.stringify({
        name: 'Updated Name',
        description: 'Updated Description'
      })
    };

    // Call the handler
    const result = await update(event);

    // Verify the response
    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual(updatedItem);

    // Verify dynamoDb.get was called with the correct parameters
    expect(dynamoDb.get).toHaveBeenCalledWith('test-id-1234');
    
    // Verify dynamoDb.update was called with the correct parameters
    expect(dynamoDb.update).toHaveBeenCalledWith('test-id-1234', {
      name: 'Updated Name',
      description: 'Updated Description'
    });
  });

  test('should return 400 when name is missing', async () => {
    // Mock event with missing name
    const event = {
      pathParameters: {
        id: 'test-id-1234'
      },
      body: JSON.stringify({
        description: 'Updated Description'
      })
    };

    // Call the handler
    const result = await update(event);

    // Verify the response
    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body)).toEqual({
      message: 'Name and description are required'
    });

    // Verify dynamoDb.update was not called
    expect(dynamoDb.update).not.toHaveBeenCalled();
  });

  test('should return 404 when item is not found', async () => {
    // Mock dynamoDb.get to return null (item not found)
    dynamoDb.get.mockResolvedValueOnce(null);

    // Mock event
    const event = {
      pathParameters: {
        id: 'non-existent-id'
      },
      body: JSON.stringify({
        name: 'Updated Name',
        description: 'Updated Description'
      })
    };

    // Call the handler
    const result = await update(event);

    // Verify the response
    expect(result.statusCode).toBe(404);
    expect(JSON.parse(result.body)).toEqual({
      message: 'Item with id non-existent-id not found'
    });
    
    // Verify dynamoDb.update was not called
    expect(dynamoDb.update).not.toHaveBeenCalled();
  });

  test('should return 500 when an error occurs', async () => {
    // Mock existing item
    const existingItem = {
      id: 'test-id-1234',
      name: 'Original Name',
      description: 'Original Description',
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z'
    };

    // Mock dynamoDb.get to return the existing item
    dynamoDb.get.mockResolvedValueOnce(existingItem);
    
    // Mock dynamoDb.update to throw an error
    dynamoDb.update.mockRejectedValueOnce(new Error('Database error'));

    // Mock event
    const event = {
      pathParameters: {
        id: 'test-id-1234'
      },
      body: JSON.stringify({
        name: 'Updated Name',
        description: 'Updated Description'
      })
    };

    // Call the handler
    const result = await update(event);

    // Verify the response
    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body)).toEqual({
      message: 'Could not update the item',
      error: 'Database error'
    });
  });
});

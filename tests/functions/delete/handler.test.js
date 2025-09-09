'use strict';

// Mock the dynamodb module
jest.mock('../../../src/utils/dynamodb', () => ({
  get: jest.fn(),
  remove: jest.fn()
}));

const dynamoDb = require('../../../src/utils/dynamodb');
const { delete: deleteHandler } = require('../../../src/functions/delete/handler');

describe('Delete Item Lambda', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should delete an item successfully', async () => {
    // Mock existing item
    const existingItem = {
      id: 'test-id-1234',
      name: 'Test Item',
      description: 'This is a test item',
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z'
    };

    // Mock dynamoDb.get to return the existing item
    dynamoDb.get.mockResolvedValueOnce(existingItem);
    
    // Mock dynamoDb.remove to return the deleted item
    dynamoDb.remove.mockResolvedValueOnce(existingItem);

    // Mock event
    const event = {
      pathParameters: {
        id: 'test-id-1234'
      }
    };

    // Call the handler
    const result = await deleteHandler(event);

    // Verify the response
    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual({
      message: 'Item deleted successfully',
      deletedItem: existingItem
    });

    // Verify dynamoDb.get was called with the correct parameters
    expect(dynamoDb.get).toHaveBeenCalledWith('test-id-1234');
    
    // Verify dynamoDb.remove was called with the correct parameters
    expect(dynamoDb.remove).toHaveBeenCalledWith('test-id-1234');
  });

  test('should return 404 when item is not found', async () => {
    // Mock dynamoDb.get to return null (item not found)
    dynamoDb.get.mockResolvedValueOnce(null);

    // Mock event
    const event = {
      pathParameters: {
        id: 'non-existent-id'
      }
    };

    // Call the handler
    const result = await deleteHandler(event);

    // Verify the response
    expect(result.statusCode).toBe(404);
    expect(JSON.parse(result.body)).toEqual({
      message: 'Item with id non-existent-id not found'
    });
    
    // Verify dynamoDb.remove was not called
    expect(dynamoDb.remove).not.toHaveBeenCalled();
  });

  test('should return 500 when an error occurs', async () => {
    // Mock existing item
    const existingItem = {
      id: 'test-id-1234',
      name: 'Test Item',
      description: 'This is a test item',
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z'
    };

    // Mock dynamoDb.get to return the existing item
    dynamoDb.get.mockResolvedValueOnce(existingItem);
    
    // Mock dynamoDb.remove to throw an error
    dynamoDb.remove.mockRejectedValueOnce(new Error('Database error'));

    // Mock event
    const event = {
      pathParameters: {
        id: 'test-id-1234'
      }
    };

    // Call the handler
    const result = await deleteHandler(event);

    // Verify the response
    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body)).toEqual({
      message: 'Could not delete the item',
      error: 'Database error'
    });
  });
});

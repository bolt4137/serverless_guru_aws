'use strict';

// Mock the dynamodb module
jest.mock('../../../src/utils/dynamodb', () => ({
  get: jest.fn()
}));

const dynamoDb = require('../../../src/utils/dynamodb');
const { get } = require('../../../src/functions/read/handler');

describe('Get Item Lambda', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should get an item successfully', async () => {
    // Mock item data
    const mockItem = {
      id: 'test-id-1234',
      name: 'Test Item',
      description: 'This is a test item',
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z'
    };

    // Mock dynamoDb.get to return the item
    dynamoDb.get.mockResolvedValueOnce(mockItem);

    // Mock event
    const event = {
      pathParameters: {
        id: 'test-id-1234'
      }
    };

    // Call the handler
    const result = await get(event);

    // Verify the response
    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual(mockItem);

    // Verify dynamoDb.get was called with the correct parameters
    expect(dynamoDb.get).toHaveBeenCalledWith('test-id-1234');
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
    const result = await get(event);

    // Verify the response
    expect(result.statusCode).toBe(404);
    expect(JSON.parse(result.body)).toEqual({
      message: 'Item with id non-existent-id not found'
    });
  });

  test('should return 500 when an error occurs', async () => {
    // Mock dynamoDb.get to throw an error
    dynamoDb.get.mockRejectedValueOnce(new Error('Database error'));

    // Mock event
    const event = {
      pathParameters: {
        id: 'test-id-1234'
      }
    };

    // Call the handler
    const result = await get(event);

    // Verify the response
    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body)).toEqual({
      message: 'Could not get the item',
      error: 'Database error'
    });
  });
});

'use strict';

// Mock the dynamodb module
jest.mock('../../../src/utils/dynamodb', () => ({
  list: jest.fn()
}));

const dynamoDb = require('../../../src/utils/dynamodb');
const { list } = require('../../../src/functions/list/handler');

describe('List Items Lambda', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should list items successfully', async () => {
    // Mock items data
    const mockItems = [
      {
        id: 'test-id-1',
        name: 'Test Item 1',
        description: 'This is test item 1',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z'
      },
      {
        id: 'test-id-2',
        name: 'Test Item 2',
        description: 'This is test item 2',
        createdAt: '2023-01-02T00:00:00.000Z',
        updatedAt: '2023-01-02T00:00:00.000Z'
      }
    ];

    // Mock dynamoDb.list to return the items
    dynamoDb.list.mockResolvedValueOnce(mockItems);

    // Mock event
    const event = {};

    // Call the handler
    const result = await list(event);

    // Verify the response
    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual(mockItems);

    // Verify dynamoDb.list was called
    expect(dynamoDb.list).toHaveBeenCalled();
  });

  test('should return empty array when no items exist', async () => {
    // Mock dynamoDb.list to return empty array
    dynamoDb.list.mockResolvedValueOnce([]);

    // Mock event
    const event = {};

    // Call the handler
    const result = await list(event);

    // Verify the response
    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual([]);
  });

  test('should return 500 when an error occurs', async () => {
    // Mock dynamoDb.list to throw an error
    dynamoDb.list.mockRejectedValueOnce(new Error('Database error'));

    // Mock event
    const event = {};

    // Call the handler
    const result = await list(event);

    // Verify the response
    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body)).toEqual({
      message: 'Could not list the items',
      error: 'Database error'
    });
  });
});

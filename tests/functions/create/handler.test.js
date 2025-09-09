'use strict';

// Mock the dynamodb module
jest.mock('../../../src/utils/dynamodb', () => ({
  create: jest.fn().mockImplementation((item) => Promise.resolve(item))
}));

// Mock uuid to return a consistent value for testing
jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('test-uuid-1234')
}));

const dynamoDb = require('../../../src/utils/dynamodb');
const { create } = require('../../../src/functions/create/handler');

describe('Create Item Lambda', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should create an item successfully', async () => {
    // Mock event
    const event = {
      body: JSON.stringify({
        name: 'Test Item',
        description: 'This is a test item'
      })
    };

    // Call the handler
    const result = await create(event);

    // Verify the response
    expect(result.statusCode).toBe(201);
    expect(JSON.parse(result.body)).toEqual({
      id: 'test-uuid-1234',
      name: 'Test Item',
      description: 'This is a test item',
      createdAt: expect.any(String),
      updatedAt: expect.any(String)
    });

    // Verify dynamoDb.create was called with the correct parameters
    expect(dynamoDb.create).toHaveBeenCalledWith({
      id: 'test-uuid-1234',
      name: 'Test Item',
      description: 'This is a test item',
      createdAt: expect.any(String),
      updatedAt: expect.any(String)
    });
  });

  test('should return 400 when name is missing', async () => {
    // Mock event with missing name
    const event = {
      body: JSON.stringify({
        description: 'This is a test item'
      })
    };

    // Call the handler
    const result = await create(event);

    // Verify the response
    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body)).toEqual({
      message: 'Name and description are required'
    });

    // Verify dynamoDb.create was not called
    expect(dynamoDb.create).not.toHaveBeenCalled();
  });

  test('should return 400 when description is missing', async () => {
    // Mock event with missing description
    const event = {
      body: JSON.stringify({
        name: 'Test Item'
      })
    };

    // Call the handler
    const result = await create(event);

    // Verify the response
    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body)).toEqual({
      message: 'Name and description are required'
    });

    // Verify dynamoDb.create was not called
    expect(dynamoDb.create).not.toHaveBeenCalled();
  });

  test('should return 500 when an error occurs', async () => {
    // Mock dynamoDb.create to throw an error
    dynamoDb.create.mockRejectedValueOnce(new Error('Database error'));

    // Mock event
    const event = {
      body: JSON.stringify({
        name: 'Test Item',
        description: 'This is a test item'
      })
    };

    // Call the handler
    const result = await create(event);

    // Verify the response
    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body)).toEqual({
      message: 'Could not create the item',
      error: 'Database error'
    });
  });
});

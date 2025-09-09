This is readme file

# Serverless CRUD API with AWS API Gateway, Lambda, and DynamoDB

This project implements a serverless REST API using AWS API Gateway, AWS Lambda, and DynamoDB. The API provides full CRUD (Create, Read, Update, Delete) operations for managing items, with infrastructure managed by the Serverless Framework.

## Architecture

- **API Gateway**: Handles HTTP requests and routes them to appropriate Lambda functions
- **Lambda Functions**: Node.js functions that process requests and interact with DynamoDB
- **DynamoDB**: NoSQL database for storing item data
- **Serverless Framework**: Infrastructure as Code (IaC) tool for AWS resource management
- **GitHub Actions**: CI/CD pipeline for automated deployments

## Prerequisites

- Node.js 18.x or later
- AWS CLI configured with appropriate credentials
- Serverless Framework CLI
- GitHub account (for CI/CD)

## Project Structure

```
.
├── .github/
│   └── workflows/
│       └── deploy.yml        # GitHub Actions workflow
├── src/
│   ├── functions/
│   │   ├── create/
│   │   │   └── handler.js    # Create item Lambda
│   │   ├── read/
│   │   │   └── handler.js    # Get item Lambda
│   │   ├── update/
│   │   │   └── handler.js    # Update item Lambda
│   │   ├── delete/
│   │   │   └── handler.js    # Delete item Lambda
│   │   └── list/
│   │       └── handler.js    # List items Lambda
│   └── utils/
│       └── dynamodb.js       # DynamoDB utility functions
├── package.json
├── serverless.yml            # Serverless Framework configuration
└── README.md
```

## Setup Instructions

### Local Development

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd serverless-crud-api
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the API locally:
   ```bash
   npx serverless offline
   ```
   The API will be available at `http://localhost:3000`

### Deployment

#### Manual Deployment

To deploy to the dev stage:

```bash
npx serverless deploy --stage dev
```

To deploy to the production stage:

```bash
npx serverless deploy --stage prod
```

#### CI/CD Deployment

The project includes a GitHub Actions workflow that automatically deploys to the dev stage when code is pushed to the main/master branch.

To deploy to production using CI/CD, include `[deploy:prod]` in your commit message:

```bash
git commit -m "Your commit message [deploy:prod]"
git push origin main
```

### AWS Configuration

1. Create an IAM user with programmatic access and the following permissions:

   - AWSLambdaFullAccess
   - AmazonAPIGatewayAdministrator
   - AmazonDynamoDBFullAccess
   - IAMFullAccess (or a more restricted policy for creating roles)

2. Configure your AWS credentials:

   ```bash
   aws configure
   ```

3. For GitHub Actions, add the following secrets to your repository:
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`

## API Endpoints

### Create Item

- **URL**: POST /items
- **Description**: Creates a new item
- **Request Body**:
  ```json
  {
  	"name": "Item Name",
  	"description": "Item Description"
  }
  ```
- **Example**:
  ```bash
  curl -X POST https://your-api-id.execute-api.us-east-1.amazonaws.com/dev/items \
    -H "Content-Type: application/json" \
    -d '{"name": "Sample Item", "description": "This is a sample item"}'
  ```

### Get Item

- **URL**: GET /items/{id}
- **Description**: Retrieves a specific item by ID
- **Example**:
  ```bash
  curl https://your-api-id.execute-api.us-east-1.amazonaws.com/dev/items/123e4567-e89b-12d3-a456-426614174000
  ```

### List Items

- **URL**: GET /items
- **Description**: Retrieves all items
- **Example**:
  ```bash
  curl https://your-api-id.execute-api.us-east-1.amazonaws.com/dev/items
  ```

### Update Item

- **URL**: PUT /items/{id}
- **Description**: Updates an existing item
- **Request Body**:
  ```json
  {
  	"name": "Updated Name",
  	"description": "Updated Description"
  }
  ```
- **Example**:
  ```bash
  curl -X PUT https://your-api-id.execute-api.us-east-1.amazonaws.com/dev/items/123e4567-e89b-12d3-a456-426614174000 \
    -H "Content-Type: application/json" \
    -d '{"name": "Updated Item", "description": "This item has been updated"}'
  ```

### Delete Item

- **URL**: DELETE /items/{id}
- **Description**: Deletes an item
- **Example**:
  ```bash
  curl -X DELETE https://your-api-id.execute-api.us-east-1.amazonaws.com/dev/items/123e4567-e89b-12d3-a456-426614174000
  ```

## CI/CD Pipeline

The CI/CD pipeline is implemented using GitHub Actions and consists of the following steps:

1. **Checkout**: Retrieves the latest code from the repository
2. **Setup Node.js**: Configures the Node.js environment
3. **Install Dependencies**: Installs the required npm packages
4. **Run Tests**: Executes any available tests
5. **Cache Dependencies**: Caches Serverless Framework dependencies for faster builds
6. **Deploy to Dev**: Deploys the application to the dev stage
7. **Deploy to Prod**: Conditionally deploys to production if the commit message contains `[deploy:prod]`

![CI/CD Pipeline Screenshot](https://example.com/pipeline-screenshot.png)

## Multi-Stage Support

The application supports multiple deployment stages (dev, prod) with separate resources for each stage:

- Different API Gateway endpoints
- Isolated Lambda functions
- Separate DynamoDB tables

This ensures that development and production environments are completely independent.

## Security

- Lambda functions use least-privilege IAM roles with permissions limited to their specific DynamoDB table
- API Gateway endpoints include CORS headers for secure cross-origin requests
- Sensitive information is stored in GitHub Secrets for CI/CD

## Future Enhancements

- Add authentication and authorization
- Implement pagination for the list endpoint
- Add more comprehensive logging and monitoring
- Create a frontend application to interact with the API

## License

MIT

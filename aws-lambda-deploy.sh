#!/bin/sh

# Load the environment variables
source .env

# Build the binary
GOOS=linux GOARCH=arm64 go build -tags lambda.norpc -o bootstrap main.go

# Zip the binary
zip "${LAMBDA_FUNCTION_NAME}.zip" bootstrap

# Check if the Lambda function exists
if aws lambda get-function --function-name $LAMBDA_FUNCTION_NAME --profile $AWS_SSO_PROFILE 2>/dev/null; then
  echo "Updating existing function $LAMBDA_FUNCTION_NAME"
  # Update the function code
  aws lambda update-function-code --function-name $LAMBDA_FUNCTION_NAME \
  --zip-file fileb://"${LAMBDA_FUNCTION_NAME}.zip" \
  --profile $AWS_SSO_PROFILE
else
  echo "Creating new function $LAMBDA_FUNCTION_NAME"
  # Create the function
  aws lambda create-function --function-name $LAMBDA_FUNCTION_NAME \
  --runtime provided.al2023 --handler bootstrap \
  --architectures arm64 \
  --role $AWS_ROLE_ARN \
  --zip-file fileb://"${LAMBDA_FUNCTION_NAME}.zip" \
  --profile $AWS_SSO_PROFILE
fi

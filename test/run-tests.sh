#!/bin/bash

# Start MongoDB service
echo "Starting MongoDB service..."
sudo service mongod start || echo "MongoDB service not found, continuing anyway"

# Start backend server in the background
echo "Starting backend server..."
cd ../backend
npm run dev &
BACKEND_PID=$!

# Wait for backend to start
echo "Waiting for backend server to start..."
sleep 10

# Run tests
echo "Running tests..."
cd ../test
npm test

# Capture test result
TEST_RESULT=$?

# Cleanup: Stop backend server
echo "Stopping backend server..."
kill $BACKEND_PID

# Return test result
exit $TEST_RESULT

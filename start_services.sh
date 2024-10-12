#!/bin/bash

# Start the frontend
cd frontend && npm start &

# Start the backend
/bin/python3 "/home/negus/Documents/AI Quiz App/backend/server.py" &

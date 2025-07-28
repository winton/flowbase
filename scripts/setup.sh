#!/usr/bin/env bash
set -e

# Automated development environment setup

echo "Installing dependencies..."
npm install

echo "Running type-check..."
npm run type_check

echo "Running tests..."
npm test -- --ci

echo "Setup complete." 
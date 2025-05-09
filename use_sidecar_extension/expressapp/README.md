# Fashion Store Assistant - Express.js Implementation

This is a Node.js/Express.js implementation of the Fashion Store Assistant application. It provides equivalent functionality to the other implementations in .NET, Spring Boot, and FastAPI.

## Features

- Display product information
- Process user queries about products
- Stream responses from a language model

## Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)
- Access to a compatible language model API (default: Ollama running on http://localhost:11434)

## Getting Started

1. Clone the repository
2. Navigate to the Express.js project directory

```bash
cd expressapp
```

3. Install dependencies

```bash
npm install
```

4. Start the application

```bash
npm start
```

The application will be available at http://localhost:3000

## Development

For development with automatic server restarts:

```bash
npm run dev
```

## API Endpoints

- `GET /api/products` - Get all available products
- `GET /api/reactive-query` - Process a query about a product and stream the response

## Project Structure

- `/public` - Static assets (HTML, CSS, JavaScript, images)
- `/src` - Server-side code
  - `/models` - Data models
  - `/routes` - API route handlers
  - `/services` - Business logic and external service integrations
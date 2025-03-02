# NaijaHub API Documentation

This document provides a comprehensive reference for the NaijaHub API, including authentication, endpoints, request/response formats, and error handling.

## Table of Contents

1. [Authentication](#authentication)
2. [Base URL](#base-url)
3. [API Endpoints](#api-endpoints)
   - [User Endpoints](#user-endpoints)
   - [Posts Endpoints](#posts-endpoints)
   - [Comments Endpoints](#comments-endpoints)
   - [Categories Endpoints](#categories-endpoints)
   - [Marketplace Endpoints](#marketplace-endpoints)
   - [Monitoring Endpoints](#monitoring-endpoints)
4. [Error Handling](#error-handling)
5. [Rate Limiting](#rate-limiting)
6. [Versioning](#versioning)

## Authentication

NaijaHub uses JWT-based authentication via Supabase Auth. To authenticate API requests:

1. Obtain a JWT token by signing in through Supabase Auth
2. Include the token in the `Authorization` header of your requests:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

## Base URL

All API endpoints are relative to the base URL:

- Production: `https://api.naijahub.com`
- Development: `http://localhost:3000`

## API Endpoints

### User Endpoints

#### Get Current User Profile

```
GET /api/profiles/me
```

**Response:**

```json
{
  "id": "uuid",
  "username": "johndoe",
  "full_name": "John Doe",
  "avatar_url": "https://example.com/avatar.jpg",
  "bio": "About me",
  "location": "Lagos, Nigeria",
  "website": "https://johndoe.com",
  "created_at": "2025-01-01T00:00:00Z",
  "updated_at": "2025-01-01T00:00:00Z"
}
```

#### Update User Profile

```
PATCH /api/profiles/me
```

**Request Body:**

```json
{
  "full_name": "John Doe",
  "bio": "New bio",
  "location": "Abuja, Nigeria"
}
```

**Response:**

```json
{
  "id": "uuid",
  "username": "johndoe",
  "full_name": "John Doe",
  "avatar_url": "https://example.com/avatar.jpg",
  "bio": "New bio",
  "location": "Abuja, Nigeria",
  "website": "https://johndoe.com",
  "created_at": "2025-01-01T00:00:00Z",
  "updated_at": "2025-01-01T00:00:00Z"
}
```

#### Get User Profile by ID

```
GET /api/profiles/:id
```

**Response:**

```json
{
  "id": "uuid",
  "username": "johndoe",
  "full_name": "John Doe",
  "avatar_url": "https://example.com/avatar.jpg",
  "bio": "About me",
  "location": "Lagos, Nigeria",
  "website": "https://johndoe.com",
  "created_at": "2025-01-01T00:00:00Z",
  "updated_at": "2025-01-01T00:00:00Z"
}
```

### Posts Endpoints

#### Get Posts

```
GET /api/posts
```

**Query Parameters:**

- `category`: Filter by category ID
- `user_id`: Filter by user ID
- `page`: Page number (default: 1)
- `limit`: Results per page (default: 10)
- `sort`: Sort field (default: created_at)
- `order`: Sort order (asc/desc, default: desc)

**Response:**

```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Post Title",
      "content": "Post content...",
      "user_id": "uuid",
      "category_id": "uuid",
      "created_at": "2025-01-01T00:00:00Z",
      "updated_at": "2025-01-01T00:00:00Z",
      "is_published": true,
      "view_count": 100,
      "like_count": 50,
      "comment_count": 10,
      "user": {
        "username": "johndoe",
        "avatar_url": "https://example.com/avatar.jpg"
      },
      "category": {
        "name": "Technology",
        "slug": "technology"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

#### Get Post by ID

```
GET /api/posts/:id
```

**Response:**

```json
{
  "id": "uuid",
  "title": "Post Title",
  "content": "Post content...",
  "user_id": "uuid",
  "category_id": "uuid",
  "created_at": "2025-01-01T00:00:00Z",
  "updated_at": "2025-01-01T00:00:00Z",
  "is_published": true,
  "view_count": 100,
  "like_count": 50,
  "comment_count": 10,
  "user": {
    "id": "uuid",
    "username": "johndoe",
    "avatar_url": "https://example.com/avatar.jpg"
  },
  "category": {
    "id": "uuid",
    "name": "Technology",
    "slug": "technology"
  }
}
```

#### Create Post

```
POST /api/posts
```

**Request Body:**

```json
{
  "title": "New Post Title",
  "content": "Post content...",
  "category_id": "uuid",
  "is_published": true
}
```

**Response:**

```json
{
  "id": "uuid",
  "title": "New Post Title",
  "content": "Post content...",
  "user_id": "uuid",
  "category_id": "uuid",
  "created_at": "2025-01-01T00:00:00Z",
  "updated_at": "2025-01-01T00:00:00Z",
  "is_published": true,
  "view_count": 0,
  "like_count": 0,
  "comment_count": 0
}
```

### Marketplace Endpoints

#### Get Marketplace Listings

```
GET /api/marketplace
```

**Query Parameters:**

- `type`: Marketplace type (tech, auto, beauty)
- `user_id`: Filter by seller ID
- `min_price`: Minimum price
- `max_price`: Maximum price
- `location_id`: Filter by location
- `page`: Page number (default: 1)
- `limit`: Results per page (default: 10)
- `sort`: Sort field (default: created_at)
- `order`: Sort order (asc/desc, default: desc)

**Response:**

```json
{
  "data": [
    {
      "id": "uuid",
      "title": "iPhone 15 Pro",
      "description": "Brand new iPhone 15 Pro...",
      "price": 1200.00,
      "currency": "NGN",
      "user_id": "uuid",
      "marketplace_type": "tech",
      "status": "active",
      "location_id": "uuid",
      "images": ["https://example.com/image1.jpg"],
      "attributes": {
        "condition": "new",
        "color": "black",
        "storage": "256GB"
      },
      "created_at": "2025-01-01T00:00:00Z",
      "updated_at": "2025-01-01T00:00:00Z",
      "user": {
        "username": "johndoe",
        "avatar_url": "https://example.com/avatar.jpg"
      },
      "location": {
        "name": "Lagos, Nigeria",
        "latitude": 6.5244,
        "longitude": 3.3792
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

#### Create Marketplace Listing

```
POST /api/marketplace
```

**Request Body:**

```json
{
  "title": "iPhone 15 Pro",
  "description": "Brand new iPhone 15 Pro...",
  "price": 1200.00,
  "currency": "NGN",
  "marketplace_type": "tech",
  "location_id": "uuid",
  "images": ["https://example.com/image1.jpg"],
  "attributes": {
    "condition": "new",
    "color": "black",
    "storage": "256GB"
  }
}
```

**Response:**

```json
{
  "id": "uuid",
  "title": "iPhone 15 Pro",
  "description": "Brand new iPhone 15 Pro...",
  "price": 1200.00,
  "currency": "NGN",
  "user_id": "uuid",
  "marketplace_type": "tech",
  "status": "active",
  "location_id": "uuid",
  "images": ["https://example.com/image1.jpg"],
  "attributes": {
    "condition": "new",
    "color": "black",
    "storage": "256GB"
  },
  "created_at": "2025-01-01T00:00:00Z",
  "updated_at": "2025-01-01T00:00:00Z"
}
```

### Monitoring Endpoints

#### Log Client Error

```
POST /api/monitoring/errors
```

**Request Body:**

```json
{
  "message": "Error message",
  "source": "client",
  "severity": "error",
  "stack": "Error stack trace...",
  "metadata": {
    "browser": "Chrome",
    "os": "Windows",
    "url": "/some/path"
  }
}
```

**Response:**

```json
{
  "id": "uuid",
  "message": "Error message",
  "source": "client",
  "severity": "error",
  "created_at": "2025-01-01T00:00:00Z"
}
```

#### Log Performance Metric

```
POST /api/monitoring/metrics
```

**Request Body:**

```json
{
  "type": "page_load",
  "value": 1250,
  "name": "Home Page",
  "metadata": {
    "browser": "Chrome",
    "os": "Windows",
    "url": "/"
  }
}
```

**Response:**

```json
{
  "id": "uuid",
  "type": "page_load",
  "value": 1250,
  "name": "Home Page",
  "created_at": "2025-01-01T00:00:00Z"
}
```

## Error Handling

All API endpoints return standard HTTP status codes:

- `200 OK`: Request succeeded
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request parameters
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `422 Unprocessable Entity`: Validation error
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

Error responses follow this format:

```json
{
  "error": {
    "code": "invalid_request",
    "message": "Detailed error message",
    "details": {
      "field": "Specific field error"
    }
  }
}
```

## Rate Limiting

API requests are rate-limited to prevent abuse. The current limits are:

- Authenticated users: 100 requests per minute
- Unauthenticated users: 20 requests per minute

Rate limit headers are included in all responses:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1609459200
```

## Versioning

The API is versioned using URL path versioning. The current version is v1:

```
/api/v1/resource
```

When a new version is released, the old version will be maintained for a deprecation period of at least 6 months.

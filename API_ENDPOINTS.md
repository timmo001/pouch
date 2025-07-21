# API Endpoints Documentation

This document describes the REST API endpoints that expose your Convex functions.

## Authentication

All endpoints require authentication via one of the following methods:

- **Header**: `X-Access-Token: your-token-here`
- **Query Parameter**: `?accessToken=your-token-here`

The default token is `dev-token-123` (configurable via `API_ACCESS_TOKEN` environment variable).

## Important Note

⚠️ **Current Limitation**: The Convex functions use Clerk authentication (`ctx.auth.getUserIdentity()`), but these API endpoints use simple token authentication. You'll need to either:

1. Create new internal Convex functions that don't require Clerk auth, OR
2. Configure the ConvexHttpClient to work with Clerk authentication

Until this is resolved, the API calls will fail with authentication errors.

## Groups API

### Get All Groups

```
GET /api/groups
```

Returns all groups for the authenticated user.

**Response:**

```json
{
  "data": [
    {
      "_id": "group_id",
      "_creationTime": 1234567890,
      "name": "My Group",
      "description": "Group description",
      "user": "user_identifier",
      "archived": false
    }
  ]
}
```

### Create Group

```
POST /api/groups
Content-Type: application/json

{
  "name": "Group Name",
  "description": "Optional description"
}
```

**Response:**

```json
{
  "data": {
    "id": "new_group_id"
  }
}
```

### Get Group by ID

```
GET /api/groups/{groupId}
```

### Update Group

```
PATCH /api/groups/{groupId}
Content-Type: application/json

{
  "name": "New Name",
  "description": "New Description"
}
```

### Delete Group

```
DELETE /api/groups/{groupId}
```

## List Items API

### Get List Items from Group

```
GET /api/list-items?group={groupId}
```

**Response:**

```json
{
  "data": {
    "active": [
      {
        "_id": "item_id",
        "type": "text",
        "value": "Item content",
        "description": "Optional description",
        "group": "group_id",
        "position": 100,
        "archived": false
      }
    ],
    "archived": []
  }
}
```

### Create List Item

```
POST /api/list-items
Content-Type: application/json

{
  "group": "group_id",
  "type": "text",
  "value": "Item content",
  "description": "Optional description"
}
```

### Get List Item by ID

```
GET /api/list-items/{itemId}?group={groupId}
```

### Update List Item

```
PATCH /api/list-items/{itemId}
Content-Type: application/json

{
  "group": "group_id",
  "type": "url",
  "value": "https://example.com",
  "description": "Updated description",
  "archived": true
}
```

### Delete List Item

```
DELETE /api/list-items/{itemId}?group={groupId}
```

### Reorder List Items

```
POST /api/list-items/reorder
Content-Type: application/json

{
  "group": "group_id",
  "orderedIds": ["item1", "item2", "item3"]
}
```

## Notepads API

### Get Notepad from Group

```
GET /api/notepads?group={groupId}
```

**Response:**

```json
{
  "data": {
    "_id": "notepad_id",
    "content": "Notepad content",
    "group": "group_id",
    "user": "user_identifier",
    "updatedAt": 1234567890
  }
}
```

### Create Notepad

```
POST /api/notepads
Content-Type: application/json

{
  "group": "group_id"
}
```

### Update Notepad

```
PATCH /api/notepads/{notepadId}
Content-Type: application/json

{
  "group": "group_id",
  "content": "Updated notepad content"
}
```

### Delete Notepad

```
DELETE /api/notepads/{notepadId}?group={groupId}
```

## Error Responses

All endpoints return errors in the following format:

```json
{
  "error": "Error message description"
}
```

Common HTTP status codes:

- `400` - Bad Request (missing required parameters)
- `401` - Unauthorized (missing access token)
- `403` - Forbidden (invalid access token)
- `500` - Internal Server Error

## Usage Examples

### Using curl with header authentication:

```bash
curl -H "X-Access-Token: dev-token-123" \
     -H "Content-Type: application/json" \
     -X POST \
     -d '{"name":"My New Group","description":"Test group"}' \
     http://localhost:3000/api/groups
```

### Using curl with query parameter authentication:

```bash
curl -H "Content-Type: application/json" \
     -X GET \
     "http://localhost:3000/api/groups?accessToken=dev-token-123"
```

### Using JavaScript fetch:

```javascript
const response = await fetch("/api/groups", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-Access-Token": "dev-token-123",
  },
  body: JSON.stringify({
    name: "My New Group",
    description: "Test group",
  }),
});

const result = await response.json();
```

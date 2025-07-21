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

## API Structure

The API follows the same structure as your application routes:

```
/api/groups/                           -> List groups
/api/groups/create/                    -> Create group
/api/groups/{group}/                   -> Group operations
/api/groups/{group}/list-items/        -> List items in group
/api/groups/{group}/list-items/create/ -> Create list item
/api/groups/{group}/list-items/{item}/ -> List item operations
/api/groups/{group}/list-items/reorder -> Reorder list items
/api/groups/{group}/notepads/          -> Notepad operations
/api/groups/{group}/notepads/{notepad} -> Individual notepad
```

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
POST /api/groups/create
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
GET /api/groups/{group}
```

### Update Group

```
PATCH /api/groups/{group}
Content-Type: application/json

{
  "name": "New Name",
  "description": "New Description"
}
```

### Delete Group

```
DELETE /api/groups/{group}
```

## List Items API

### Get List Items from Group

```
GET /api/groups/{group}/list-items
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
POST /api/groups/{group}/list-items
Content-Type: application/json

{
  "type": "text",
  "value": "Item content",
  "description": "Optional description"
}
```

### Create List Item (Alternative endpoint)

```
POST /api/groups/{group}/list-items/create
Content-Type: application/json

{
  "type": "text",
  "value": "Item content",
  "description": "Optional description"
}
```

### Get List Item by ID

```
GET /api/groups/{group}/list-items/{item}
```

### Update List Item

```
PATCH /api/groups/{group}/list-items/{item}
Content-Type: application/json

{
  "type": "url",
  "value": "https://example.com",
  "description": "Updated description",
  "archived": true
}
```

### Delete List Item

```
DELETE /api/groups/{group}/list-items/{item}
```

### Reorder List Items

```
POST /api/groups/{group}/list-items/reorder
Content-Type: application/json

{
  "orderedIds": ["item1", "item2", "item3"]
}
```

## Notepads API

### Get Notepad from Group

```
GET /api/groups/{group}/notepads
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
POST /api/groups/{group}/notepads
Content-Type: application/json

{}
```

### Update Notepad

```
PATCH /api/groups/{group}/notepads/{notepad}
Content-Type: application/json

{
  "content": "Updated notepad content"
}
```

### Delete Notepad

```
DELETE /api/groups/{group}/notepads/{notepad}
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
     http://localhost:3000/api/groups/create
```

### Using curl with query parameter authentication:

```bash
curl -H "Content-Type: application/json" \
     -X GET \
     "http://localhost:3000/api/groups?accessToken=dev-token-123"
```

### Using JavaScript fetch:

```javascript
// Create a group
const response = await fetch("/api/groups/create", {
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

// Get list items for a group
const listItemsResponse = await fetch("/api/groups/group123/list-items", {
  method: "GET",
  headers: {
    "X-Access-Token": "dev-token-123",
  },
});

// Create a list item
const createItemResponse = await fetch("/api/groups/group123/list-items", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-Access-Token": "dev-token-123",
  },
  body: JSON.stringify({
    type: "text",
    value: "My todo item",
    description: "This is a todo item",
  }),
});
```

## Migration from Old Structure

If you were using the old API structure, here are the mappings:

| Old Endpoint                                  | New Endpoint                                    |
| --------------------------------------------- | ----------------------------------------------- |
| `POST /api/groups`                            | `POST /api/groups/create`                       |
| `GET /api/groups/{id}`                        | `GET /api/groups/{group}`                       |
| `PATCH /api/groups/{id}`                      | `PATCH /api/groups/{group}`                     |
| `DELETE /api/groups/{id}`                     | `DELETE /api/groups/{group}`                    |
| `GET /api/list-items?group={groupId}`         | `GET /api/groups/{group}/list-items`            |
| `POST /api/list-items`                        | `POST /api/groups/{group}/list-items`           |
| `GET /api/list-items/{id}?group={groupId}`    | `GET /api/groups/{group}/list-items/{item}`     |
| `PATCH /api/list-items/{id}`                  | `PATCH /api/groups/{group}/list-items/{item}`   |
| `DELETE /api/list-items/{id}?group={groupId}` | `DELETE /api/groups/{group}/list-items/{item}`  |
| `POST /api/list-items/reorder`                | `POST /api/groups/{group}/list-items/reorder`   |
| `GET /api/notepads?group={groupId}`           | `GET /api/groups/{group}/notepads`              |
| `POST /api/notepads`                          | `POST /api/groups/{group}/notepads`             |
| `PATCH /api/notepads/{id}`                    | `PATCH /api/groups/{group}/notepads/{notepad}`  |
| `DELETE /api/notepads/{id}?group={groupId}`   | `DELETE /api/groups/{group}/notepads/{notepad}` |

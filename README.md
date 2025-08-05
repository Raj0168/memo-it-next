# 📚 **API Reference**

---

## 📝 Notes

### 1. **Create Note**

**POST** `/api/notes`

#### 🔸 Payload

```json
{
  "heading": "Note Title",
  "content": "...any content...",
  "timer": "2025-08-05T10:00:00.000Z",  // optional
  "folder": "folderObjectId"            // optional
}
```

#### ✅ Success Response `201`

```json
{
  "_id": "noteObjectId",
  "heading": "Note Title",
  "content": "...",
  "timer": "2025-08-05T10:00:00.000Z",
  "folder": "folderObjectId",
  "user": "userObjectId",
  "__v": 0
}
```

#### 🔒 Requires session (auth), folder must belong to user if provided.

---

### 2. **Get Note by ID**

**GET** `/api/notes/:id`

#### ✅ Success Response `200`

```json
{
  "_id": "noteObjectId",
  "heading": "Note Title",
  "content": "...",
  "timer": null,
  "folder": "folderObjectId",
  "user": "userObjectId",
  "__v": 0
}
```

#### 🔒 Authenticated user must own the note.

---

### 3. **Update Note**

**PUT** `/api/notes/:id`

#### 🔸 Payload

```json
{
  "heading": "Updated title",
  "content": "Updated content",
  "timer": "2025-08-06T12:00:00.000Z",
  "folder": "folderObjectId"
}
```

#### ✅ Success Response `200`

```json
{
  "_id": "noteObjectId",
  "heading": "Updated title",
  "content": "Updated content",
  "timer": "2025-08-06T12:00:00.000Z",
  "folder": "folderObjectId",
  "user": "userObjectId",
  "__v": 0
}
```

#### 🔒 Authenticated user must own the note and the folder (if changed).

---

### 4. **Delete Note**

**DELETE** `/api/notes/:id`

#### ✅ Success Response `200`

```json
{ "message": "Note deleted" }
```

#### 🔒 Must be the note's owner.

---

## 📁 Folders

### 5. **Create Folder**

**POST** `/api/folders`

#### 🔸 Payload

```json
{
  "name": "Work"
}
```

#### ✅ Success Response `201`

```json
{
  "_id": "folderObjectId",
  "name": "Work",
  "user": "userObjectId",
  "__v": 0
}
```

---

### 6. **Rename Folder**

**PATCH** `/api/folders/:id`

#### 🔸 Payload

```json
{
  "name": "New Folder Name"
}
```

#### ✅ Success Response `200`

```json
{
  "_id": "folderObjectId",
  "name": "New Folder Name",
  "user": "userObjectId",
  "__v": 0
}
```

#### 🔒 Folder must belong to the user.

---

### 7. **Delete Folder**

**DELETE** `/api/folders/:id`

#### ✅ Success Response `200`

```json
{ "message": "Folder deleted" }
```

> Also **unlinks all notes** that reference this folder.

---

## 👤 User Preferences (if implemented)

### 8. **Update User Preferences**

**PATCH** `/api/user/preferences`

#### 🔸 Payload (example)

```json
{
  "darkMode": true
}
```

#### ✅ Success Response `200`

```json
{
  "_id": "userObjectId",
  "email": "user@example.com",
  "preferences": {
    "darkMode": true
  }
}
```

---

## 👥 Auth (NextAuth handles most of this)

If you added a custom **register endpoint**:

### 9. **Register**

**POST** `/api/register`

#### 🔸 Payload

```json
{
  "email": "newuser@example.com",
  "password": "securePassword123"
}
```

#### ✅ Success Response `201`

```json
{
  "message": "User registered"
}
```

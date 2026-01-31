# API Test Documentation

**Project:** JSONPlaceholder API Testing  
**Base URL:** https://jsonplaceholder.typicode.com  
**Tool Used:** Postman  
**API Type:** Mock REST API  

---

## 1. Overview

This document describes API test cases executed against **JSONPlaceholder**, a public mock REST API used for testing and prototyping.

The purpose of this testing is to:
- Validate API behavior for all HTTP methods
- Cover both positive and negative scenarios
- Document differences between expected real-world behavior and mock API behavior

I use ChatGPT to create test cases and documentation

<p align="center">
  <br>
    <img src="chatgpt%20prompt.png" alt="Copilot test template suggestion" width="400">
  <br>
</p>

> ⚠️ **Important Note**  
> JSONPlaceholder is a **mock API**:
> - No real database persistence  
> - No strict input validation  
> - Non-existing resource operations may still return successful responses  

---

## 2. Test Scope

### Covered Routes
- `/posts`
- `/comments`

### Covered HTTP Methods
- GET  
- POST  
- PUT  
- PATCH  
- DELETE  

---

## 3. Test Case Structure

Each test case includes:
- Test Case ID  
- HTTP Method  
- Endpoint  
- Scenario  
- Request Body  
- Expected Status  
- Expected Result  
- Actual Result  
- Actual Status  
- Final Result  
- Test Type  

---

## 4. Posts API Test Cases

### Endpoint: `/posts`

| TC ID | Method | Endpoint | Scenario | Request Body | Expected Status | Expected Result | Actual Result | Actual Status | Result | Type |
|------|--------|----------|----------|--------------|-----------------|-----------------|---------------|---------------|--------|------|
| P-01 | GET | /posts | Get all posts | N/A | 200 | List of posts | List of posts | 200 | OK | Positive |
| P-02 | GET | /posts/1 | Get post by valid ID | N/A | 200 | Post returned | Post returned | 200 | OK | Positive |
| P-03 | GET | /posts/999999999 | Get post by invalid ID | N/A | 404 | Empty object | Empty object | 404 | OK | Negative |
| P-04 | POST | /posts | Create new post | Valid JSON | 201 | Post created | Post created | 201 | OK | Positive |
| P-05 | POST | /posts | Create post with empty body | `{}` | 201 | Created (no validation) | `{ "id": 101 }` | 201 | OK | Negative |
| P-06 | PUT | /posts/1 | Update post fully | Valid JSON | 200 | Post updated | Post updated | 200 | OK | Positive |
| P-07 | PUT | /posts/9999 | Update non-existing post | Valid JSON | 500 | Mock update | TypeError: Cannot read properties of undefined | 500 | OK | Negative |
| P-08 | PATCH | /posts/1 | Partial update post | Partial JSON | 200 | Field updated | Field updated | 200 | OK | Positive |
| P-09 | PATCH | /posts/1 | Partial update non-existing post | Partial JSON | 404 | Field updated | Field updated | 200 | NOT OK | Negative |
| P-10 | DELETE | /posts/1 | Delete post | N/A | 200 | Empty response | Empty response | 200 | OK | Positive |

---

## 5. Comments API Test Cases

### Endpoint: `/comments`

| TC ID | Method | Endpoint | Scenario | Request Body | Expected Status | Expected Result | Actual Result | Actual Status | Result | Type |
|------|--------|----------|----------|--------------|-----------------|-----------------|---------------|---------------|--------|------|
| C-01 | GET | /comments | Get all comments | N/A | 200 | List of comments | List of comments | 200 | OK | Positive |
| C-02 | GET | /comments/1 | Get comment by ID | N/A | 200 | Comment returned | Comment returned | 200 | OK | Positive |
| C-03 | GET | /comments/9999 | Invalid comment ID | N/A | 404 | Empty object | Empty object | 404 | OK | Negative |
| C-04 | POST | /comments | Create new comment | Valid JSON | 201 | Comment created | Comment created | 201 | OK | Positive |
| C-05 | POST | /comments/1 | Create comment with empty body | `{}` | 201 | Created (no validation) | `{ "id": 501 }` | 201 | OK | Negative |
| C-06 | PUT | /comments/1 | Update comment | Valid JSON | 200 | Comment updated | Comment updated | 200 | OK | Positive |
| C-07 | PUT | /comments/88888 | Update non-existing comment | Valid JSON | 500 | Comment updated | TypeError: Cannot read properties of undefined | 500 | OK | Negative |
| C-08 | PATCH | /comments/1 | Partial update comment | Partial JSON | 200 | Field updated | Field updated | 200 | OK | Positive |
| C-09 | PATCH | /comments/1 | Partial update non-existing comment | Partial JSON | 404 | Field updated | Field updated | 200 | NOT OK | Negative |
| C-10 | DELETE | /comments/1 | Delete comment | N/A | 200 | Empty response | Empty response | 200 | OK | Positive |

---

## 6. Observations & Limitations

- PATCH and PUT on non-existing IDs may return `200 OK`
- POST requests accept empty bodies
- DELETE operations always return success
- Error handling does not follow real REST API standards

These behaviors are expected due to the **mock nature** of JSONPlaceholder.

---

## 7. Conclusion

The API behaves consistently as a mock service.  
All test cases were executed successfully within the expected limitations of JSONPlaceholder.

This documentation demonstrates:
- Full HTTP method coverage  
- Positive and negative testing  
- Awareness of mock API constraints  
- Professional QA reporting  

---

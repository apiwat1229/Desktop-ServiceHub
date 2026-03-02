# 🐛 Backend Bug Report: SQLAlchemy Async Configuration Issue

**Date:** 2 March 2026  
**Reporter:** Frontend Team  
**Severity:** Critical  
**Affected Service:** FastAPI Backend (Docker Container)  
**Container:** `ytrc-fastapi-api` (Port 2530)

---

## 📋 Executive Summary

The FastAPI backend running in Docker has a critical SQLAlchemy async configuration error that prevents most database operations from completing successfully. This issue manifests as `MissingGreenlet` errors and results in 500 Internal Server Errors for ticket creation and update operations.

---

## 🔴 Problem Description

### Symptoms
1. **Ticket Creation Fails**: Can create 2-3 tickets successfully, then all subsequent requests fail with 500 errors
2. **Ticket Updates Fail**: All PATCH requests to `/api/it-tickets/:id` return 500 errors
3. **Database Operations Blocked**: After initial successful operations, all database transactions fail

### Error Pattern
- ✅ First 2-3 POST requests: **Success (200 OK)**
- ❌ Subsequent POST requests: **500 Internal Server Error**
- ❌ All PATCH requests: **500 Internal Server Error**
- ✅ GET `/api/health`: **200 OK** (continues working)

---

## 🔍 Technical Details

### Error Log from Docker Container

```
sqlalchemy.exc.MissingGreenlet: greenlet_spawn has not been called; 
can't call await_only() here. Was IO attempted in an unexpected place? 
(Background on this error at: https://sqlalche.me/e/20/xd2s)
```

### Full Stack Trace
```python
File "/usr/local/lib/python3.13/site-packages/sqlalchemy/orm/session.py", line 2351, in execute
    return self._execute_internal(
        statement,
        ...
    )
File "/usr/local/lib/python3.13/site-packages/sqlalchemy/orm/session.py", line 2249, in _execute_internal
    result: Result[Any] = compile_state_cls.orm_execute_statement(
        self,
        ...
    )
File "/usr/local/lib/python3.13/site-packages/sqlalchemy/dialects/postgresql/asyncpg.py", line 585, in execute
    self._adapt_connection.await_(
        self._prepare_and_execute(operation, parameters)
    )
File "/usr/local/lib/python3.13/site-packages/sqlalchemy/util/_concurrency_py3k.py", line 123, in await_only
    raise exc.MissingGreenlet(
        ...
    )
```

### Environment
- **Python Version:** 3.13
- **SQLAlchemy:** Latest (async version)
- **Database Driver:** asyncpg (PostgreSQL)
- **Framework:** FastAPI with async endpoints

---

## 🧪 Reproduction Steps

1. Start the Docker container: `ytrc-fastapi-api`
2. Send POST request to `/api/it-tickets` with valid payload
   - First 2-3 requests: ✅ Success
3. Send 4th POST request to `/api/it-tickets`
   - Result: ❌ 500 Internal Server Error
4. Send PATCH request to `/api/it-tickets/{id}`
   - Result: ❌ 500 Internal Server Error

### Test Payload (POST /api/it-tickets)
```json
{
  "title": "Test ticket",
  "description": "Test description",
  "category": "Hardware > Computer > Slow Performance",
  "priority": "Medium",
  "location": "Floor 1"
}
```

---

## 💡 Root Cause Analysis

The error `MissingGreenlet: greenlet_spawn has not been called` indicates that:

1. **Async Context Not Properly Initialized**: SQLAlchemy async sessions require proper greenlet spawning for async operations
2. **Session Lifecycle Issue**: Database sessions may not be properly scoped or closed after each request
3. **Connection Pool Exhaustion**: After initial requests, the connection pool may be exhausted without proper cleanup

---

## 🛠️ Recommended Fixes

### Option 1: Fix Async Session Configuration (Recommended)

Ensure proper async session setup:

```python
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

# Create async engine
engine = create_async_engine(
    DATABASE_URL,
    echo=True,
    future=True
)

# Create async session factory
async_session = sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False
)

# Dependency for FastAPI
async def get_db():
    async with async_session() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
```

### Option 2: Add Greenlet Spawning

If using nested async operations:

```python
from sqlalchemy.util import greenlet_spawn

async def create_ticket(db: AsyncSession, ticket_data):
    # Ensure greenlet context
    async with greenlet_spawn():
        result = await db.execute(
            insert(ITTicket).values(**ticket_data)
        )
        await db.commit()
        return result
```

### Option 3: Switch to Sync SQLAlchemy (If Async Not Required)

If async operations aren't critical:

```python
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session

# Sync engine
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()
```

---

## 📊 Impact Assessment

### Affected Endpoints
- ❌ `POST /api/it-tickets` - Fails after 2-3 requests
- ❌ `PATCH /api/it-tickets/{id}` - Always fails
- ❌ `DELETE /api/it-tickets/{id}` - Likely fails
- ✅ `GET /api/it-tickets` - Works (read-only)
- ✅ `GET /api/health` - Works

### Business Impact
- **Critical**: Cannot create new tickets reliably
- **Critical**: Cannot update ticket status
- **High**: Data management operations blocked
- **Medium**: Frontend development blocked for local testing

---

## ✅ Verification Steps

After implementing the fix, verify:

1. ✅ Can create 30+ tickets consecutively without errors
2. ✅ Can update ticket status via PATCH requests
3. ✅ Can delete tickets via DELETE requests
4. ✅ No `MissingGreenlet` errors in Docker logs
5. ✅ Connection pool properly releases connections

### Test Script
```bash
# Test consecutive ticket creation
for i in {1..30}; do
  curl -X POST http://localhost:2530/api/it-tickets \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d '{"title":"Test '$i'","description":"Test","category":"Hardware > Computer > Slow Performance","priority":"Medium","location":"Floor 1"}'
  echo "Created ticket $i"
  sleep 1
done
```

---

## 📚 References

- [SQLAlchemy Async Documentation](https://docs.sqlalchemy.org/en/20/orm/extensions/asyncio.html)
- [SQLAlchemy Error xd2s - MissingGreenlet](https://sqlalche.me/e/20/xd2s)
- [FastAPI with Async SQLAlchemy](https://fastapi.tiangolo.com/advanced/async-sql-databases/)

---

## 📞 Contact

**Frontend Team**  
For questions or clarification, please contact the frontend development team.

**Priority:** Please address this issue as it's blocking local development and testing.

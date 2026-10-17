import os
import json
import asyncio
from typing import Dict, Any, List, Optional
import motor.motor_asyncio
import certifi
from app.core.config import settings

class LocalRepository:
    """Thread-safe persistent local repository used when MongoDB Atlas URI is unconfigured or offline."""
    def __init__(self, data_file: str = "backend/data/local_db.json"):
        self.data_file = data_file
        self.lock = asyncio.Lock()
        os.makedirs(os.path.dirname(self.data_file), exist_ok=True)
        self._load()

    def _load(self):
        if os.path.exists(self.data_file):
            try:
                with open(self.data_file, "r", encoding="utf-8") as f:
                    self.db = json.load(f)
            except Exception:
                self.db = self._init_empty()
        else:
            self.db = self._init_empty()
            self._save()

    def _init_empty(self) -> Dict[str, Any]:
        return {
            "users": [],
            "farms": [],
            "weather_cache": {},
            "mandi_cache": {},
            "crop_analyses": [],
            "tasks": [],
            "schemes_bookmarks": [],
            "chat_messages": [],
            "video_interactions": [],
            "notifications": []
        }

    def _save(self):
        try:
            with open(self.data_file, "w", encoding="utf-8") as f:
                json.dump(self.db, f, indent=2, ensure_ascii=False)
        except Exception as e:
            print(f"[LocalRepository] Warning: failed to save to disk: {e}")

    async def find_one(self, collection: str, query: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        async with self.lock:
            items = self.db.get(collection, [])
            for item in items:
                match = all(item.get(k) == v for k, v in query.items())
                if match:
                    return dict(item)
            return None

    async def find(self, collection: str, query: Optional[Dict[str, Any]] = None, limit: int = 100) -> List[Dict[str, Any]]:
        async with self.lock:
            items = self.db.get(collection, [])
            if not query:
                return [dict(i) for i in items[:limit]]
            results = []
            for item in items:
                if all(item.get(k) == v for k, v in query.items()):
                    results.append(dict(item))
                if len(results) >= limit:
                    break
            return results

    async def insert_one(self, collection: str, doc: Dict[str, Any]) -> Dict[str, Any]:
        async with self.lock:
            if collection not in self.db:
                self.db[collection] = []
            self.db[collection].insert(0, doc)
            self._save()
            return dict(doc)

    async def update_one(self, collection: str, query: Dict[str, Any], update: Dict[str, Any]) -> bool:
        async with self.lock:
            items = self.db.get(collection, [])
            for i, item in enumerate(items):
                if all(item.get(k) == v for k, v in query.items()):
                    items[i].update(update)
                    self._save()
                    return True
            return False

    async def delete_one(self, collection: str, query: Dict[str, Any]) -> bool:
        async with self.lock:
            items = self.db.get(collection, [])
            for i, item in enumerate(items):
                if all(item.get(k) == v for k, v in query.items()):
                    items.pop(i)
                    self._save()
                    return True
            return False

class MongoAtlasRepository:
    """Async repository adapter for MongoDB Atlas implementing the unified database interface."""
    def __init__(self, db):
        self.db = db

    async def find_one(self, collection: str, query: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        doc = await self.db[collection].find_one(query)
        if doc and "_id" in doc:
            doc["_id"] = str(doc["_id"])
        return doc

    async def find(self, collection: str, query: Optional[Dict[str, Any]] = None, limit: int = 100) -> List[Dict[str, Any]]:
        cursor = self.db[collection].find(query or {}).limit(limit)
        items = []
        async for doc in cursor:
            if "_id" in doc:
                doc["_id"] = str(doc["_id"])
            items.append(doc)
        return items

    async def insert_one(self, collection: str, document: Dict[str, Any]) -> str:
        doc_copy = dict(document)
        res = await self.db[collection].insert_one(doc_copy)
        return str(res.inserted_id)

    async def update_one(self, collection: str, query: Dict[str, Any], update: Dict[str, Any]) -> bool:
        res = await self.db[collection].update_one(query, {"$set": update})
        return res.modified_count > 0

    async def delete_one(self, collection: str, query: Dict[str, Any]) -> bool:
        res = await self.db[collection].delete_one(query)
        return res.deleted_count > 0

local_repo = LocalRepository()
mongo_repo = None

async def init_database():
    global mongo_repo
    if settings.MONGODB_URI and "mongodb" in settings.MONGODB_URI:
        try:
            client = motor.motor_asyncio.AsyncIOMotorClient(
                settings.MONGODB_URI,
                serverSelectionTimeoutMS=5000,
                tlsCAFile=certifi.where()
            )
            # Test ping
            await client.admin.command('ping')
            db = client[settings.DATABASE_NAME]
            mongo_repo = MongoAtlasRepository(db)
            print("[Database] Successfully connected to MongoDB Atlas!")
        except Exception as e:
            print(f"[Database] MongoDB connection failed ({e}). Defaulting to LocalRepository.")
            mongo_repo = None
    else:
        print("[Database] Using resilient LocalRepository (No MONGODB_URI set).")

async def get_db_client():
    return mongo_repo if mongo_repo is not None else local_repo

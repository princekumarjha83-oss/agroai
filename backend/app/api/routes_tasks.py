import uuid
from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from app.models.schemas import TaskCreate, TaskResponse, TaskUpdate
from app.core.security import get_current_user_payload
from app.core.database import get_db_client
from app.services.crop_calendar_service import calculate_crop_calendar_plan

router = APIRouter(prefix="/tasks", tags=["Crop Calendar & Field Operations"])

SEED_TASKS = [
    {
        "id": "task-1",
        "user_id": "farmer-001",
        "title": "First CRI stage irrigation in North Terrace Wheat Field",
        "title_hindi": "उत्तरी खेत में गेहूं का पहला पानी (CRI स्टेज)",
        "crop": "Wheat GW-322",
        "plot_name": "North Terrace Field",
        "due_date": "2026-10-19",
        "category": "Irrigation",
        "priority": "High",
        "is_completed": False,
        "created_at": "2026-10-15T00:00:00Z"
    },
    {
        "id": "task-2",
        "user_id": "farmer-001",
        "title": "Aphid scouting in Mustard ridge block with yellow traps",
        "title_hindi": "सरसों के खेत में माहू कीट की निगरानी",
        "crop": "Mustard Pusa Bold",
        "plot_name": "Canal Ridge Basin",
        "due_date": "2026-10-21",
        "category": "Pest Scouting",
        "priority": "Medium",
        "is_completed": False,
        "created_at": "2026-10-15T00:00:00Z"
    }
]

@router.get("", response_model=List[TaskResponse])
async def list_my_tasks(current_user: dict = Depends(get_current_user_payload)):
    user_id = current_user["sub"]
    db = await get_db_client()
    tasks = await db.find("tasks", {"user_id": user_id})
    if not tasks and user_id == "farmer-001":
        tasks = SEED_TASKS
    return [TaskResponse(**t) for t in tasks]

@router.post("", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def create_task(req: TaskCreate, current_user: dict = Depends(get_current_user_payload)):
    user_id = current_user["sub"]
    db = await get_db_client()
    new_task = {
        "id": f"task-{uuid.uuid4().hex[:8]}",
        "user_id": user_id,
        "title": req.title,
        "title_hindi": req.title_hindi or req.title,
        "crop": req.crop,
        "plot_name": req.plot_name,
        "due_date": req.due_date,
        "category": req.category,
        "priority": req.priority,
        "is_completed": False,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.insert_one("tasks", new_task)
    return TaskResponse(**new_task)

@router.put("/{task_id}", response_model=TaskResponse)
async def update_task(task_id: str, req: TaskUpdate, current_user: dict = Depends(get_current_user_payload)):
    user_id = current_user["sub"]
    db = await get_db_client()
    task = await db.find_one("tasks", {"id": task_id, "user_id": user_id})
    if not task:
        for st in SEED_TASKS:
            if st["id"] == task_id:
                task = dict(st)
                break
    if not task:
        raise HTTPException(status_code=404, detail="Task not found or access denied.")

    update_fields = {}
    if req.title is not None:
        update_fields["title"] = req.title
    if req.title_hindi is not None:
        update_fields["title_hindi"] = req.title_hindi
    if req.crop is not None:
        update_fields["crop"] = req.crop
    if req.plot_name is not None:
        update_fields["plot_name"] = req.plot_name
    if req.due_date is not None:
        update_fields["due_date"] = req.due_date
    if req.category is not None:
        update_fields["category"] = req.category
    if req.priority is not None:
        update_fields["priority"] = req.priority
    if req.is_completed is not None:
        update_fields["is_completed"] = req.is_completed

    if update_fields:
        await db.update_one("tasks", {"id": task_id, "user_id": user_id}, update_fields)
        task.update(update_fields)

    return TaskResponse(**task)

@router.delete("/{task_id}")
async def delete_task(task_id: str, current_user: dict = Depends(get_current_user_payload)):
    user_id = current_user["sub"]
    db = await get_db_client()
    await db.delete_one("tasks", {"id": task_id, "user_id": user_id})
    return {"message": "Task removed successfully", "id": task_id}

@router.patch("/{task_id}/toggle", response_model=TaskResponse)
async def toggle_task_status(task_id: str, current_user: dict = Depends(get_current_user_payload)):
    user_id = current_user["sub"]
    db = await get_db_client()
    task = await db.find_one("tasks", {"id": task_id, "user_id": user_id})
    if not task:
        for st in SEED_TASKS:
            if st["id"] == task_id:
                task = dict(st)
                break
    if not task:
        raise HTTPException(status_code=404, detail="Task not found or access denied.")

    new_status = not task.get("is_completed", False)
    await db.update_one("tasks", {"id": task_id, "user_id": user_id}, {"is_completed": new_status})
    task["is_completed"] = new_status
    return TaskResponse(**task)

@router.post("/generate", response_model=List[TaskResponse])
async def generate_icar_tasks(
    crop: str = "Wheat",
    variety: Optional[str] = None,
    sowing_date: str = "2026-11-12",
    plot_name: str = "North Terrace Field",
    current_user: dict = Depends(get_current_user_payload)
):
    user_id = current_user["sub"]
    db = await get_db_client()

    plan = await calculate_crop_calendar_plan(
        crop=crop,
        variety=variety,
        sowing_date_str=sowing_date,
        plot_name=plot_name
    )

    created_tasks = []
    for rec in plan.get("recommended_tasks", []):
        new_task = {
            "id": f"task-{uuid.uuid4().hex[:8]}",
            "user_id": user_id,
            "title": rec["title"],
            "title_hindi": rec.get("title_hindi") or rec["title"],
            "crop": rec.get("crop", crop),
            "plot_name": rec.get("plot_name", plot_name),
            "due_date": rec["due_date"],
            "category": rec.get("category", "Agronomy"),
            "priority": rec.get("priority", "Medium"),
            "is_completed": False,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.insert_one("tasks", new_task)
        created_tasks.append(TaskResponse(**new_task))

    return created_tasks

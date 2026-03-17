import asyncio
from datetime import datetime, timezone

from bson import ObjectId

from app.db.collections import get_incidents_collection


async def remediate_incident(incident_id: str, ai_action: str) -> bool:
	incidents_collection = get_incidents_collection()

	# Simulate execution delay of autonomous remediation.
	await asyncio.sleep(0.1)

	result = await incidents_collection.update_one(
		{"_id": ObjectId(incident_id)},
		{
			"$set": {
				"status": "resolved",
				"resolved_at": datetime.now(timezone.utc),
				"ai_action": ai_action,
			}
		},
	)

	return result.modified_count > 0

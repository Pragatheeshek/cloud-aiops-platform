from datetime import datetime, timezone


def calculate_sla_risk(created_at: datetime) -> dict[str, int | str]:
    now = datetime.now(timezone.utc)

    if created_at.tzinfo is None:
        created_at = created_at.replace(tzinfo=timezone.utc)

    duration_seconds = max(0.0, (now - created_at).total_seconds())

    if duration_seconds < 5:
        return {"sla_risk_score": 20, "risk_level": "LOW"}

    if 5 <= duration_seconds <= 15:
        return {"sla_risk_score": 50, "risk_level": "MEDIUM"}

    return {"sla_risk_score": 85, "risk_level": "HIGH"}

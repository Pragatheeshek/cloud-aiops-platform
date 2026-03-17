from datetime import datetime

from pydantic import BaseModel, Field


class MetricIn(BaseModel):
	cpu_usage: float = Field(ge=0, le=100)
	memory_usage: float = Field(ge=0, le=100)
	network_traffic: float
	error_rate: float = Field(ge=0)


class MetricRecord(BaseModel):
	id: str
	tenant_id: str
	cpu_usage: float
	memory_usage: float
	network_traffic: float
	error_rate: float
	timestamp: datetime

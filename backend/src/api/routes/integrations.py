import os

from fastapi import APIRouter

router = APIRouter(prefix="/integrations", tags=["integrations"])


@router.get("/status")
def integration_status():
    return {
        "openai": {"enabled": bool(os.getenv("OPENAI_API_KEY"))},
        "stripe": {"enabled": bool(os.getenv("STRIPE_SECRET_KEY"))},
        "sendgrid": {"enabled": bool(os.getenv("SENDGRID_API_KEY"))},
        "sentry": {"enabled": bool(os.getenv("SENTRY_DSN"))},
        "datadog": {"enabled": bool(os.getenv("DD_API_KEY"))},
    }

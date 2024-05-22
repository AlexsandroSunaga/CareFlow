from app.core.config import settings


def summarize_redacted_text(text: str) -> str:
    cleaned = " ".join(text.split())
    if not cleaned.strip():
        return "No extractable text after redaction. Review the source scan quality."

    if settings.openai_api_key:
        try:
            from openai import OpenAI

            client = OpenAI(api_key=settings.openai_api_key)
            resp = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {
                        "role": "system",
                        "content": (
                            "You are a clinical operations assistant. Summarize only the "
                            "de-identified intake text for staff prep. Do not invent diagnoses. "
                            "Use bullet points: chief concern, medications mentioned, follow-ups."
                        ),
                    },
                    {"role": "user", "content": cleaned[:6000]},
                ],
                temperature=0.2,
            )
            return (resp.choices[0].message.content or "").strip()
        except Exception as exc:  # noqa: BLE001
            return f"AI summary unavailable ({exc}). Local summary below.\n\n" + _local_summary(cleaned)

    return _local_summary(cleaned)


def _local_summary(text: str) -> str:
    words = text.lower().split()
    flags = []
    if any(w in words for w in ("pain", "fever", "cough", "injury")):
        flags.append("Symptom keywords present — triage per protocol.")
    if "medication" in text.lower() or "rx" in text.lower():
        flags.append("Medication references detected — verify against formulary.")
    if "allergy" in text.lower():
        flags.append("Allergy mention — highlight for nurse review.")
    body = flags or ["Routine intake — no urgent keyword hits in redacted text."]
    return "Staff prep (local):\n" + "\n".join(f"- {line}" for line in body)

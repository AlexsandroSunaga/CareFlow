# Legacy layout (deprecated)

CareFlow API now follows [FastAPI-Backend-Template](https://github.com/Aeternalis-Ingenium/FastAPI-Backend-Template) under **`../backend/`**.

```powershell
cd ..\backend
$env:PYTHONPATH="src"
uvicorn src.main:backend_app --reload --port 8011
```

Or use `..\run.ps1` from the product root.

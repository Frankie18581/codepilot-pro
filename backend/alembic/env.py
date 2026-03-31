from backend.app.db.models import Base
from backend.app.core.config import settings

# ... (Alembic generated code)

target_metadata = Base.metadata

def run_migrations_online():
    # ... (Alembic generated code)
    connectable = create_engine(settings.DATABASE_URL)
    # ... (Alembic generated code)

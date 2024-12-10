import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database.db_connector import DatabaseConnection
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def init_database():
    db = DatabaseConnection()

    # Read SQL from migration file
    migration_file = os.path.join(
        os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
        'database',
        'migrations',
        'initial.sql'
    )

    with open(migration_file, 'r') as f:
        sql = f.read()

    try:
        # Execute migrations
        with db.get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(sql)
                conn.commit()
        logger.info("Database initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize database: {e}")
        raise

if __name__ == "__main__":
    init_database()
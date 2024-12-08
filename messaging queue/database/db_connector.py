# database/db_connector.py
import psycopg2
from psycopg2.extras import RealDictCursor
import logging
from config.settings import Config
from utils.decorators import retry

logger = logging.getLogger(__name__)

class DatabaseConnection:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def __init__(self):
        self.config = Config()
        self.conn = None
        self.connect()

    @retry(exceptions=(psycopg2.Error,))
    def connect(self):
        if self.conn is not None:
            try:
                self.conn.close()
            except:
                pass

        # Corrected connection string
        connection_string = (
            f"postgresql://{self.config.DB_USER}:{self.config.DB_PASSWORD}"
            f"@{self.config.DB_HOST}/{self.config.DB_NAME}?sslmode={self.config.DB_SSL_MODE}"
        )

        self.conn = psycopg2.connect(
            connection_string,
            cursor_factory=RealDictCursor
        )
        logger.info("Database connection established")

    def get_connection(self):
        if self.conn is None or self.conn.closed:
            self.connect()
        return self.conn

    def execute_query(self, query, params=None):
        conn = self.get_connection()
        with conn.cursor() as cur:
            cur.execute(query, params)
            conn.commit()
            return cur

    def fetch_one(self, query, params=None):
        with self.execute_query(query, params) as cur:
            return cur.fetchone()

    def fetch_all(self, query, params=None):
        with self.execute_query(query, params) as cur:
            return cur.fetchall()
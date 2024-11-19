from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from langchain_community.agent_toolkits.sql.base import create_sql_agent
from langchain.agents.agent_types import AgentType

from langchain_openai import ChatOpenAI
from langchain_community.agent_toolkits.sql.toolkit import SQLDatabaseToolkit
from langchain_community.callbacks.manager import get_openai_callback
from langchain_community.utilities import SQLDatabase

from sqlalchemy import create_engine, text
# from sqlalchemy.engine import Engine
import os
from dotenv import load_dotenv
from typing import List, Dict
# from contextlib import contextmanager

# Load environment variables
load_dotenv()

class DatabaseConnector:
    def __init__(self, password: str,db_type: str = "postgresql", username: str = "postgres",  host: str = "localhost", port: int = 5432, 
             database: str = "your_database" ):
                self.db_type = db_type
                self.username = username
                self.password = password
                self.host = host
                self.port = port
                self.database = database
                self.engine = None
                self.connect()

    def connect(self):
        """Initializes the database engine with the provided credentials."""
        db_uri = f"postgresql+psycopg2://{self.username}:{self.password}@{self.host}:{self.port}/{self.database}"
        try:
            self.engine = create_engine(db_uri)
            print("Database connection established.")
        except Exception as e:
            print(f"Failed to connect to the database: {e}")
            raise

    def execute_query(self, query: str):
        """Executes a query and returns results if any."""
        if not self.engine:
            raise ConnectionError("Database not connected. Call connect() first.")
        try:
            with self.engine.connect() as connection:
                result = connection.execute(text(query))
                # Check if the query returns rows
                if result.returns_rows:
                    return result.fetchall()
                else:
                    # Commit for DML statements and return None
                    connection.commit()
                    print("Query executed successfully (no rows to return).")
                    return None
        except Exception as e:
            print(f"Query execution failed: {e}")
            raise

    def close(self):
        """Disposes of the database engine."""
        if self.engine:
            self.engine.dispose()
            print("Database connection closed.")

    @property
    def get_engine(self):
        """Returns the SQLAlchemy engine."""
        return self.engine

class DatabaseManager:
    def __init__(self):
        self.connector = None
        self.langchain_db = None
        self.agent_executor = None
        self.db_context = self._create_db_context()
        self.setup_database()
        self.setup_langchain()

    def setup_database(self):
        """Initialize database connection"""
        try:
            self.connector = DatabaseConnector(
                db_type="mysql+pymysql",
                username=os.getenv("DB_USER"),
                password=os.getenv("DB_PASSWORD"),
                host=os.getenv("DB_HOST", "localhost"),
                port=int(os.getenv("DB_PORT", "3306")),
                database=os.getenv("DB_NAME")
            )
        except Exception as e:
            raise ConnectionError(f"Failed to initialize database: {e}")
        
    def _create_db_context(self) -> str:
        """
        Create a comprehensive context string about the database.
        Customize this method with your specific database context.
        """
        return """
        This is an automotive parts e-commerce system with 7 major categories: 
        Engine Parts, Electrical Parts, Braking System, Suspension Parts, Fuel System, Exhaust System, and Transmission.
        Each product category contains specific product types (like AIR COMPRESSOR, ENGINE BLOCK) which further break down 
        into specific parts with unique part_id and sub_part combinations. Products are priced between $500-$1000 and maintain stock levels between 10-30 units. 
        The system tracks complete order fulfillment from user purchase through payment processing and shipping to final delivery.
        
        Note: All financial calculations should be rounded to 2 decimal places
        """

    def setup_langchain(self):
        """Initialize LangChain components"""
        try:
            # Initialize LangChain SQL Database wrapper
            self.langchain_db = SQLDatabase(engine=self.connector.get_engine)
            
            # Initialize LLM
            llm = ChatOpenAI(
                temperature=0.1,
                model_name="gpt-3.5-turbo",
                openai_api_key=os.getenv("OPENAI_API_KEY")
            )
            
            # Create SQL toolkit and agent
            toolkit = SQLDatabaseToolkit(db=self.langchain_db, llm=llm)
            
            self.agent_executor = create_sql_agent(
                llm=llm,
                toolkit=toolkit,
                verbose=True,
                agent_type=AgentType.ZERO_SHOT_REACT_DESCRIPTION
            )
        except Exception as e:
            raise Exception(f"Failed to initialize LangChain components: {e}")

    def get_schema_info(self) -> Dict[str, List[str]]:
        """Get database schema information"""
        try:
            schema_info = {}
            tables = self.langchain_db.get_table_names()
            for table in tables:
                columns = self.langchain_db.get_table_info(table)
                schema_info[table] = columns
            return schema_info
        except Exception as e:
            raise Exception(f"Failed to get schema information: {e}")

    def execute_query(self, question: str) -> Dict:
        """Execute a natural language query"""
        try:
            with get_openai_callback() as cb:
                result = self.agent_executor.run(question)
                
                return {
                    "answer": result,
                    "metadata": {
                        "tokens_used": {
                            "prompt_tokens": cb.prompt_tokens,
                            "completion_tokens": cb.completion_tokens,
                            "total_tokens": cb.total_tokens
                        },
                        "cost": cb.total_cost
                    }
                }
        except Exception as e:
            raise Exception(f"Failed to execute query: {e}")

    def close(self):
        """Close database connection"""
        if self.connector:
            self.connector.close()

# Initialize FastAPI app
app = FastAPI(title="Database Query API")

# Initialize DatabaseManager
db_manager = DatabaseManager()

@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    db_manager.close()

class Query(BaseModel):
    question: str

@app.post("/query")
async def query_database(query: Query):
    """Execute a natural language query against the database"""
    try:
        result = db_manager.execute_query(query.question)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# @app.get("/schema")
# async def get_schema():
#     """Get database schema information"""
#     try:
#         schema = db_manager.get_schema_info()
#         return {"schema": schema}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
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
        """Initializes the database connection to Neon database."""
        # Use the Neon connection string format
        # db_uri = f"{self.db_type}://{self.username}:{self.password}@{self.host}/{self.database}?sslmode=require"
        db_uri="postgresql://car_parts_db_owner:0F4QXKRPmHBW@ep-bold-union-a698c6lj.us-west-2.aws.neon.tech/car_parts_db?sslmode=require"

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
                db_type="postgresql",  # Changed from mysql+pymysql
                username=os.getenv("DB_USER"),
                password=os.getenv("DB_PASSWORD"),
                host=os.getenv("DB_HOST"),
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
       You are an AI assistant specialized in handling queries about an e-commerce system.
       Never use LIMIT in your queries.
       Tables:
        userorder
        userorderitems
        Products
        Parts (It has almost 50 rows might change)
        Category

        You are a SQL expert. When searching for Parts or descriptions:
            1. Use ILIKE instead of LIKE for case-insensitive matches
            2. Never use LIMIT in your queries unless specifically requested
            3. Search both part_name and description columns
            4. Always include full description in the results
             For part descriptions, use:
                SELECT part_name, description
                FROM Parts
                WHERE description ILIKE '%search_term%'
                OR part_name ILIKE '%search_term%'

            You have access to a database with the following structure:

            Products belong to specific categories and can have multiple associated Parts
            Parts are individual items that can be ordered and maintained in inventory
            Orders are created by users and can contain multiple parts
            Main Entities
            Category: Represents product classifications
            Products: Parent items organized by categories
            Parts: Individual sellable items linked to products and also their descriptions
            Orders: Customer purchases with shipping and payment details
            Query Guidelines
            When responding to queries:
            For inventory-related questions:
            Reference the Parts table for stock levels, pricing and descriptions.
            Consider product relationships when reporting availability
            For order processing:
            Validate order details against Parts availability
            Calculate totals based on part prices and quantities
            Ensure shipping information completeness
            For part lookups:
            Navigate the category > product > Parts hierarchy
            Include details from all connected tables
            For reporting queries:
            Consider the temporal aspects using created_at in userorders
            Aggregate data at product, category, or order levels as needed
            Response Format
            Always structure responses to:
            Validate input against the available schema
            Include only fields present in the database
            Handle relationships between tables using appropriate joins
            Consider performance implications of complex queries
            Format currency values appropriately
            Handle NULL values gracefully
            Remember to maintain data consistency across the product hierarchy and order processing chain.
        """

    def setup_langchain(self):
        """Initialize LangChain components"""
        try:
            # Initialize LangChain SQL Database wrapper
            self.langchain_db = SQLDatabase(engine=self.connector.get_engine)

            # Initialize LLM
            llm = ChatOpenAI(
                temperature=0,
                model_name="gpt-3.5-turbo",
                openai_api_key=os.getenv("OPENAI_API_KEY"),
                max_tokens=2000
            )

            # Create SQL toolkit and agent
            toolkit = SQLDatabaseToolkit(db=self.langchain_db, llm=llm)

            self.agent_executor = create_sql_agent(
                llm=llm,
                toolkit=toolkit,
                verbose=True,
                agent_type=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
                handle_parsing_errors=True,  # Add error handling
                top_k=None  # Remove result limiting
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


app = FastAPI(title="Database Query API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify actual origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
    uvicorn.run(app, host="0.0.0.0", port=8004)
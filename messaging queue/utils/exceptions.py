# utils/exceptions.py
class DatabaseError(Exception):
    """Base class for database-related errors"""
    pass

class QueueError(Exception):
    """Base class for message queue-related errors"""
    pass

class EmailError(Exception):
    """Base class for email-related errors"""
    pass
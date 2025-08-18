from sqlalchemy import Column, Integer, String, Text, JSON
from database import Base


class Quote(Base):
    __tablename__ = "quotes"

    id = Column(Integer, primary_key=True, index=True)
    quote = Column(Text, index=True)
    religion = Column(String, index=True)
    analysis = Column(JSON)
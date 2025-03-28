from fastapi import FastAPI, Depends, HTTPException
from pydantic import BaseModel
import joblib
import numpy as np
from sqlalchemy.orm import Session
from database import SessionLocal, engine, Prediction
from fastapi.middleware.cors import CORSMiddleware 

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"], 
)

# Load the trained model
model = joblib.load('sports_model.pkl')

# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Pydantic model for prediction input
class PredictionInput(BaseModel):
    team1_strength: float
    team2_strength: float
    weather_condition: int 

@app.post("/predict")
def predict(input: PredictionInput, db: Session = Depends(get_db)):
    input_data = np.array([[input.team1_strength, input.team2_strength, input.weather_condition]])
    prediction = model.predict(input_data)
    predicted_winner = "Team 1" if prediction[0] == 1 else "Team 2"

    db_prediction = Prediction(
        team1_strength=input.team1_strength,
        team2_strength=input.team2_strength,
        weather_condition=input.weather_condition,
        predicted_winner=predicted_winner,
    )
    db.add(db_prediction)
    db.commit()
    db.refresh(db_prediction)

    return {"predicted_winner": predicted_winner}

@app.get("/predictions")
def get_predictions(db: Session = Depends(get_db)):
    predictions = db.query(Prediction).all()
    return predictions

@app.delete("/predictions/{prediction_id}")
def delete_prediction(prediction_id: int, db: Session = Depends(get_db)):
    # Check if the prediction exists in the database
    db_prediction = db.query(Prediction).filter(Prediction.id == prediction_id).first()
    
    if db_prediction is None:
        raise HTTPException(status_code=404, detail="Prediction not found")
    
    db.delete(db_prediction)
    db.commit()

    return {"message": f"Prediction with ID {prediction_id} has been deleted."}

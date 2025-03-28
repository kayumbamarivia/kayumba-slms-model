import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.metrics import accuracy_score
import joblib

# Expanded dataset
data = {
    'team1_strength': [8, 7, 6, 5, 9, 4, 6, 5, 7, 8, 7, 6, 5, 9, 8, 7, 6, 4, 7, 8],
    'team2_strength': [5, 6, 7, 8, 4, 5, 7, 6, 6, 5, 6, 7, 8, 4, 5, 6, 7, 9, 8, 6],
    'weather_condition': [1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 0, 1, 1, 0, 0, 1, 0],
    'winner': [1, 0, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1]  # 1 = Team 1 wins, 0 = Team 2 wins
}

# Create DataFrame
df = pd.DataFrame(data)

# Split data into features and target
X = df.drop('winner', axis=1)
y = df['winner']

# Train-test split (80% training, 20% testing)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Model: RandomForestClassifier with hyperparameter tuning using GridSearchCV
param_grid = {
    'n_estimators': [50, 100, 200],
    'max_depth': [None, 10, 20],
    'min_samples_split': [2, 5, 10],
    'min_samples_leaf': [1, 2, 4]
}

grid_search = GridSearchCV(estimator=RandomForestClassifier(), param_grid=param_grid, cv=5, n_jobs=-1, verbose=2)
grid_search.fit(X_train, y_train)

# Get the best model
best_model = grid_search.best_estimator_

# Save the best model
joblib.dump(best_model, 'sports_model.pkl')

# Evaluate the model on the test set
y_pred = best_model.predict(X_test)

# Calculate accuracy
accuracy = accuracy_score(y_test, y_pred)
print(f"Model Accuracy: {accuracy * 100:.2f}%")

# Save the improved model
print("Model trained, tuned, and saved as 'sports_model.pkl'")

import sys
import json
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.datasets import load_heart
from sklearn.metrics import accuracy_score

def load_data():
    # Load the heart disease dataset from scikit-learn
    dataset = load_heart()
    X = dataset.data
    y = dataset.target
    return X, y

def split_data(X, y):
    # Split the data into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    return X_train, X_test, y_train, y_test

def train_model(X_train, y_train):
    # Train a random forest classifier on the training data
    clf = RandomForestClassifier(n_estimators=100, random_state=42)
    clf.fit(X_train, y_train)
    return clf

def evaluate_model(clf, X_test, y_test):
    # Evaluate the model on the testing data
    y_pred = clf.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print("Accuracy:", accuracy)

def predict_heart_disease(clf, input_data):
    # Use the model to predict heart disease for the input data
    input_data = np.array(input_data).reshape(1, -1)
    prediction = clf.predict(input_data)
    result = {"heart_disease": bool(prediction[0])}
    return result

def heart_disease_report(input_list):
    X , y = load_data()
    X_train, X_test, y_train, y_test = split_data(X, y)
    clf = train_model(X_train, y_train)
    result = predict_heart_disease(clf, input_list)
    return result

def main():
    if len(sys.argv) != 2:
        print("Usage: heartDisease.py <list-value>")
        return
    input_list = json.loads(sys.argv[1])
    result = heart_disease_report(input_list)
    result = {"diabetes": result}
    print(result)

if __name__ == "__main__":
    main()
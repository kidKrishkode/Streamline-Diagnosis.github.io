import sys
import json
import numpy as np
from sklearn.neighbors import KNeighborsClassifier

# Load the sample data from the ./diabetes.json file
with open('./diabetes.json') as f:
    data = json.load(f)

# Define the input variables
X = np.array([[d['bp'], d['glu'], d['fru'], d['blv'], d['sh'], d['wl']] for d in data])
y = np.array([d['diabetes'] for d in data])

# Train a K-Nearest Neighbors classifier
knn = KNeighborsClassifier(n_neighbors=5)
knn.fit(X, y)

def predict_diabetes(inputs):
    blood_pressure = inputs[0]
    glucose_level = inputs[1]
    frequent_urination = inputs[2]
    blurred_vision = inputs[3]
    slow_healing = inputs[4]
    weight_loss = inputs[5]
    input_data = np.array([int(blood_pressure), int(glucose_level), int(frequent_urination), int(blurred_vision), int(slow_healing), int(weight_loss)])
    prediction = knn.predict([input_data])
    print(prediction)
    return int(prediction[0])

def diabetes_status(user_input):
    # print(user_input)
    result = predict_diabetes(user_input)
    return result

def main():
    if len(sys.argv) != 2:
        print("Usage: diabetes.py <list-value>")
        return
    input_list = json.loads(sys.argv[1])
    result = diabetes_status(input_list)
    result = {"diabetes": result}
    print(result)

if __name__ == "__main__":
    main()

# 120 90 0 0 0 1
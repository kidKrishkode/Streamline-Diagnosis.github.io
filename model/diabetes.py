import sys
import json
import numpy as np
from sklearn.neighbors import KNeighborsClassifier
import Preprocessor
import ast
import logging

def accuracy():
    if './model/main.py' in sys.argv[0]:
        json_file_path = './model/diabetes.json'
    else:
        json_file_path = './diabetes.json'

    with open(json_file_path) as f:
        dataset = json.load(f)

    return Preprocessor.accuracy(dataset, None, 2)

def predict_diabetes(input_list):

    try:
        if './model/main.py' in sys.argv[0]:
            json_file_path = './model/diabetes.json'
            input_list = [int(X) for X in input_list[0].split(',')]
        else:
            json_file_path = './diabetes.json'
    except:
        json_file_path = './model/diabetes.json'
        input_list = [int(X) for X in input_list[0].split(',')]

    age, blood_pressure, glucose_level, frequent_urination, blurred_vision, slow_healing, weight_loss = int(input_list[0]),int(input_list[1]),int(input_list[2]),int(input_list[3]),int(input_list[4]),int(input_list[5]),int(input_list[6])
    
    # Normalize the level data at first
    Preprocessor.normalize(json_file_path)
    
    memory = Preprocessor.mbr([age, blood_pressure, glucose_level, frequent_urination, blurred_vision, slow_healing, weight_loss], json_file_path, ['diabetes'])
    if memory != None:
        return int(memory[0])

    with open(json_file_path) as f:
        dataset = json.load(f)

    # Define the input variables
    X = np.array([[data['age'], data['bp'], data['glu'], data['fru'], data['blv'], data['sh'], data['wl']] for data in dataset]).reshape(1, -1)
    y = np.array([target['diabetes'] for target in dataset]).reshape(1, -1)

    # Train a K-Nearest Neighbors classifier
    knn = KNeighborsClassifier(n_neighbors=len(dataset)-1)
    knn.fit(X, y)

    # Predict the loss conjuction of the plane
    # actual = knn.predict(np.array([age, blood_pressure, glucose_level, frequent_urination, blurred_vision, slow_healing, weight_loss]).reshape(1, -1))
    
    if age >= 80:
        bp_target = 150
    else:
        bp_target = 140
    
    # assuming a random status and modifi the weight
    assumtion = Preprocessor.assumtion

    if blood_pressure >= bp_target or glucose_level >= 126 or (glucose_level > 100 and frequent_urination == 1):
        if glucose_level >= 70 and glucose_level <= 100:
            assumtion = 0
        elif glucose_level > 100 and glucose_level <= 125:
            if frequent_urination == 1 or blurred_vision == 1 or slow_healing == 1 or weight_loss == 1:
                assumtion = 1
            else:
                assumtion = 0
        else:
            assumtion = 1
    else:
        assumtion = 0
    
    Preprocessor.ETL([age, blood_pressure, glucose_level, frequent_urination, blurred_vision, slow_healing, weight_loss],[assumtion],json_file_path)

    if accuracy() > 75:
        return assumtion
    else:
        return None

def diabetes_report(user_input):
    result = predict_diabetes(user_input)
    return result

def main():
    if len(sys.argv) != 2:
        print("Usage: diabetes.py <list-value>")
        return
    
    input_list = ast.literal_eval(sys.argv[1])
    result = diabetes_report(input_list)
    result = {"diabetes": result}
    print(result)

if __name__ == "__main__":
    main()
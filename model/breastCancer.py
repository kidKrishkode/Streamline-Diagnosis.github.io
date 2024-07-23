import sys
import json
import Preprocessor
import numpy as np
from sklearn.neighbors import KNeighborsClassifier
from sklearn.preprocessing import StandardScaler
import ast
import logging

def accuracy():
    if './model/main.py' in sys.argv[0]:
        json_file_path = './model/breastCancer.json'
    else:
        json_file_path = './breastCancer.json'

    with open(json_file_path) as f:
        dataset = json.load(f)

    return Preprocessor.accuracy(dataset, None, 2)

def predict_breast_cancer(input_list):

    # Access the level dataset from json file
    try:
        if './model/main.py' in sys.argv[0]:
            json_file_path = './model/breastCancer.json'
            input_list = [int(X) for X in input_list[0].split(',')]
        else:
            json_file_path = './breastCancer.json'
    except:
        json_file_path = './model/breastCancer.json'
        input_list = [int(X) for X in input_list[0].split(',')]

    age, tumor_size, breast_pain, blood_discharge, shape_change, family_history = int(input_list[0]), int(input_list[1]), int(input_list[2]), int(input_list[3]), int(input_list[4]), int(input_list[5])

    # Normalize the level data at first
    Preprocessor.normalize(json_file_path)

    memory = Preprocessor.mbr([age, tumor_size, breast_pain, blood_discharge, shape_change, family_history],json_file_path,['breastCancer','type'])
    if memory != None:
        return int(memory[0]), memory[1]

    with open(json_file_path) as f:
        dataset = json.load(f)

    # Define the input variables
    X = np.array([[data['age'], data['tuS'], data['brP'], data['blD'], data['sC'], data['fH']] for data in dataset]).reshape(1, -1)
    y = np.array([[target['breastCancer'], target['type']] for target in dataset]).reshape(1, -1)

    # Scale feature using StandardScaler
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X.reshape(-1, 6))

    # Train a K-Nearest Neighbors classifier
    knn = KNeighborsClassifier(n_neighbors=5)
    knn.fit(X_scaled, y.reshape(-1, 2))

    # Predict the loss conjuction of the plane
    unknown_input = np.array([age, tumor_size, breast_pain, blood_discharge, shape_change, family_history]).reshape(1,-1)
    unknown_input_scaled  = scaler.transform(unknown_input)
    actual = knn.predict(unknown_input_scaled)[0]

    # Risk analysis using user age
    if age >= 45:
        risk = 0.8
    elif age >= 40:
        risk = 0.5
    else:
        risk = 0.2

    # Family person have it 
    if family_history == 1:
        risk *= 2

    # Tumor size to tumor type identify
    if tumor_size <= 2:
        tumor_type = 'T1'
    elif tumor_size <= 5:
        tumor_type = 'T2'
    elif tumor_size > 5:
        tumor_type = 'T3'
    else:
        tumor_type = 'T4'

    # Symtomes cross check
    if breast_pain == 1 or blood_discharge == 1 or shape_change == 1:
        symptoms = True
    else:
        symptoms = False
    
    # assuming a random status and modifi the weight
    assumption = Preprocessor.assumption

    # Classfied result return
    if risk > 0.5 and symptoms and tumor_size > 0:
        assumption = 1, tumor_type
    else:
        assumption = 0, ""

    Preprocessor.ETL([age, tumor_size, breast_pain, blood_discharge, shape_change, family_history],list(assumption),json_file_path)

    # Fine the deviation or loss
    loss_f = Preprocessor.deviation(int(actual[0]), assumption[0])

    if accuracy() > 75 and loss_f < 0.2:
        return assumption
    else:
        return None

def breast_cancer_report(user_input):
    result, tumor = predict_breast_cancer(user_input)
    return result, tumor

def main():
    if len(sys.argv) != 2:
        print("Usage: breastCancer.py <list-value>")
        return
    
    input_list = ast.literal_eval(sys.argv[1])
    result, tumor = breast_cancer_report(input_list)
    result = {"cancer": result, "tumor": tumor}
    print(result)

if __name__ == "__main__":
    main()
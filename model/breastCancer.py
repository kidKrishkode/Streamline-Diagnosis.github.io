import sys
import json
import numpy as np
from sklearn.neighbors import KNeighborsClassifier
import Preprocessor

# [   
#     {"age": 17, "tuS": 0, "brP": 0, "blD": 0, "sC": 0, "fH": 0, "breastCancer": 0, "type": ""},
#     {"age": 21, "tuS": 1, "brP": 1, "blD": 1, "sC": 0, "fH": 0, "breastCancer": 0, "type": ""},
#     {"age": 23, "tuS": 3, "brP": 1, "blD": 0, "sC": 1, "fH": 1, "breastCancer": 0, "type": ""},
#     {"age": 24, "tuS": 3, "brP": 1, "blD": 1, "sC": 1, "fH": 1, "breastCancer": 1, "type": "T2"},
#     {"age": 34, "tuS": 2, "brP": 1, "blD": 1, "sC": 1, "fH": 0, "breastCancer": 0, "type": ""},
#     {"age": 35, "tuS": 0, "brP": 0, "blD": 1, "sC": 1, "fH": 1, "breastCancer": 0, "type": ""},
#     {"age": 37, "tuS": 1, "brP": 0, "blD": 0, "sC": 0, "fH": 1, "breastCancer": 0, "type": ""},
#     {"age": 39, "tuS": 1, "brP": 0, "blD": 0, "sC": 1, "fH": 0, "breastCancer": 0, "type": ""},
#     {"age": 42, "tuS": 5, "brP": 1, "blD": 1, "sC": 1, "fH": 1, "breastCancer": 0, "type": ""},
#     {"age": 43, "tuS": 3, "brP": 1, "blD": 1, "sC": 0, "fH": 0, "breastCancer": 0, "type": ""},
#     {"age": 43, "tuS": 5, "brP": 1, "blD": 1, "sC": 1, "fH": 1, "breastCancer": 1, "type": "T4"},
#     {"age": 46, "tuS": 4, "brP": 0, "blD": 0, "sC": 1, "fH": 1, "breastCancer": 0, "type": ""},
#     {"age": 46, "tuS": 6, "brP": 1, "blD": 0, "sC": 1, "fH": 1, "breastCancer": 1, "type": "T3"},
#     {"age": 48, "tuS": 2, "brP": 0, "blD": 1, "sC": 1, "fH": 0, "breastCancer": 1, "type": "T1"},
#     {"age": 50, "tuS": 3, "brP": 1, "blD": 0, "sC": 1, "fH": 1, "breastCancer": 1, "type": "T2"},
#     {"age": 51, "tuS": 5, "brP": 1, "blD": 1, "sC": 1, "fH": 1, "breastCancer": 1, "type": "T2"},
#     {"age": 52, "tuS": 6, "brP": 1, "blD": 1, "sC": 1, "fH": 1, "breastCancer": 1, "type": "T3"},
#     {"age": 53, "tuS": 3, "brP": 1, "blD": 1, "sC": 0, "fH": 0, "breastCancer": 1, "type": "T2"},
#     {"age": 54, "tuS": 4, "brP": 0, "blD": 1, "sC": 1, "fH": 1, "breastCancer": 1, "type": "T2"},
#     {"age": 56, "tuS": 2, "brP": 0, "blD": 1, "sC": 0, "fH": 1, "breastCancer": 1, "type": "T1"},
#     {"age": 67, "tuS": 2, "brP": 0, "blD": 1, "sC": 1, "fH": 1, "breastCancer": 1, "type": "T1"},
#     {"age": 67, "tuS": 3, "brP": 1, "blD": 1, "sC": 0, "fH": 0, "breastCancer": 1, "type": "T2"},
#     {"age": 84, "tuS": 2, "brP": 1, "blD": 0, "sC": 1, "fH": 0, "breastCancer": 1, "type": "T1"}
# ]

def predict_breast_cancer(input_list):

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

    # Train a K-Nearest Neighbors classifier
    knn = KNeighborsClassifier(n_neighbors=5)
    knn.fit(X, y)

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
    assumtion = Preprocessor.assumtion

    # Classfied result return
    if risk > 0.5 and symptoms and tumor_size > 0:
        assumtion = 1, tumor_type
    else:
        assumtion = 0, 0

    Preprocessor.ETL([age, tumor_size, breast_pain, blood_discharge, shape_change, family_history],list(assumtion),json_file_path)

    return assumtion

def breast_cancer_report(user_input):
    result, tumor = predict_breast_cancer(user_input)
    return result, tumor

def main():
    if len(sys.argv) != 2:
        print("Usage: breastCancer.py <list-value>")
        return
    
    input_list = json.loads(sys.argv[1])
    result, tumor = breast_cancer_report(input_list)
    result = {"cancer": result, "tumor": tumor}
    print(result)

if __name__ == "__main__":
    main()
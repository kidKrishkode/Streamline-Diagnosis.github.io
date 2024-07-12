import sys
import json
import numpy as np
from sklearn.neighbors import KNeighborsClassifier
import Preprocessor
import ast

# [
#     {"age": 20, "bp": 140, "glu": 150, "fru": 1, "blv": 1, "sh": 1, "wl": 1, "diabetes": 1},
#     {"age": 21, "bp": 150, "glu": 180, "fru": 1, "blv": 1, "sh": 1, "wl": 1, "diabetes": 1},
#     {"age": 21, "bp": 133, "glu": 97, "fru": 0, "blv": 1, "sh": 0, "wl": 0, "diabetes": 0},
#     {"age": 24, "bp": 110, "glu": 89, "fru": 1, "blv": 0, "sh": 0, "wl": 1, "diabetes": 0},
#     {"age": 26, "bp": 147, "glu": 117, "fru": 1, "blv": 1, "sh": 1, "wl": 1, "diabetes": 1},
#     {"age": 33, "bp": 120, "glu": 85, "fru": 0, "blv": 1, "sh": 0, "wl": 1, "diabetes": 0},
#     {"age": 34, "bp": 120, "glu": 90, "fru": 0, "blv": 0, "sh": 0, "wl": 1, "diabetes": 0},
#     {"age": 34, "bp": 132, "glu": 120, "fru": 1, "blv": 0, "sh": 1, "wl": 1, "diabetes": 1},
#     {"age": 34, "bp": 130, "glu": 117, "fru": 0, "blv": 0, "sh": 0, "wl": 0, "diabetes": 0},
#     {"age": 36, "bp": 130, "glu": 120, "fru": 0, "blv": 0, "sh": 0, "wl": 0, "diabetes": 0},
#     {"age": 36, "bp": 110, "glu": 109, "fru": 0, "blv": 0, "sh": 0, "wl": 0, "diabetes": 0},
#     {"age": 43, "bp": 138, "glu": 154, "fru": 1, "blv": 0, "sh": 1, "wl": 1, "diabetes": 1},
#     {"age": 46, "bp": 148, "glu": 118, "fru": 1, "blv": 0, "sh": 0, "wl": 0, "diabetes": 1},
#     {"age": 51, "bp": 127, "glu": 130, "fru": 1, "blv": 1, "sh": 0, "wl": 0, "diabetes": 1},
#     {"age": 55, "bp": 133, "glu": 108, "fru": 1, "blv": 1, "sh": 1, "wl": 1, "diabetes": 1},
#     {"age": 68, "bp": 95, "glu": 114, "fru": 1, "blv": 1, "sh": 0, "wl": 1, "diabetes": 1},
#     {"age": 72, "bp": 103, "glu": 97, "fru": 0, "blv": 1, "sh": 0, "wl": 1, "diabetes": 0},
#     {"age": 87, "bp": 120, "glu": 90, "fru": 0, "blv": 0, "sh": 0, "wl": 1, "diabetes": 0},
#     {"age": 87, "bp": 90, "glu": 169, "fru": 0, "blv": 1, "sh": 1, "wl": 1, "diabetes": 1 }
# ]

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
    knn = KNeighborsClassifier(n_neighbors=5)
    knn.fit(X, y)
    
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

    return assumtion

def diabetes_report(user_input):
    # print(user_input)
    result = predict_diabetes(user_input)
    return result

def main():
    if len(sys.argv) != 2:
        print("Usage: diabetes.py <list-value>")
        return
    
    input_list = json.loads(sys.argv[1])
    # input_list = ast.literal_eval(sys.argv[1])
    result = diabetes_report(input_list)
    result = {"diabetes": result}
    print(result)

if __name__ == "__main__":
    main()
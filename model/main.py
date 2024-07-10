# import require python libs
import sys
import json
import logging

# import require python files
import diabetes
import breastCancer

def main():
    if len(sys.argv) <= 1:
        print("Error: Usage: main.py <list-data> <function-value>")
        return
    
    asset = []
    for i in range(0,len(sys.argv)-2):
        asset.append(sys.argv[i+1] * 1)
    function_name = sys.argv[len(sys.argv)-1]

    if function_name == 'diabetes':
        diabet = diabetes.diabetes_report(asset)
        result = {
            "value": diabet,
            "statement": len(sys.argv)
        }
        # logging.basicConfig(filename='json_data.log',level=logging.DEBUG)
        # logging.debug(json.dumps({"result": diabet}))
        print(json.dumps(result))
    elif function_name == 'breastCancer':
        cancer, tumor = breastCancer.breast_cancer_report(asset)
        result = {
            "value": cancer,
            "type": tumor,
            "statement": len(sys.argv)
        }
        print(json.dumps(result))
    else:
        print(f"Function {function_name} is not recognized")

if __name__ == "__main__":
    main()
    

import pickle
import pandas as pd
import numpy as np
import json
import sys
import warnings
import decimal
warnings.filterwarnings("ignore")

class DecimalEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, decimal.Decimal):
            return (str(o) for o in [o])
        return super(DecimalEncoder, self).default(o)


def run_model():
    data = pd.read_excel('./model/SD_Dataset.xlsx')
    dataset = pd.DataFrame(data, columns=['moisture', 'temperature', 'air_humidity', 'last_irrigation', 'current_time'])
    for i, row in dataset.iterrows():
        dataset.at[i, 'current_time'] = float(str(row.current_time).split(':')[0])
        dataset.at[i, 'last_irrigation'] = float(str(row.last_irrigation).split(':')[0])

    filename = './model/lr_test_model.sav'
    loaded_model = pickle.load(open(filename, 'rb'))

    prediction = loaded_model.predict(dataset)
    predictions = pd.DataFrame(data=prediction, columns=['Prediction'])

    dataset = pd.concat([dataset, predictions], axis=1, join='inner')

    mappings = {}
    for i in dataset.iterrows():
        if i[1]['current_time'] in mappings.keys():
            mappings[i[1]['current_time']] += 1
        else:
            mappings[i[1]['current_time']] = 1

    max = {'name': '', 'val': 0}
    for key, val in mappings.items():
        if max['val'] < val:
            max['name'] = key
            max['val'] = val

    best_time = int(max['name'])

    output = json.dumps({'next_irrigation': str(best_time)+':00', 'last_irrigation': '18:00'}, cls=DecimalEncoder)
    print(output)
    sys.stdout.flush()

run_model()

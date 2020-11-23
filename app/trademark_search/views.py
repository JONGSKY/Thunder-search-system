from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse, JsonResponse
import os
import numpy as np
import pickle
import pandas as pd
from PIL import Image
from trademark_search.predict import predict_embedding
from sklearn.metrics.pairwise import cosine_similarity


with open('vin_vocab.pkl', 'rb') as f:
    index_vocab = {v:k for k,v in pickle.load(f).items()}
with open('vienna_dict.pickle', 'rb') as f:
    name_dict = pickle.load(f)
with open('image_embeddings.pkl', 'rb') as f:
    embeddings = pickle.load(f)
with open('info.pkl', 'rb') as f:
    information = pickle.load(f)
idx2key = {i:k for i,k in enumerate(embeddings.keys())}
embeddings = np.array(list(embeddings.values()))

def image_upload(request):
    if request.method == 'POST':
        img = Image.open(request.FILES['image'])
        pred = predict_embedding(img)
        similarity = cosine_similarity(pred, embeddings)[0]
        result_idx = [i for i in np.argsort(similarity)[::-1][:21] if idx2key[i] != request.FILES['image']][:20]
        result = []
        print(result_idx)
        for i in result_idx:
            tmp = {}
            key = idx2key[i]
            info = information[key]
            print(key)
            print(info)
            if type(info[3]) == float:
                title='undefined'
            else:
                title=info[3]
            tmp['id'] = key
            tmp['title'] = title
            tmp['current'] = info[2]
            tmp['vienna'] = info[4]
            tmp['date'] = info[1]
            tmp['number'] = info[0]
            result.append(tmp)
    return JsonResponse(result, safe=False)

def predict_code(request):
    if request.method == 'POST':
        img = Image.open(request.FILES['image'])
        pred = predict_embedding(img)[0]
        result_idx = np.argsort(pred)[::-1][:20]
        result = []
        for i in result_idx:
            tmp = {}
            code = index_vocab[i]
            tmp['code'] = code
            tmp['info'] = name_dict[code]
            result.append(tmp)
    return JsonResponse(result, safe=False)

    
def logo_search(request):
    return render(request, 'trademark_search/logo_search.html')

def vienna_search(request):
    return render(request, 'trademark_search/vienna_search.html')
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
import os
import numpy as np
import pickle
import pandas as pd
from PIL import Image
from vienna_search.src.predict import predict_embedding


def index(request):
    return render(request, 'vienna_search/index.html')


def handle_uploaded_file(f):
    path_to_img = 'image_search/images/'
    img_path = os.path.join(path_to_img, f.name)
    return img_path

with open('vin_vocab.pkl', 'rb') as f:
    index_vocab = {v:k for k,v in pickle.load(f).items()}
with open('vienna_dict.pickle', 'rb') as f:
    name_dict = pickle.load(f)


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


    # if request.method == 'POST':
    #     filename = handle_uploaded_file(request.FILES['image'])
    #     embd = get_embedding.get_embedding(filename)
    #     distance_matrix = cosine_similarity(embd, total_embedding)
    #     result = image_files[np.argsort(distance_matrix).reshape(-1)]
    #     os.remove(filename)
    #     patent_list = list()
    #     image_list = list()
    #     idx = -1
    #     while len(patent_list) < 8:
    #         p_id = result[idx].split('-')[0][2:]
    #         if p_id not in patent_list:
    #             patent_list.append(p_id)
    #             image_list.append(result[idx])
    #         idx -= 1
    #     patent_info = list(Patent.objects.filter(patent_id__in=patent_list).values('patent_id', 'title', 'abstract'))
    #     patent_info.sort(key=lambda patent: patent_list.index(patent['patent_id']))
    #     for value, src in zip(patent_info, image_list):
    #         value['image_src'] = src
    # return JsonResponse(patent_info, safe=False)

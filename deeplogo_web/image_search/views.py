from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
import os
import numpy as np
import pickle
import pandas as pd
from PIL import Image
from image_search.src.predict import predict_embedding
from sklearn.metrics.pairwise import cosine_similarity


def index(request):
    return render(request, 'image_search/index.html')


def handle_uploaded_file(f):
    path_to_img = 'image_search/images/'
    img_path = os.path.join(path_to_img, f.name)
    return img_path

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

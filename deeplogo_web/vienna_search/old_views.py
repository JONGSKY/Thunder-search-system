from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.db.models import Q
from vienna_search.utils import *


def index(request):
    return render(request, 'vienna_search/index.html')


def wordcloud_search(request):
    # def index(request):
    # search_keyword = request.GET['keyword']
    # time_1 = datetime.now()
    # print("wordcloud 검색을 시작했습니다 ... 현재시간 :",time_1)
    # list_search_keyword = [word.lower().strip() for word in search_keyword.split() if word != 'and']
    # try:
    #     similar_words = model.wv.most_similar(list_search_keyword, topn=30)
    #     similar_words = [{'word': w, 'size': 60 - (i * 1.5)} for i, (w, _) in enumerate(similar_words)]
    # except Exception:
    #     similar_words = []
    # context = {"myWords": similar_words}
    context = {'myWords': [{'word': 'flame', 'size': 60.0}, {'word': 'smoke', 'size': 58.5},
                 {'word': 'extinguisher', 'size': 57.0}, {'word': 'extinguishing', 'size': 55.5},
                 {'word': 'explosion', 'size': 54.0}, {'word': 'suppressant', 'size': 52.5},
                 {'word': 'fighting', 'size': 51.0}, {'word': 'inflammable', 'size': 49.5},
                 {'word': 'flammable', 'size': 48.0}, {'word': 'retardant', 'size': 46.5},
                 {'word': 'blast', 'size': 45.0}, {'word': 'extinguishant', 'size': 43.5},
                 {'word': 'hazard', 'size': 42.0}, {'word': 'extinguishment', 'size': 40.5},
                 {'word': 'fireproof', 'size': 39.0}, {'word': 'termite', 'size': 37.5},
                 {'word': 'gunfire', 'size': 36.0}, {'word': 'earthquake', 'size': 34.5},
                 {'word': 'firefighting', 'size': 33.0}, {'word': 'burglar', 'size': 31.5},
                 {'word': 'bomb', 'size': 30.0}, {'word': 'stove', 'size': 28.5}, {'word': 'hazardous', 'size': 27.0},
                 {'word': 'tornado', 'size': 25.5}, {'word': 'combustible', 'size': 24.0},
                 {'word': 'stovetop', 'size': 22.5}, {'word': 'sprinkler', 'size': 21.0},
                 {'word': 'intumescent', 'size': 19.5}, {'word': 'burning', 'size': 18.0},
                 {'word': 'intrusion', 'size': 16.5}]}
    print(context)
    return JsonResponse(context)
#
#
# patent_id_list = []
#
#
# def text_result(request):
#     global patent_id_list
#     final_keyword = request.GET['keyword']
#     keyword_list = [word.lower().strip() for word in final_keyword.split() if word != 'and']
#     # 특허는 최신순서로 정렬
#
#     time_1 = datetime.now()
#     print("datatable을 만들기 시작했습니다 ... 현재시간 :",time_1)
#
#     data_list = Patent.objects.filter(reduce(operator.and_, (Q(abstract__contains=k) for k in keyword_list))).order_by('-date')[:100]
#
#     time = datetime.now()
#     print("키워드로 검색 완료 ... 걸린시간 :", time-time_1)
#     time_1 = time
#
#     data_list = list(data_list.values())
#     patent_id_list = [data['patent_id'] for data in data_list]
#     result = {"data_list": data_list}
#
#     time = datetime.now()
#     print("데이터 dict화 완료 ... 걸린시간 :", time-time_1)
#
#     return JsonResponse(result, safe=False)
#
# def tsne_transform(data, lr=100, n_jobs=-1):
#     tsne = TSNE(learning_rate=lr, n_jobs=n_jobs)
#     transformed = tsne.fit_transform(data)
#     return transformed
#
# def kmeans_clustering(data, n_cluster=9, n_jobs=-1):
#     kmeans = KMeans(n_clusters=n_cluster, n_jobs=n_jobs)
#     kmeans.fit(data)
#     return kmeans.labels_
#
#
# # from tsnecuda import TSNE
# from collections import defaultdict
#
# def clustering_map(response):
#     global patent_id_list
#     global data_list
#     time_1 = datetime.now()
#     print("clustering_map을 요청했습니다 ... 현재시간 :",time_1)
#     patent_embedding = PatentEmbedding.objects.filter(patent_id__in=patent_id_list).values()
#
#     time = datetime.now()
#     print("검색 patent_id로 embedding값을 db에서 가져왔습니다 ... 걸린시간 :",time-time_1)
#     time_1 = time
#
#     patent_ids, embedding_list = get_patent_embedding(patent_embedding)
#     embedding_list = np.array(embedding_list)
#     transformed = tsne_transform(embedding_list).tolist()
#
#     time = datetime.now()
#     print("가져온 embedding값을 tsne로 축소했습니다 ... 걸린시간 :",time-time_1)
#     time_1 = time
#
#     labels = kmeans_clustering(embedding_list).tolist()
#
#     time = datetime.now()
#     print("kmeans로 군집화 라벨을 얻었습니다 ... 걸린시간 :",time-time_1)
#     time_1 = time
#
#     grouped_tsne = defaultdict(list)
#     data_list = defaultdict(list)
#
#     for label, pid, xy in zip(labels, patent_ids, transformed):
#         grouped_tsne["cluster_"+str(label)].append(xy+[pid])
#         data_list["cluster_"+str(label)].append(pid)
#
#     _grouped_tsne = {}
#     _data_list = {}
#
#     for key, patents in data_list.items():
#         query_ngram = PatentNgram.objects.filter(patent_id__in=patents).values()
#         patent_ngram = get_patent_ngram(query_ngram)
#         keywords = get_keywords_using_tfidf(patent_ngram)
#         keywords = ",".join(keywords).replace(',','\n')
#
#         _grouped_tsne[keywords] = grouped_tsne[key]
#         _data_list[keywords] = data_list[key]
#
#     grouped_tsne = _grouped_tsne
#     data_list = _data_list
#
#     del _grouped_tsne
#     del _data_list
#
#     time = datetime.now()
#     print("군집화 시각화를 위한 준비가 끝났습니다 ... 걸린시간 :",time-time_1)
#     time_1 = time
#
#     if len(patent_id_list)<1000:
#         size_data = 10
#     elif 1000<=len(patent_id_list)<5000:
#         size_data = 8
#     else:
#         size_data = 5
#     results = [{'label': key, 'data': grouped_tsne[key], 'size_data': size_data} for key in grouped_tsne]
#     return JsonResponse(results, safe=False)
#
#
# def change_data_table(request):
#     global data_list
#
#     index = request.GET['index']
#     time_1 = datetime.now()
#     print("change_data_table을 요청했습니다 ... 현재시간 :",time_1)
#     table_list = Patent.objects.filter(patent_id__in=data_list[index]).order_by('-date')
#
#     table_list = list(table_list.values())
#
#     result = {"table_list": table_list}
#
#     return JsonResponse(result, safe=False)

from django.shortcuts import render
from elasticsearch_dsl.query import Q
from .documents import PatentDocument, PatentEmbeddingDocument, PatentNgramDocument
# Create your views here.

def patent_search(request):
    return render(request, 'patent_search/patent_search.html')


def patent_search_result(request):
    search_input = request.GET.get('search_name', "") 
    result = {'search_name' : search_input}

    # s = PatentDocument.search().query('match', patent_id='10000001')
    # s = PatentDocument.search().query('match_phrase', abstract='supporting')
    s = PatentDocument.search().query(
                Q('match_phrase', abstract='supporting') & 
                Q('match_phrase', abstract='plate')
            )

    for test in s:
        print(test)
        print(
            "patent_title : {}, abstract {}".format(test.patent_id, test.abstract)
        )

    p = PatentEmbeddingDocument.search().query('match', patent_id='10000001')

    for hit in p:
        print(hit)
        print(
            "patent_id : {}, embedding {}".format(hit.patent_id, hit.embedding)
        )

    p = PatentNgramDocument.search().query('match', patent_id='10000001')

    for hit in p:
        print(hit)
        print(
            "patent_id : {}, ngram_words {}".format(hit.patent_id, hit.ngram_words)
        )

    return render(request, 'patent_search/patent_search_result.html', result)
    



import multiprocessing

from sklearn.feature_extraction.text import TfidfVectorizer
import numpy as np


def convert_string_to_npy(data):
    data['embedding'] = np.fromstring(data['embedding'], dtype=np.float32, sep=' ')
    return data['patent_id'], data['embedding']


def convert_string_to_list(data):
    return data['ngram_words'].split(",")


def get_patent_embedding(query_data):
    with multiprocessing.Pool(multiprocessing.cpu_count()) as p:
        patent_embedding = list(p.imap(convert_string_to_npy, query_data))
    return zip(*patent_embedding)


def get_patent_ngram(query_data):
    with multiprocessing.Pool(multiprocessing.cpu_count()) as p:
        patent_ngram = list(p.imap(convert_string_to_list, query_data))
    return patent_ngram


tfidf = TfidfVectorizer(
    analyzer='word',
    tokenizer=lambda x: x,
    preprocessor=lambda x: x,
    token_pattern=None)
    # ,
    # min_df=0.05, max_df=0.95)


def get_keywords_using_tfidf(corpus):
    X = tfidf.fit_transform(corpus)
    keyword_list = np.array(tfidf.get_feature_names())
    return keyword_list[np.argsort(np.sum(X.toarray(), axis=0))[-3:]].tolist()

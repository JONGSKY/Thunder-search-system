from django_elasticsearch_dsl import Document
from django_elasticsearch_dsl.registries import registry
from .models import Patentsview, PatentEmbedding, PatentNgram

@registry.register_document
class PatentDocument(Document):
    class Index:
        # Name of the Elasticsearch index
        name = 'patentsview'
        # # See Elasticsearch Indices API reference for available settings
        settings = {'number_of_shards': 1,
                    'number_of_replicas': 0}

    class Django:
        model = Patentsview # The model associated with this Document

        # The fields of the model you want to be indexed in Elasticsearch
        fields = [
            'patent_id',
            'title',
            'abstract',
            'country',
            'date',
            'kind',
            'number',
        ]

@registry.register_document
class PatentEmbeddingDocument(Document):
    class Index:
        # Name of the Elasticsearch index
        name = 'patent_embedding'
        # # See Elasticsearch Indices API reference for available settings
        settings = {'number_of_shards': 1,
                    'number_of_replicas': 0}

    class Django:
        model = PatentEmbedding # The model associated with this Document

        # The fields of the model you want to be indexed in Elasticsearch
        fields = [
            'patent_id',
            'embedding',
        ]

@registry.register_document
class PatentNgramDocument(Document):
    class Index:
        # Name of the Elasticsearch index
        name = 'patent_ngram'
        # # See Elasticsearch Indices API reference for available settings
        settings = {'number_of_shards': 1,
                    'number_of_replicas': 0}

    class Django:
        model = PatentNgram # The model associated with this Document

        # The fields of the model you want to be indexed in Elasticsearch
        fields = [
            'patent_id',
            'ngram_words',
        ]
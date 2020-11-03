# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class PatentEmbedding(models.Model):
    patent_id = models.CharField(primary_key=True, max_length=20)
    embedding = models.TextField()

    class Meta:
        managed = False
        db_table = 'patent_embedding'

class Patentsview(models.Model):
    patent_id = models.CharField(primary_key=True, max_length=20)
    title = models.TextField(blank=True, null=True)
    abstract = models.TextField(blank=True, null=True)
    country = models.CharField(max_length=20, blank=True, null=True)
    date = models.DateField(blank=True, null=True)
    kind = models.CharField(max_length=10, blank=True, null=True)
    number = models.CharField(max_length=64)

    class Meta:
        managed = False
        db_table = 'patentsview'

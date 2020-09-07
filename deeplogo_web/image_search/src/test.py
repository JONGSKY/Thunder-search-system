from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

a = np.reshape(np.random.rand(256,100), (-1, 100))
b = np.random.rand(1, 100)
print(b)
print(cosine_similarity(b, a)[0].shape)
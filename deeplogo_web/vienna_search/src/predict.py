from torchvision import transforms, models
from PIL import Image
import numpy as np
import pickle
import torch
import os
from torch import nn
from collections import OrderedDict

class Flatten(nn.Module):
    
    def __init__(self):
        super().__init__()
        
    def forward(self, x):
        return x.view(x.size(0), -1)
    
class AdaptiveConcatPool2d(nn.Module):
    
    def __init__(self, sz=None):
        super().__init__()
        sz = sz or 1
        self.ap = nn.AdaptiveAvgPool2d(sz)
        self.mp = nn.AdaptiveMaxPool2d(sz)
        
    def forward(self, x):
        return torch.cat([self.mp(x), self.ap(x)], 1)

class ResizeByRatio:
    def __init__(self, size):
        self.size = size # (width, height)
        
    def __call__(self, image):
        im_size = image.size
        if im_size[0] >= self.size and im_size[1] >= self.size:
            return transforms.functional.resize(image, (self.size, self.size))
        elif im_size[0] < self.size and im_size[1] >= self.size:
            image = transforms.functional.resize(image, (self.size, im_size[0]))
            pad_left = int((self.size - im_size[0]) / 2)
            pad_right = self.size - im_size[0] - pad_left
            image = transforms.functional.pad(image, (pad_left, 0, pad_right, 0))
            return image
        elif im_size[0] >= self.size and im_size[1] < self.size:
            image = transforms.functional.resize(image, (im_size[1], self.size))
            pad_top = int((self.size - im_size[1]) / 2)
            pad_bottom = self.size - im_size[1] - pad_top
            image = transforms.functional.pad(image, (0, pad_top, 0, pad_bottom))
            return image
        elif  im_size[0] < self.size and im_size[1] < self.size:
            check = {True : 0, False : 1}
            std = check[im_size[0] > im_size[1]]
            image = transforms.functional.resize(image, (int(im_size[1]*self.size/im_size[std]),
                                                 int(im_size[0]*self.size/im_size[std])))
            pad_idx = check[image.size[0] != self.size]
            pad_start = int((self.size - image.size[pad_idx]) / 2)
            pad_end = self.size - image.size[pad_idx] - pad_start
            if pad_idx == 0:
                return transforms.functional.pad(image, (pad_start, 0, pad_end, 0))
            if pad_idx == 1:
                return transforms.functional.pad(image, (0, pad_start, 0, pad_end))

            
class WrappedModel(nn.Module):
    def __init__(self, module):
        super(WrappedModel, self).__init__()
        self.module = module

    def forward(self, x):
        return self.module(x)           

    
def wide_resnet_50():
    model = models.wide_resnet50_2(pretrained=False)
    model = list(model.children())[:-2]
    model[0] = nn.Conv2d(1, 64, (7,7), (2, 2), (3, 3), bias=False)
    front = model[:-2]
    back = model[-2:]
    front = nn.Sequential(*front)
    back = nn.Sequential(*back)
    for i in front.parameters():
        i.requires_grad = False
    final_layers = nn.Sequential(
                    AdaptiveConcatPool2d(),
                    Flatten(),
                    nn.BatchNorm1d(4096),
                    nn.ReLU(),
                    nn.Dropout(p=0.1),
                    nn.Linear(4096, 128),
                    nn.BatchNorm1d(128),
                    nn.ReLU(),
                    nn.Dropout(p=0.1),
                    nn.Linear(128, 1106, bias=True),
                    )
    model = nn.Sequential(
                    front,
                    back,
                    final_layers
                    )
    return model

def load_model(model_path):
    model = wide_resnet_50()
    state_dict = torch.load(model_path)
    new_dict = OrderedDict()
    for i, j in zip(model.state_dict(), state_dict):
        new_dict[i] = state_dict[j]
    model.load_state_dict(new_dict)
    return model

logo_model = load_model('new_model.tc')
print(logo_model)
logo_model.eval()

def predict_embedding(img):
    transform = transforms.Compose([
                        transforms.Grayscale(num_output_channels=1),
                        ResizeByRatio(224),
                        transforms.ToTensor(),
                        transforms.Normalize(mean=[0.7439], std=[0.3592])
    ])
    input_img = torch.unsqueeze(transform(img), dim=0)
    with torch.no_grad():
        pred = logo_model(input_img).numpy()
    return pred

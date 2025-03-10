"""
Rethinking Portrait Matting with Privacy Preserving

Copyright (c) 2022, Sihan Ma (sima7436@uni.sydney.edu.au) and Jizhizi Li (jili8515@uni.sydney.edu.au)
Licensed under the MIT License (see LICENSE for details)
Github repo: https://github.com/ViTAE-Transformer/P3M-Net
Paper link: https://arxiv.org/abs/2203.16828

"""


from .ViTAE_S import *


# def build_model(model_arch, **kwargs):
#     if model_arch == "r34":
#         model = p3mnet_resnet34(**kwargs)
#     elif model_arch == "swin":
#         model = p3mnet_swin_t(pretrained=False, **kwargs)
#     elif model_arch == "vitae":
#         model = p3mnet_vitae_s(pretrained=False,**kwargs)
#     else:
#         print(model_arch)
#         raise NotImplementedError
    
#     return model

def build_model(model_arch,**kwargs): 
    if model_arch=='vitae': 
        model = p3mnet_vitae_s(pretrained=False,**kwargs)
    else: 
        print(model_arch)
        raise NotImplementedError
    return model


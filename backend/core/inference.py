import sys
sys.path.append('./core')
import torch
import argparse
import numpy as np
from PIL import Image
from skimage.transform import resize
from torchvision import transforms
import os
from fastapi import File
from config import *
from util import *
import io
from network import build_model


class P3Net:
    def __init__(self, model_path='D:/p3m-netapp/Removebg-/backend/model/P3M-Net_ViTAE-S_trained_on_P3M-10k.pth', arch='vitae', test_choice='HYBRID', device='cpu'):
        print('loading model')
        self.model_path = model_path
        self.arch = arch
        self.test_choice = test_choice
        self.device = torch.device(device)
        self.model = build_model(model_arch=self.arch)
        try:
            checkpoint = torch.load(model_path, map_location=self.device, weights_only=False)
        except TypeError:
            checkpoint = torch.load(model_path, map_location=self.device)
        if 'state_dict' in checkpoint:
            self.model.load_state_dict(checkpoint['state_dict'])
            print('model loaded')
        else:
            self.model.load_state_dict(checkpoint)
            print('model loaded')
        self.model.to(self.device)

    def inference_once(self, scale_img):
        tensor_img = torch.from_numpy(scale_img.astype(np.float32)[:, :, :]).permute(2, 0, 1).to(self.device)
        input_t = tensor_img / 255.0
        normalize = transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
        input_t = normalize(input_t)
        input_t = input_t.unsqueeze(0)
        pred_global, pred_local, pred_fusion = self.model(input_t)[:3]
        pred_global = pred_global.data.cpu().numpy()
        pred_global = gen_trimap_from_segmap_e2e(pred_global)
        pred_local = pred_local.data.cpu().numpy()[0, 0, :, :]
        pred_fusion = pred_fusion.data.cpu().numpy()[0, 0, :, :]
        return pred_global, pred_local, pred_fusion

    def inference_img_p3m(self, img):
        h, w, c = img.shape
        new_h = min(MAX_SIZE_H, h - (h % 32))
        new_w = min(MAX_SIZE_W, w - (w % 32))

        if self.arch == 'swin' and (h < MIN_SIZE_H or w < MIN_SIZE_W):
            ratioh = float(MIN_SIZE_H) / float(h)
            ratiow = float(MIN_SIZE_W) / float(w)
            ratio = max(ratioh, ratiow)
            new_h = int(ratio * h)
            new_w = int(ratio * w)
            new_h = min(MAX_SIZE_H, new_h - (new_h % 32))
            new_w = min(MAX_SIZE_W, new_w - (new_w % 32))
            scale_img = resize(img, (new_h, new_w)) * 255.0
            pred_global, pred_local, pred_fusion = self.inference_once(scale_img)
            pred_local = resize(pred_local, (h, w))
            pred_global = resize(pred_global, (h, w)) * 255.0
            pred_fusion = resize(pred_fusion, (h, w))
            return pred_fusion

        if self.test_choice == 'HYBRID':
            global_ratio = 1 / 2
            local_ratio = 1
            resize_h = int(h * global_ratio)
            resize_w = int(w * global_ratio)
            new_h = min(MAX_SIZE_H, resize_h - (resize_h % 32))
            new_w = min(MAX_SIZE_W, resize_w - (resize_w % 32))
            scale_img = resize(img, (new_h, new_w)) * 255.0
            pred_coutour_1, pred_retouching_1, pred_fusion_1 = self.inference_once(scale_img)
            pred_coutour_1 = resize(pred_coutour_1, (h, w)) * 255.0
            resize_h = int(h * local_ratio)
            resize_w = int(w * local_ratio)
            new_h = min(MAX_SIZE_H, resize_h - (resize_h % 32))
            new_w = min(MAX_SIZE_W, resize_w - (resize_w % 32))
            scale_img = resize(img, (new_h, new_w)) * 255.0
            pred_coutour_2, pred_retouching_2, pred_fusion_2 = self.inference_once(scale_img)
            pred_retouching_2 = resize(pred_retouching_2, (h, w))
            pred_fusion = get_masked_local_from_global_test(pred_coutour_1, pred_retouching_2)
            return pred_fusion
        elif self.test_choice == 'RESIZE':
            resize_h = int(h / 2)
            resize_w = int(w / 2)
            new_h = min(MAX_SIZE_H, resize_h - (resize_h % 32))
            new_w = min(MAX_SIZE_W, resize_w - (resize_w % 32))
            scale_img = resize(img, (new_h, new_w)) * 255.0
            pred_global, pred_local, pred_fusion = self.inference_once(scale_img)
            pred_local = resize(pred_local, (h, w))
            pred_global = resize(pred_global, (h, w)) * 255.0
            pred_fusion = resize(pred_fusion, (h, w))
            return pred_fusion
        else:
            raise NotImplementedError

    async  def predict(self,file):
        self.model.eval() 
        # print('1')
        # img = img[:,:,:3] if img.ndim>2 else img
        # print('2')
        image_data = await file.read()
        image = Image.open(io.BytesIO(image_data))  # Correctly opens the image here!

        img = np.array(image) # Convert PIL image to numpy array
        print(img.shape)
        img = img[:, :, :3] if img.ndim > 2 else img  # Add color channel handling
        print(img.shape)
        with torch.no_grad(): 
            if torch.cuda.device_count() > 0: 
                torch.cuda.empty_cache()
            predict=self.inference_img_p3m(img)
        predict=predict*255
        composite=generate_composite_img(img,predict/255.0)
        return composite
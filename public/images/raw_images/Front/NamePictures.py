import os
import shutil
from PIL import Image
import torch
from torchvision import transforms, models

print("Script started.")

# Load pretrained model
print("Loading ResNet50...")
model = models.resnet50(weights=models.ResNet50_Weights.IMAGENET1K_V2)
model.eval()
weights = models.ResNet50_Weights.IMAGENET1K_V2
labels = weights.meta["categories"]

# Use standard ImageNet normalization
mean = [0.485, 0.456, 0.406]
std = [0.229, 0.224, 0.225]

preprocess = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(mean=mean, std=std)
])

def classify_image(im):
    input_tensor = preprocess(im)
    input_batch = input_tensor.unsqueeze(0)
    with torch.no_grad():
        output = model(input_batch)
    probs = torch.nn.functional.softmax(output[0], dim=0)
    top_prob, top_catid = torch.topk(probs, 1)
    label = labels[top_catid.item()]
    return " ".join(label.split()[:5])  # limit to 5 words

# Directory setup
current_dir = os.getcwd()
titled_dir = os.path.join(current_dir, "titled")
originals_dir = os.path.join(current_dir, "originals")
os.makedirs(titled_dir, exist_ok=True)
os.makedirs(originals_dir, exist_ok=True)

allowed_exts = {'.jpg', '.jpeg', '.png'}

# Process files
for fname in os.listdir(current_dir):
    full_path = os.path.join(current_dir, fname)

    if os.path.isdir(full_path):
        continue

    ext = os.path.splitext(fname)[1].lower()
    if ext not in allowed_exts:
        continue

    print(f"Processing: {fname}")
    try:
        with Image.open(full_path) as im:
            im = im.convert("RGB")
            title = classify_image(im)
            new_fname = title.title().replace(" ", "_") + ".jpg"
            save_path = os.path.join(titled_dir, new_fname)
            im.save(save_path)
            print(f"Saved titled image as: {new_fname}")
    except Exception as e:
        print(f"Error: {e}")
        continue

    try:
        shutil.move(full_path, os.path.join(originals_dir, fname))
        print(f"Moved original to: originals/{fname}")
    except Exception as e:
        print(f"Move error: {e}")

print("Done.")

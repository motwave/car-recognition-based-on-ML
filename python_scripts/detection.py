import sys
import cv2
import numpy as np

# Load the model
print("Loading the model...")
model_file = '/PythonScripts/models/yolov3.weights'
config_file = '/PythonScripts/models/yolov3.cfg'
net = cv2.dnn.readNet(config_file, model_file)

# Load the class names
print("Loading the class names...")
class_file = '/PythonScripts/models/coco.names'
with open(class_file, 'rt') as f:
    classes = f.read().rstrip('\n').split('\n')

# Load the image
print("Loading the image...")
image_file = '/PythonScripts/images/coco_example.png'
image = cv2.imread(image_file)
image = cv2.resize(image, (416, 416))

# Prepare the input for the model
print("Preparing the input for the model...")
blob = cv2.dnn.blobFromImage(image, 1 / 255.0, (416, 416), swapRB=True, crop=False)
net.setInput(blob)

# Get the output layer names
print("Getting the output layer names...")
layer_names = net.getLayerNames()
unconnected_out_layers = net.getUnconnectedOutLayers()
output_layer_names = [layer_names[i[0] - 1] for i in unconnected_out_layers.reshape(-1, 1)]


# Pass the input through the model
print("Passing the input through the model...")
detections = net.forward(output_layer_names)

# Iterate over the detected objects and draw bounding boxes
print("Iterating over the detected objects and drawing bounding boxes...")
for output in detections:
    for detection in output:
        scores = detection[5:]
        class_id = np.argmax(scores)
        confidence = scores[class_id]
        if confidence > 0.3:  # You can adjust this threshold
            print(f"Detected {classes[class_id]} with confidence {confidence * 100:.2f}%")
            print(confidence)
            center_x, center_y, width, height = (detection[0:4] * np.array([image.shape[1], image.shape[0], image.shape[1], image.shape[0]])).astype(int)
            x1 = int(center_x - width / 2)
            y1 = int(center_y - height / 2)
            x2 = x1 + width
            y2 = y1 + height
            cv2.rectangle(image, (x1, y1), (x2, y2), (0, 255, 0), 2)
            cv2.putText(image, f'{classes[class_id]} {confidence * 100:.2f}%', (x1, y1 - 5), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

# Display the image with bounding boxes
print("Saving the image with bounding boxes...")
output_image_file = '/PythonScripts/images/bounding_images/b_image_example_2.jpg'
cv2.imwrite(output_image_file, image)
cv2.destroyAllWindows()

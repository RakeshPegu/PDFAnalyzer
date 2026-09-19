import * as tf from "@tensorflow/tfjs";
import * as mobilenet from "@tensorflow-models/mobilenet";

import * as jpeg from "jpeg-js";

import * as path from "path";
import { fileURLToPath } from "url";
import * as fs from "fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function decodeImage(imagePath) {
  imagePath = path.join(__dirname, imagePath);

  const buffer = await fs.readFile(imagePath);
  const rawImageData = jpeg.decode(buffer);
  const imageTensor = tf.browser.fromPixels(rawImageData);
  return imageTensor;
}

export async function generateImageEmbeddings(imagePath) {
  const imageTensor = await decodeImage(imagePath);

  // Load MobileNet model
  const model = await mobilenet.load();

  // Classify and predict what the image is
  const prediction = await model.classify(imageTensor);
  console.log(`${imagePath} prediction`, prediction);

  // Preprocess the image and get the intermediate activation.
  const activation = model.infer(imageTensor, true);

  // Convert the tensor to a regular array.
  const vectorOutput = await activation.data();

  imageTensor.dispose(); // Clean up tensor

  return vectorOutput; //DIM 1024
}

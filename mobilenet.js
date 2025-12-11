import {IMAGENET_CLASSES} from './imagenet_classes.js';

export class MobileNet {
  constructor() {}

  async load() {
    this.model = await tf.loadGraphModel('model/model.json')
  }

  dispose() {
    if (this.model) {
      this.model.dispose();
    }
  }

  predict(input) {
    const preprocessed = input.resizeBilinear([128,128])
        .toFloat()
        .div(255.0)
        .expandDims();
    return this.model.predict(preprocessed);
  }

  getTopKClasses(logits, topK) {
    const predictions = tf.tidy(() => {
      return tf.softmax(logits);
    });

    const values = predictions.dataSync();
    predictions.dispose();

    let predictionList = [];
    for (let i = 0; i < values.length; i++) {
      predictionList.push({value: values[i], index: i});
    }
    predictionList = predictionList
                         .sort((a, b) => {
                           return b.value - a.value;
                         })
                         .slice(0, topK);

    return predictionList.map(x => {
      return {label: IMAGENET_CLASSES[x.index], value: x.value};
    });
  }
}
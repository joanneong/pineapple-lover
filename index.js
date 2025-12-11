import {MobileNet} from './mobilenet.js';

let mobileNet;

window.addEventListener('load', () => {
    console.time('Loading mobileNet');
    mobileNet = new MobileNet();
    mobileNet.load();
    console.timeEnd('Loading mobileNet');
});

const imgInput = document.getElementById('imgInput');
const imgPreview = document.getElementById('imgPreview');
const previewText = document.getElementById('previewText');

imgInput.addEventListener('change', event => {
    const file = event.target.files[0];
    const imgUrl = URL.createObjectURL(file);
    previewText.style.display = 'none';
    imgPreview.src = imgUrl;
    imgPreview.style.display = 'block';
});

// const cat = document.getElementById('cat');
// cat.onload = async () => {
//   console.log("Loaded cat!")
//   const resultElement = document.getElementById('result');

//   resultElement.innerText = 'Loading MobileNet...';

//   const pixels = tf.browser.fromPixels(cat);

//   console.time('Prediction');
//   let result = mobileNet.predict(pixels);
//   const topK = mobileNet.getTopKClasses(result, 5);
//   console.timeEnd('Prediction');

//   resultElement.innerText = '';
//   topK.forEach(x => {
//     resultElement.innerText += `${x.value.toFixed(3)}: ${x.label}\n`;
//   });

//   mobileNet.dispose();
// };
// cat.src='./cat.jpg'



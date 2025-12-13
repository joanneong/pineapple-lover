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
const tasteButton = document.getElementById('tasteButton');
const verdict = document.getElementById('verdict');

imgInput.addEventListener('change', event => {
    const file = event.target.files[0];
    if (!file) {
        imgPreview.src = '#';
        imgPreview.style.display = 'none';
        previewText.style.display = 'block';
        tasteButton.style.display = 'none';
        return;
    }

    const imgUrl = URL.createObjectURL(file);
    previewText.style.display = 'none';
    imgPreview.src = imgUrl;
    imgPreview.style.display = 'block';
});

imgPreview.onload = async() => {
    console.log('Image is loaded');
    tasteButton.style.display = 'block';
}

tasteButton.addEventListener('click', event => {
    event.preventDefault();
    tasteButton.disabled = true;

    const pixels = tf.browser.fromPixels(imgPreview);
    console.time('Prediction');
    let result = mobileNet.predict(pixels);
    const topK = mobileNet.getTopKClasses(result, 1);
    console.timeEnd('Prediction');

    verdict.innerText = '';
    topK.forEach(x => {
        verdict.innerText += `${x.value.toFixed(3)}: ${x.label}\n`;
    });
    tasteButton.disabled = false;
});

window.addEventListener('beforeunload', () => {
    mobileNet.dispose();
});
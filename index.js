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
const verdictText = document.getElementById('verdictText');
const topKText = document.getElementById('topKText');

function resetElements() {
    imgPreview.src = '#';
    imgPreview.style.display = 'none';
    previewText.style.display = 'block';
    tasteButton.style.display = 'none';
    verdict.style.display = 'none';
}

imgInput.addEventListener('change', event => {
    const file = event.target.files[0];
    if (!file) {
        resetElements();
        return;
    }

    const imgUrl = URL.createObjectURL(file);
    previewText.style.display = 'none';
    imgPreview.src = imgUrl;
    imgPreview.style.display = 'block';
    verdict.style.display = 'none';
});

imgPreview.onload = async() => {
    tasteButton.style.display = 'block';
}

function getVerdict(prediction) {
    if (!prediction.label.includes('pineapple')) {
        return "This is NOT a pineapple :(";
    }

    if (prediction.value < 0.8) {
        return "This may be a pineapple...or is it?";
    }

    return "This is most likely a pineapple :)";
}

tasteButton.addEventListener('click', event => {
    event.preventDefault();
    tasteButton.style.display = 'none';

    const pixels = tf.browser.fromPixels(imgPreview);
    console.time('Prediction');
    let result = mobileNet.predict(pixels);
    const topK = mobileNet.getTopKClasses(result, 3);
    console.timeEnd('Prediction');

    verdictText.innerText = getVerdict(topK[0]);
    topKText.innerHTML = '';
    topK.forEach(x => {
        topKText.innerHTML += `${x.value.toFixed(3)}: ${x.label}<br>`;
    });
    verdict.style.display = 'block';
});

window.addEventListener('beforeunload', () => {
    mobileNet.dispose();
});
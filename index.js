import {MobileNet} from './mobilenet.js';

let mobileNet;

const loader = document.getElementById("initialLoader");
const card = document.getElementsByClassName("cardBorder")[0];
const imgInput = document.getElementById('imgInput');
const imgPreview = document.getElementById('imgPreview');
const previewText = document.getElementById('previewText');
const verdict = document.getElementById('verdict');
const verdictProb = document.getElementById('verdictProb');
const verdictText = document.getElementById('verdictText');

window.addEventListener('load', () => {
    console.time('Loading mobileNet');
    mobileNet = new MobileNet();
    mobileNet.load();
    console.timeEnd('Loading mobileNet');
    loader.style.display = 'none';
    card.style.display = 'block';
});

function resetKPredictions() {
    const nextPredictions = document.getElementById("topKPredictions");
    nextPredictions.replaceChildren();
    [1,2,3].forEach(x => {
        const nextPrediction = document.createElement("p");
        nextPrediction.textContent = '???';
        const nextPredictionValue = document.createElement("span");
        nextPredictionValue.textContent = '????';
        nextPrediction.appendChild(nextPredictionValue);
        nextPredictions.appendChild(nextPrediction);
    });
}

function resetElements() {
    imgPreview.src = '#';
    imgPreview.style.display = 'none';
    previewText.style.display = 'block';
    verdictProb.innerText = '??';
    verdictText.innerText = 'This may be a pineapple...or is it?';
    resetKPredictions();
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
});

imgPreview.onload = async() => {
    const pixels = tf.browser.fromPixels(imgPreview);
    console.time('Prediction');
    let result = mobileNet.predict(pixels);
    const topK = mobileNet.getTopKClasses(result, 3);
    console.timeEnd('Prediction');

    // Set up verdict
    verdictText.innerText = getVerdict(topK[0]);
    verdictProb.innerText = (topK[0].value * 100).toFixed(2);

    // Set up next predictions
    const nextPredictions = document.getElementById("topKPredictions");
    nextPredictions.replaceChildren();
    topK.forEach(x => {
        const nextPrediction = document.createElement("p");
        nextPrediction.textContent = x.label;
        const nextPredictionValue = document.createElement("span");
        nextPredictionValue.textContent = (x.value * 100).toFixed(2);
        nextPrediction.appendChild(nextPredictionValue);
        nextPredictions.appendChild(nextPrediction);
    });
    verdict.style.display = 'flex';
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

window.addEventListener('beforeunload', () => {
    mobileNet.dispose();
});
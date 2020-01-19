import * as faceapi from 'face-api.js';

Promise.all({
    faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
    faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
    faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
});

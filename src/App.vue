<template>
  <div id="app">
    <textarea ref="inputText" rows="4" cols="50"></textarea>
    <button @click="analyze">Analyze</button>
    <br />
    <br />
    <textarea ref="output" rows="7" cols="50"></textarea>
    <video autoplay="true" ref="videoElement">hey</video>
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script>
import * as faceapi from 'face-api.js';
import json from './emoji-list.json';
import weights from './emoji-weights.json';

Promise.all([
  faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
  faceapi.nets.faceExpressionNet.loadFromUri("/models"),
  faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
  faceapi.nets.ssdMobilenetv1.loadFromUri("/models")
]);

import * as faceapi from "face-api.js";

export default {
  name: "app",
  mounted() {
    const _self = this;
    this.video = this.$refs.videoElement;
    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(function(stream) {
          _self.video.srcObject = stream;
        })
        .catch(function(err0r) {
          console.log("Something went wrong!", err0r);
        });
    }
  },
  data() {
    return {
      video: null,
      emojiList: json,
      emojiWeights: weights
    };
  },
  methods: {

    async analyze() {
      this.takePicture();
      const picture = this.$refs.canvas;
      const face = await faceapi.detectSingleFace(picture)
        .withFaceLandmarks().withFaceExpressions();
      if (typeof face !== 'undefined')
      {
        this.displayExpressions(face);

        var sortedEmojis = this.getWeights(face);
        var topEmoji = String.fromCodePoint(this.emojiWeights[sortedEmojis[0][0]].code);
        console.log(topEmoji);
        this.$refs.inputText.value += topEmoji;
      }
    },
    displayExpressions(face) {
      const arr = face.expressions.asSortedArray();
      var txt = "";
      for (var i = 0; i < arr.length; i++)
      {
        txt += arr[i].expression + ": " + arr[i].probability + "\n";
      }
      this.$refs.output.textContent = txt;
    },
    getWeights(face) {
      var emojiSimilarity = new Map();
      Object.keys(this.emojiWeights).forEach(emoji => {
        var sum = 0;
        for (var expr in face.expressions)
        {
          var emojiWeight = this.emojiWeights[emoji].weights[expr];
          var imgCoeff = face.expressions[expr];
          var prod = imgCoeff * emojiWeight;
          if (!isNaN(prod))
          {
            sum += prod;
          }
        }
        emojiSimilarity.set(emoji, sum);
      });
      return Array.from(emojiSimilarity).sort((a, b) => {
        return b[1] - a[1];
      });
    },
    getEmojis(face) {
      var emojiSimilarity = new Map();
      Object.keys(this.emojiList).forEach(emoji => {
        var sum = 0;
        for (var expr in face.expressions)
        {
          var emojiCoeff = this.emojiList[emoji].expressions[expr];
          var imgCoeff = face.expressions[expr];
          var diff = Math.abs(imgCoeff - emojiCoeff);
          if (!isNaN(diff))
          {
            sum += diff;
          }
        }
        emojiSimilarity.set(emoji, sum);
      });
      return Array.from(emojiSimilarity).sort((a, b) => {
        return a[1] - b[1];
      });
    },
    takePicture() {
      const picture = this.$refs.canvas;

      const ctx = picture.getContext("2d");
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(this.video, 0, 0, picture.width, picture.height);

    }
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

video,
canvas {
  display: block;
  height: 600px;
  width: 800px;
  max-width: 1280px;

  margin: 0 auto;

  box-shadow: 4px 4px 4px 4px;
}
</style>

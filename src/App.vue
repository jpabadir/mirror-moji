<template>
    <div id="app">
      <video autoplay="true" ref="videoElement">hey</video>
      <div class="overallArea">
      <div class="textArea">
      <textarea rows="4" cols="50" class="fieldSpace" ref="inputText"></textarea>
    </div>

    <div class="textArea2">
      <button class="myButton" @click="analyze">Analyze</button>
    </div>

    </div>
        <br/>
        <br/>
        <br>
        <br>
        <br>
        <textarea ref="output" class="fieldSpace" rows="7" cols="50"></textarea>
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
.overallArea{
  margin-top: 40px;
}
.textArea{
float: left;
    width: 54%;
    text-align: right;
}

.textArea2{
     float: left;
    width: 17%;
    margin-top: 14px;
}
.fieldSpace{
  resize: none;
  border-radius: 10px;
  margin: 10px;
}
.myButton {
	box-shadow: 0px 0px 0px 2px #9fb4f2;
	background:linear-gradient(to bottom, #7892c2 5%, #476e9e 100%);
	background-color:#7892c2;
	border-radius:10px;
	border:1px solid #4e6096;
	display:inline-block;
	cursor:pointer;
	color:#ffffff;
	font-family:Arial;
	font-size:19px;
	padding:12px 37px;
	text-decoration:none;
	text-shadow:0px 1px 0px #283966;
}
.myButton:hover {
	background:linear-gradient(to bottom, #476e9e 5%, #7892c2 100%);
	background-color:#476e9e;
}
.myButton:active {
	position:relative;
	top:1px;
}

/* button css */


#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

video, canvas {
  display: block;
  height: 600px;
  width: 800px;
  max-width: 1280px;

  margin: 0 auto;

  box-shadow: 4px 4px 4px 4px;
}


</style>

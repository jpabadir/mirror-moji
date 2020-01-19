<template>
  <div id="app">
    <textarea rows="4" cols="50"></textarea>
    <button @click="analyze">Analyze</button>
    <br />
    <br />
    <textarea ref="output" rows="7" cols="50"></textarea>
    <video autoplay="true" ref="videoElement">hey</video>
    <canvas ref="canvas"></canvas>
    <!-- <img src="./assets/emojis/cry.png" ref="emojipic" /> -->
  </div>
</template>

<script>
import * as faceapi from "face-api.js";

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
      video: null
    };
  },
  methods: {
    async analyze() {
      this.takePicture();
      const picture = this.$refs.canvas;
      // const picture = this.$refs.emojipic;
      this.faceLandmarkStuff(picture);
      // const face = await faceapi
      //   .detectSingleFace(picture)
      //   .withFaceLandmarks()
      //   .withFaceExpressions();
      // if (typeof face !== "undefined") {
      //   const arr = face.expressions.asSortedArray();
      //   var txt = "";
      //   for (var i = 0; i < arr.length; i++) {
      //     txt += arr[i].expression + ": " + arr[i].probability + "\n";
      //   }
      //   this.$refs.output.textContent = txt;
      //   console.log(face.expressions.asSortedArray());
      // }
    },
    async faceLandmarkStuff(facePic) {
      const landmarks = await faceapi.detectFaceLandmarks(facePic);
      console.log(landmarks.positions);
      var flattenedInputtedPositions = [];
      landmarks.positions.forEach(point => {
        flattenedInputtedPositions.push(point.x);
        flattenedInputtedPositions.push(point.y);
      })
      console.log(flattenedInputtedPositions);
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

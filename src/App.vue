<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" />
    <HelloWorld
      msg="'Keeping people fed is my only peace of mind now, and I turn the 6 upside down, it's a 9 now.'"
    />
    <textarea rows="4" cols="50"></textarea>
    <button @click="analyze">Analyze</button>
    <br />
    <br />
    <video autoplay="true" ref="videoElement">hey</video>
  </div>
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";

import * as faceapi from "face-api.js";

export default {
  name: "app",
  components: {
    HelloWorld
  },
  mounted() {
    // var video = this.$el.querySelector("#videoElement");
    var video = this.$refs.videoElement;
    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(function(stream) {
          video.srcObject = stream;
        })
        .catch(function(err0r) {
          console.log("Something went wrong!", err0r);
        });
    }
  },
  methods: {
    analyze() {
      // console.log("analyzing");
      console.log(faceapi);
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
</style>

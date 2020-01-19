<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" />
    <HelloWorld
      msg="'Keeping people fed is my only peace of mind now, and I turn the 6 upside down, it's a 9 now.'"
    />
    <textarea rows="4" cols="50"></textarea>
    <button @click="takePicture">Analyze</button>
    <br />
    <br />
    <video autoplay="true" ref="videoElement">hey</video>
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";

export default {
  name: "app",
  components: {
    HelloWorld
  },
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
    analyze() {
      console.log("analyzing");
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

canvas {
  display: block;
  width: 100%;
  max-width: 1280px;

  margin: 0 auto;

  box-shadow: 4px 4px 4px 4px;
}
</style>

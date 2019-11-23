let app = new Vue({
  el : '#app',
  data : {
    mainText : 'Music identification empowered by lyric matching',
    buttonText : 'Start recording',
    stopped : true,
    mediaRecorder: null,
    recordedChunks: [],
    href: '',
    download: '',
  },
  mounted : function() {
    let vm = this
    navigator.mediaDevices.getUserMedia({audio : true, video : false})
        .then((stream) => {
          vm.mediaRecorder = new MediaRecorder(stream, {mimeType : 'audio/webm'});
          vm.mediaRecorder.addEventListener('dataavailable', function(e) {
            if (e.data.size > 0) {
              vm.recordedChunks.push(e.data);
            }
          });

          vm.mediaRecorder.addEventListener('stop', () => {
            /*
            vm.href = URL.createObjectURL(new Blob(vm.recordedChunks))
            vm.download = 'test.wav'
            */
            let fd = new FormData()
            fd.append('file.wav', new Blob(vm.recordedChunks))
            fetch('/upload', {
              method: 'post',
              body: fd
            })
          });
          vm.mediaRecorder.addEventListener('start', () => {
          })
        })
  },
  methods : {
    clickButton : function() {
      if (this.stopped) {
        this.mediaRecorder.start()
        this.recordedChunks = []
        this.buttonText = 'Stop recording'
      } else {
        this.mediaRecorder.stop()
        this.buttonText = 'Start recording'
      }
      this.stopped = !this.stopped
    },
  }

})

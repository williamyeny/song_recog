let app = new Vue({
  el : '#app',
  data : {
    mainText : 'Record something!',
    buttonText : 'Start recording',
    buttonDisabled: false,
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
            fd.append('audio', new Blob(vm.recordedChunks))
            fetch('/upload', {
              method: 'post',
              body: fd
            }).then(resp => 
              resp.json()
            ).then(data => {
              console.log(data)
              data = JSON.parse(data)
              
              vm.buttonDisabled = false
              vm.buttonText = 'Start recording'
              
              if (data.status === 'success') {
                result = data.result
                vm.mainText = `
                  Title: ${result.title}
                  Artist: ${result.artist}
                  Album: ${result.album}
                  Release date: ${result.release_date}
                `
              } else {
                vm.mainText = 'Sorry, we couldn\'t find a match :('
              }
            })
          })
          vm.mediaRecorder.addEventListener('start', () => {
          })
        })
  },
  methods : {
    clickButton : function() {
      if (this.stopped) {
        this.mediaRecorder.start()
        this.recordedChunks = []
        this.mainText = 'Recording...'
        this.buttonText = 'Stop recording'
      } else {
        this.mediaRecorder.stop()
        this.mainText = 'Uploading and analyzing...'
        this.buttonText = 'Please wait'
        this.buttonDisabled = true
      }
      this.stopped = !this.stopped
    },
  }

})

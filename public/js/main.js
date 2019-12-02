let app = new Vue({
  el : '#app',
  data : {
    mainText : 'Record something!',
    buttonText : 'Start recording',
    buttonDisabled: false,
    stopped : true,
    recorder: null,
    audioStream: null,
    href: '',
    download: '',
  },
  mounted : function() {
    let vm = this
    navigator.mediaDevices.getUserMedia({audio : true, video : false})
        .then((stream) => {
          const audioContext = new window.AudioContext()
          vm.audioStream = stream
          const input = audioContext.createMediaStreamSource(stream)
         
          vm.recorder = new Recorder(input, { numChannels:1 })
        })
  },
  methods : {
    clickButton : function() {
      let vm = this
      if (this.stopped) {
        vm.recorder.clear()
        vm.recorder.record()
        vm.mainText = 'Recording...'
        vm.buttonText = 'Stop recording'
      } else {
        vm.mainText = 'Uploading and analyzing...'
        vm.buttonText = 'Please wait'
        vm.buttonDisabled = true

        vm.recorder.stop()
        vm.recorder.exportWAV((blob) => {
          let fd = new FormData()
          fd.append('audio', blob)
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
            
            if (data.status === 'success' && data.result != null) {
              result = data.result
              vm.mainText = `
                Title: ${result.title}
                Artist: ${result.artist}
                Album: ${result.album}
                Release date: ${result.release_date}
                Timestamp in song: ${result.timecode}
              `
            } else {
              vm.mainText = 'Sorry, we couldn\'t find a match :('
            }
          })
        })
      }
      this.stopped = !this.stopped
    },
  }

})

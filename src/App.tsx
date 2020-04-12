import React, { useRef, useEffect } from 'react';

import BeatDetektor from './beatdetektor';

import './style.scss';

function App() {
    const canvas = useRef(null);

    useEffect(() => {
        const handleSuccess = function (stream: MediaStream) {
            const context = new AudioContext();
            const source = context.createMediaStreamSource(stream);
            const bpm = new BeatDetektor(85, 169, {
                ...BeatDetektor.config_default,
                // BD_DETECTION_RATE: 48,
                // BD_MINIMUM_CONTRIBUTIONS: 2,
            });

            // factory method
            const analyser = context.createAnalyser();
            analyser.fftSize = 2048;

            const bufferLength = analyser.frequencyBinCount;

            const dataArray = new Uint8Array(bufferLength);

            source.connect(analyser);
            // analyser.connect(context.destination);

            const canvasCtx = canvas.current.getContext('2d');

            function draw(time: number) {
                requestAnimationFrame(draw);
                // console.log('xxx');

                analyser.getByteFrequencyData(dataArray);

                canvasCtx.fillStyle = 'rgb(0, 0, 0)';
                canvasCtx.fillRect(0, 0, canvas.current.width, canvas.current.height);

                // canvasCtx.lineWidth = 40;
                // canvasCtx.strokeStyle = 'rgb(255, 0, 0)';

                // canvasCtx.beginPath();

                // var sliceWidth = (canvas.current.width * 1.0) / bufferLength;
                // var x = 0;

                // for (var i = 0; i < bufferLength; i++) {
                //     var v = dataArray[i] / 128.0;
                //     var y = (v * canvas.current.height) / 2;

                //     if (i === 0) {
                //         canvasCtx.moveTo(x, y);
                //     } else {
                //         canvasCtx.lineTo(x, y);
                //     }

                //     x += sliceWidth;
                // }

                // canvasCtx.lineTo(canvas.current.width, canvas.current.height / 2);
                // canvasCtx.stroke();


                // canvasCtx.beginPath();
                // canvasCtx.moveTo(0, 0);
                // canvasCtx.lineTo(0, 30);
                // canvasCtx.stroke();

                bpm.process(time / 1000, dataArray, canvasCtx, canvas);

                // console.log('bpm', bpm.win_bpm_int_lo);
            }

            draw(null);
        };

        navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(handleSuccess);
    }, []);

    // onchange = useCallback((e) => {
    //     console.log('xxx', e, e.target);
    //     const file = e.target.files[0];
    //     const url = URL.createObjectURL(file);
    //     // Do something with the audio file.
    //     player.src = url;
    // }, []);

    return (
        <div className="app">
            <canvas ref={canvas} />
        </div>
    );
}

export default App;

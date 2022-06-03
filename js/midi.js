/*
console.log('start');
		var audioContext = null;
		var player = null;
		var reverberator = null;
		var equalizer = null;
		var songStart = 0;
		var input = null;
		var currentSongTime = 0;
		var nextStepTime = 0;
		var nextPositionTime = 0;
		var loadedsong = null;
		function go() {
			document.getElementById('tmr').innerHTML = 'starting...';
			try {
				startPlay(loadedsong);
				document.getElementById('tmr').innerHTML = 'playing...';
			} catch (expt) {
				document.getElementById('tmr').innerHTML = 'error ' + expt;
			}
		}
		function startPlay(song) {
			currentSongTime = 0;
			songStart = audioContext.currentTime;
			nextStepTime = audioContext.currentTime;
			var stepDuration = 44 / 1000;
			tick(song, stepDuration);
		}
		function tick(song, stepDuration) {
			if (audioContext.currentTime > nextStepTime - stepDuration) {
				sendNotes(song, songStart, currentSongTime, currentSongTime + stepDuration, audioContext, input, player);
				currentSongTime = currentSongTime + stepDuration;
				nextStepTime = nextStepTime + stepDuration;
				if (currentSongTime > song.duration) {
					currentSongTime = currentSongTime - song.duration;
					sendNotes(song, songStart, 0, currentSongTime, audioContext, input, player);
					songStart = songStart + song.duration;
				}
			}
			if (nextPositionTime < audioContext.currentTime) {
				var o = document.getElementById('position');
				o.value = 100 * currentSongTime / song.duration;
				document.getElementById('tmr').innerHTML = '' + Math.round(100 * currentSongTime / song.duration) + '%';
				nextPositionTime = audioContext.currentTime + 3;
			}
			window.requestAnimationFrame(function (t) {
				tick(song, stepDuration);
			});
		}
		function sendNotes(song, songStart, start, end, audioContext, input, player) {
			for (var t = 0; t < song.tracks.length; t++) {
				var track = song.tracks[t];
				for (var i = 0; i < track.notes.length; i++) {
					if (track.notes[i].when >= start && track.notes[i].when < end) {
						var when = songStart + track.notes[i].when;
						var duration = track.notes[i].duration;
						if (duration > 3) {utton
						
							duration = 3;
						}
						var instr = track.info.variable;
						var v = track.volume / 7;
						player.queueWaveTable(audioContext, input, window[instr], when, track.notes[i].pitch, duration, v, track.notes[i].slides);
					}
				}
			}
			for (var b = 0; b < song.beats.length; b++) {
				var beat = song.beats[b];
				for (var i = 0; i < beat.notes.length; i++) {
					if (beat.notes[i].when >= start && beat.notes[i].when < end) {
						var when = songStart + beat.notes[i].when;
						var duration = 1.5;
						var instr = beat.info.variable;
						var v = beat.volume / 2;
						player.queueWaveTable(audioContext, input, window[instr], when, beat.n, duration, v);
					}
				}
			}
		}
		function startLoad(song) {
			console.log(song);
			var AudioContextFunc = window.AudioContext || window.webkitAudioContext;
			audioContext = new AudioContextFunc();
			player = new WebAudioFontPlayer();

			equalizer = player.createChannel(audioContext);
			reverberator = player.createReverberator(audioContext);
			//input = reverberator.input;
			input = equalizer.input;
			equalizer.output.connect(reverberator.input);
			reverberator.output.connect(audioContext.destination);

			for (var i = 0; i < song.tracks.length; i++) {
				var nn = player.loader.findInstrument(song.tracks[i].program);
				var info = player.loader.instrumentInfo(nn);
				song.tracks[i].info = info;
				song.tracks[i].id = nn;
				player.loader.startLoad(audioContext, info.url, info.variable);
			}
			for (var i = 0; i < song.beats.length; i++) {
				var nn = player.loader.findDrum(song.beats[i].n);
				var info = player.loader.drumInfo(nn);
				song.beats[i].info = info;
				song.beats[i].id = nn;
				player.loader.startLoad(audioContext, info.url, info.variable);
			}
			player.loader.waitLoad(function () {
				console.log('buildControls');
				buildControls(song);
				resetEqlualizer();
			});
		}
		function resetEqlualizer(){
			equalizer.band32.gain.setTargetAtTime(2,0,0.0001);
			equalizer.band64.gain.setTargetAtTime(2,0,0.0001);
			equalizer.band128.gain.setTargetAtTime(1,0,0.0001);
			equalizer.band256.gain.setTargetAtTime(0,0,0.0001);
			equalizer.band512.gain.setTargetAtTime(-1,0,0.0001);
			equalizer.band1k.gain.setTargetAtTime(5,0,0.0001);
			equalizer.band2k.gain.setTargetAtTime(4,0,0.0001);
			equalizer.band4k.gain.setTargetAtTime(3,0,0.0001);
			equalizer.band8k.gain.setTargetAtTime(-2,0,0.0001);
			equalizer.band16k.gain.setTargetAtTime(2,0,0.0001);
		}
		function buildControls(song) {
			audioContext.resume();
			var o = document.getElementById('cntls');
			var html = '<h2 id="wrng">Refresh browser page to load another song</h2>';
			html = html + '<p id="tmr"><button onclick="go();">Play</button></p>';
			html = html + '<p><input id="position" type="range" min="0" max="100" value="0" step="1" /></p>';
			html = html + '<h3>Channels</h3>';
			for (var i = 0; i < song.tracks.length; i++) {
				var v = 100 * song.tracks[i].volume;
				html = html + '<p>' + chooserIns(song.tracks[i].id, i) + '<input id="channel' + i + '" type="range" min="0" max="100" value="' + v + '" step="1" /></p>';
			}
			html = html + '<h3>Drums</h3>';
			for (var i = 0; i < song.beats.length; i++) {
				var v = 100 * song.beats[i].volume;
				html = html + '<p>' + chooserDrum(song.beats[i].id, i) + '<input id="drum' + i + '" type="range" min="0" max="100" value="' + v + '" step="1" /></p>';
			}
			o.innerHTML = html;
			console.log('Loaded');
			var pos = document.getElementById('position');
			pos.oninput = function (e) {
				if (loadedsong) {
					player.cancelQueue(audioContext);
					var next = song.duration * pos.value / 100;
					songStart = songStart - (next - currentSongTime);
					currentSongTime = next;
				}
			};
			console.log('Tracks');
			for (var i = 0; i < song.tracks.length; i++) {
				setVolumeAction(i, song);
			}
			console.log('Drums');
			for (var i = 0; i < song.beats.length; i++) {
				setDrVolAction(i, song);
			}
			loadedsong = song;
		}
		function setVolumeAction(i, song) {
			var vlm = document.getElementById('channel' + i);
			vlm.oninput = function (e) {
				player.cancelQueue(audioContext);
				var v = vlm.value / 100;
				if (v < 0.000001) {
					v = 0.000001;
				}
				song.tracks[i].volume = v;
			};
			var sl = document.getElementById('selins' + i);
			sl.onchange = function (e) {
				var nn = sl.value;
				var info = player.loader.instrumentInfo(nn);
				player.loader.startLoad(audioContext, info.url, info.variable);
				player.loader.waitLoad(function () {
					console.log('loaded');
					song.tracks[i].info = info;
					song.tracks[i].id = nn;
				});
			};
		}
		function setDrVolAction(i, song) {
			var vlm = document.getElementById('drum' + i);
			vlm.oninput = function (e) {
				player.cancelQueue(audioContext);
				var v = vlm.value / 100;
				if (v < 0.000001) {
					v = 0.000001;
				}
				song.beats[i].volume = v;
			};
			var sl = document.getElementById('seldrm' + i);
			sl.onchange = function (e) {
				var nn = sl.value;
				var info = player.loader.drumInfo(nn);
				player.loader.startLoad(audioContext, info.url, info.variable);
				player.loader.waitLoad(function () {
					console.log('loaded');
					song.beats[i].info = info;
					song.beats[i].id = nn;
				});
			};
		}
		function chooserIns(n, track) {
			var html = '<select id="selins' + track + '">';
			for (var i = 0; i < player.loader.instrumentKeys().length; i++) {
				var sel = '';
				if (i == n) {
					sel = ' selected';
				}
				html = html + '<option value="' + i + '"' + sel + '>' + i + ': ' + player.loader.instrumentInfo(i).title + '</option>';
			}
			html = html + '</select>';
			return html;
		}
		function chooserDrum(n, beat) {
			var html = '<select id="seldrm' + beat + '">';
			for (var i = 0; i < player.loader.drumKeys().length; i++) {
				var sel = '';
				if (i == n) {
					sel = ' selected';
				}
				html = html + '<option value="' + i + '"' + sel + '>' + i + ': ' + player.loader.drumInfo(i).title + '</option>';
			}
			html = html + '</select>';
			return html;
		}
		function handleFileSelect(event) {
			console.log(event);
			var file = event.target.files[0];
			console.log(file);
			var fileReader = new FileReader();
			fileReader.onload = function (progressEvent) {
				console.log(progressEvent);
				var arrayBuffer = progressEvent.target.result;
				console.log(arrayBuffer);
				var midiFile = new MIDIFile(arrayBuffer);
				var song = midiFile.parseSong();
				startLoad(song);
			};
			fileReader.readAsArrayBuffer(file);
		}
		function handleExample(path) {
			console.log(path);
			var xmlHttpRequest = new XMLHttpRequest();
			xmlHttpRequest.open("GET", path, true);
			xmlHttpRequest.responseType = "arraybuffer";
			xmlHttpRequest.onload = function (e) {
				var arrayBuffer = xmlHttpRequest.response;
				var midiFile = new MIDIFile(arrayBuffer);
				var song = midiFile.parseSong();
				startLoad(song);
			};
			xmlHttpRequest.send(null);
		}
		document.getElementById('filesinput').addEventListener('change', handleFileSelect, false);
*/

/****  Midi JS ****/

console.log('start');
var audioContext = null;
var player = null;
var reverberator = null;
var songStart = 0;
var input = null;
var currentSongTime = 0;
var nextStepTime = 0;
var nextPositionTime = 0;
var loadedsong = null;

function go() {
    document.getElementById('percent').innerHTML = 'starting...';
    try {
        startPlay(loadedsong);
        document.getElementById('percent').innerHTML = '재생..';
    } catch (expt) {
        document.getElementById('percent').innerHTML = 'error ' + expt;
    }
}

function startPlay(song) {
    currentSongTime = 0;
    songStart = audioContext.currentTime;
    nextStepTime = audioContext.currentTime;
    var stepDuration = 44 / 1000;
    tick(song, stepDuration);
}

function tick(song, stepDuration) {
    if (audioContext.currentTime > nextStepTime - stepDuration) {
        sendNotes(song, songStart, currentSongTime, currentSongTime + stepDuration, audioContext, input, player);
        currentSongTime = currentSongTime + stepDuration;
        nextStepTime = nextStepTime + stepDuration;
        if (currentSongTime > song.duration) {
            currentSongTime = currentSongTime - song.duration;
            sendNotes(song, songStart, 0, currentSongTime, audioContext, input, player);
            songStart = songStart + song.duration;
        }
    }
    if (nextPositionTime < audioContext.currentTime) {
        var o = document.getElementById('position');
        o.value = 100 * currentSongTime / song.duration;
        document.getElementById('percent').innerHTML = '' + Math.round(100 * currentSongTime / song.duration) + '%';
        nextPositionTime = audioContext.currentTime + 3;
    } else if  (song.duration == audioContext.currentTime) {
	    console.log("end");
	    alert("end");
	    audioContext.close();
	    //return false;
    }
    window.requestAnimationFrame(function(t) {
        tick(song, stepDuration);
    });
}

function sendNotes(song, songStart, start, end, audioContext, input, player) {
    for (var t = 0; t < song.tracks.length; t++) {
        var track = song.tracks[t];
        for (var i = 0; i < track.notes.length; i++) {
            if (track.notes[i].when >= start && track.notes[i].when < end) {
                var when = songStart + track.notes[i].when;
                var duration = track.notes[i].duration;
                if (duration > 3) {
                    duration = 3;
                }
                var instr = track.info.variable;
                var v = track.volume / 7;
                player.queueWaveTable(audioContext, input, window[instr], when, track.notes[i].pitch, duration, v, track.notes[i].slides);
            }
        }
    }
    for (var b = 0; b < song.beats.length; b++) {
        var beat = song.beats[b];
        for (var i = 0; i < beat.notes.length; i++) {
            if (beat.notes[i].when >= start && beat.notes[i].when < end) {
                var when = songStart + beat.notes[i].when;
                var duration = 1.5;
                var instr = beat.info.variable;
                var v = beat.volume / 2;
                player.queueWaveTable(audioContext, input, window[instr], when, beat.n, duration, v);
            }
        }
    }
}

function startLoad(song) {
    console.log(song);
    var AudioContextFunc = window.AudioContext || window.webkitAudioContext;
    audioContext = new AudioContextFunc();
    player = new WebAudioFontPlayer();
    reverberator = player.createReverberator(audioContext);
    reverberator.output.connect(audioContext.destination);
    input = reverberator.input;
    for (var i = 0; i < song.tracks.length; i++) {
        var nn = player.loader.findInstrument(song.tracks[i].program);
        var info = player.loader.instrumentInfo(nn);
        song.tracks[i].info = info;
        song.tracks[i].id = nn;
        player.loader.startLoad(audioContext, info.url, info.variable);
    }
    for (var i = 0; i < song.beats.length; i++) {
        var nn = player.loader.findDrum(song.beats[i].n);
        var info = player.loader.drumInfo(nn);
        song.beats[i].info = info;
        song.beats[i].id = nn;
        player.loader.startLoad(audioContext, info.url, info.variable);
    }
    player.loader.waitLoad(function() {
        console.log('buildControls');
        buildControls(song);
    });
}

function buildControls(song) {
    //audioContext.resume();
    var o = document.getElementById('cntls');
    var html = '<div class="ui large top attached label"><i class="volume up icon"></i>미디 음원 듣기</div>';
    html = html + '<button class="ui icon button" id="go"><i class="play icon"></i></button>';
    html = html + '<button class="ui icon button" id="suspend"><i class="pause icon"></i></button>';
    html = html + '<button class="ui icon button" id="stop"><i class="stop icon"></i></button>';
    html = html + '<div class="ui transparent input"><div class="ui label"><i class="sliders horizontal icon"></i><div class="detail"><input style="width:100%" id="position" type="range" min="0" max="100" value="0" step="1" /><span id="percent"></span></div></div></div>';
    html = html + '<div><i class="caret square outline down icon"></i>악기선택</div>';
    for (var i = 0; i < song.tracks.length; i++) {
        var v = 100 * song.tracks[i].volume;
        html = html + '<div style="width:100%">' + chooserIns(song.tracks[i].id, i) + '<div class="ui label">볼륨<div class="detail"><input id="channel' + i + '" type="range" min="0" max="100" value="' + v + '" step="1" /></div></div></div>';
    }
    // html = html + '<div class="ui sub header">드럼선택</div>';
    for (var i = 0; i < song.beats.length; i++) {
        var v = 100 * song.beats[i].volume;
        html = html + '<div>' + chooserDrum(song.beats[i].id, i) + '<i class="volume up tiny icon"> </i><input id="drum' + i + '" type="range" min="0" max="100" value="' + v + '" step="1" /></div>';
    }
    o.innerHTML = html;
    console.log('Loaded');
    var pos = document.getElementById('position');
    pos.oninput = function(e) {
        if (loadedsong) {
            player.cancelQueue(audioContext);
            var next = song.duration * pos.value / 100;
            songStart = songStart - (next - currentSongTime);
            currentSongTime = next;
        }
    };
    console.log('Tracks');
    for (var i = 0; i < song.tracks.length; i++) {
        setVolumeAction(i, song);
    }
    console.log('Drums');
    for (var i = 0; i < song.beats.length; i++) {
        setDrVolAction(i, song);
    }
    loadedsong = song;

    // https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/close
    // https://codepen.io/CoolS2/pen/EdPxyz
    // http://grimmdude.com/MidiPlayerJS/

    var startBtn = document.querySelector("#go");
    var susresBtn = document.querySelector("#suspend");
    var stopBtn = document.querySelector("#stop");


    susresBtn.setAttribute('disabled', 'disabled');
    stopBtn.setAttribute('disabled', 'disabled');

    startBtn.onclick = function() {
        startBtn.setAttribute('disabled', 'disabled');
        susresBtn.removeAttribute('disabled');
        stopBtn.removeAttribute('disabled');
        go();

        audioContext.onstatechange = function() {
            console.log(audioContext.state);
        };
    };

    // suspend/resume the audiocontext
    susresBtn.onclick = function() {
        if (audioContext.state === 'running') {
            audioContext.suspend().then(function() {
                susresBtn.innerHTML = '<i class="play icon"></i>' //'RePlay'; 
            });
        } else if (audioContext.state === 'suspended') {
            audioContext.resume().then(function() {
                susresBtn.innerHTML = '<i class="pause icon"></i>';
            });
        }
    }

    // close the audiocontext
    stopBtn.onclick = function() {
	//audioContext.suspend().then(function() {
        audioContext.close().then(function() {
            startBtn.removeAttribute('disabled');
            susresBtn.innerHTML = '<i class="pause icon"></i>';
            susresBtn.setAttribute('disabled', 'disabled');
            stopBtn.setAttribute('disabled', 'disabled');
        });
    };

    // add //


}

function setVolumeAction(i, song) {
    var vlm = document.getElementById('channel' + i);
    vlm.oninput = function(e) {
        player.cancelQueue(audioContext);
        var v = vlm.value / 100;
        if (v < 0.000001) {
            v = 0.000001;
        }
        song.tracks[i].volume = v;
    };
    var sl = document.getElementById('selins' + i);
    sl.onchange = function(e) {
        var nn = sl.value;
        var info = player.loader.instrumentInfo(nn);
        player.loader.startLoad(audioContext, info.url, info.variable);
        player.loader.waitLoad(function() {
            console.log('loaded');
            song.tracks[i].info = info;
            song.tracks[i].id = nn;
        });
    };
}

function setDrVolAction(i, song) {
    var vlm = document.getElementById('drum' + i);
    vlm.oninput = function(e) {
        player.cancelQueue(audioContext);
        var v = vlm.value / 100;
        if (v < 0.000001) {
            v = 0.000001;
        }
        song.beats[i].volume = v;
    };
    var sl = document.getElementById('seldrm' + i);
    sl.onchange = function(e) {
        var nn = sl.value;
        var info = player.loader.drumInfo(nn);
        player.loader.startLoad(audioContext, info.url, info.variable);
        player.loader.waitLoad(function() {
            console.log('loaded');
            song.beats[i].info = info;
            song.beats[i].id = nn;
        });
    };
}


function chooserIns(n, track) {
    var html = '<select style="width: 100%;overflow: hidden;text-overflow: ellipsis" class="ui dropdown" id="selins' + track + '">';
    for (var i = 0; i < player.loader.instrumentKeys().length; i++) {
        var sel = '';
        if (i == n) {
            sel = ' selected';
        }
        html = html + '<option value="' + i + '"' + sel + '>' + i + ': ' + player.loader.instrumentInfo(i).title + '</option>';
    }
    html = html + '</select>';
    return html;
}

function chooserDrum(n, beat) {
    var html = '<select style="width: 100%;overflow: hidden;text-overflow: ellipsis" class="ui dropdown" id="seldrm' + beat + '">';
    for (var i = 0; i < player.loader.drumKeys().length; i++) {
        var sel = '';
        if (i == n) {
            sel = ' selected';
        }
        html = html + '<option value="' + i + '"' + sel + '>' + i + ': ' + player.loader.drumInfo(i).title + '</option>';
    }
    html = html + '</select>';
    return html;
}

function handleFileSelect(event) {
    console.log(event);
    // initialize
    if (audioContext !== null) {
        audioContext.close();
    }

    audioContext = null;
    player = null;
    reverberator = null;
    songStart = 0;
    input = null;
    currentSongTime = 0;
    nextStepTime = 0;
    nextPositionTime = 0;
    loadedsong = null;
    // initialize

    var file = event.target.files[0];
    console.log(file);
    var fileReader = new FileReader();
    fileReader.onload = function(progressEvent) {
        console.log(progressEvent);
        var arrayBuffer = progressEvent.target.result;
        console.log(arrayBuffer);
        var midiFile = new MIDIFile(arrayBuffer);
        var song = midiFile.parseSong();
        startLoad(song);
    };
    fileReader.readAsArrayBuffer(file);
}

function handleExample(path) {
    console.log(path);
    // document.getElementById('filesinput').value='';
    // initialize
    if (audioContext !== null) {
        //alert(audioContext.state);
        audioContext.close();
    }

    audioContext = null;
    player = null;
    reverberator = null;
    songStart = 0;
    input = null;
    currentSongTime = 0;
    nextStepTime = 0;
    nextPositionTime = 0;
    loadedsong = null;
    // initialize

    var xmlHttpRequest = new XMLHttpRequest();

    //https://mnaoumov.wordpress.com/2018/02/05/download-google-drive-file-via-ajax-ignoring-cors/
    // https://drive.google.com/uc?export=download&id=
    //var addUrl = 'https://cors-anywhere.herokuapp.com/';
    //path = addUrl + path;
    // add end
    xmlHttpRequest.open("GET", path, true);
    xmlHttpRequest.responseType = "arraybuffer";
    xmlHttpRequest.onload = function(e) {
        var arrayBuffer = xmlHttpRequest.response;
        var midiFile = new MIDIFile(arrayBuffer);
        var song = midiFile.parseSong();
        startLoad(song);
    };
    xmlHttpRequest.send(null);
}

// MIDI 파일 업로드 용 코드        
// document.getElementById('filesinput').addEventListener('change', handleFileSelect, false);
/****  Midi JS ****/

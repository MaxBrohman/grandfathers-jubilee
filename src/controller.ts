import {
	ARController,
	ARControllerStatic
} from 'jsartoolkit5';

interface VideoInt {
	width: number;
	height: number;
	facingMode: string;
}

interface VideoParams {
	audio: boolean;
	video: VideoInt;
}

export default class Controller {
	private width: number = 640;
	private height: number = 480;
	private video: HTMLVideoElement;
	private videoParams: VideoParams;
	private ar: ARControllerStatic;
    constructor(){
        this.ar = ARController;
        this.video = document.createElement('video');
        this.videoParams = {
            audio: false,
            video: {
                width: this.width,
                height: this.height,
                facingMode: 'environment'
            }
        };
        this.video.style.position = 'absolute';
        this.video.style.top = '0px';
        this.video.style.left = '0px';
        this.video.style.zIndex = '-2';
    }

    getStream(): Promise<MediaStream>{
        return navigator.mediaDevices.getUserMedia(this.videoParams);
    }

    initVideoSource(): Promise<HTMLVideoElement | void>{
        return this.getStream()
            .then(stream => {
                // for devices that needs user interaction to play a video
                this.video.srcObject = stream;
                document.body.addEventListener('click', this.playVideo);

                this.video.addEventListener('loadedmetadata', () => {
                    document.body.appendChild(this.video);
                });

                return this.video;
            })
            .catch(err =>{
                // user denied camera access or webRTC is not supported
                console.warn('Camera access needed', err.message);
            });
    }

    playVideo(): void{
        this.video.play();
        document.body.removeEventListener('click', this.playVideo);
    }

    process(){
        
    }
}

/*
camera.matrixAutoUpdate = false;
			camera.projectionMatrix.fromArray(this.getCameraMatrix());

			scene.add(camera);


process: function() {
					console.log(self.threePatternMarkers);
					for (var i in self.threePatternMarkers) {
						self.threePatternMarkers[i].visible = false;
					}
					for (var i in self.threeBarcodeMarkers) {
						self.threeBarcodeMarkers[i].visible = false;
					}
					for (var i in self.threeMultiMarkers) {
						self.threeMultiMarkers[i].visible = false;
						for (var j=0; j<self.threeMultiMarkers[i].markers.length; j++) {
							if (self.threeMultiMarkers[i].markers[j]) {
								self.threeMultiMarkers[i].markers[j].visible = false;
							}
						}
					}
					self.process(video);
				}

arController.loadMarker('/bin/Data/patt.hiro', function(markerUID) {
				var markerRoot = arController.createThreeMarker(markerUID);
				markerRoot.add(myFancyHiroModel);
				arScene.scene.add(markerRoot);
			});

ARController.prototype.createThreeMarker = function(markerUID, markerWidth) {
			this.setupThree();
			var obj = new THREE.Object3D();
			obj.markerTracker = this.trackPatternMarkerId(markerUID, markerWidth);
			obj.matrixAutoUpdate = false;
			this.threePatternMarkers[markerUID] = obj;
			return obj;
		};

this.addEventListener('getMarker', function(ev) {
				var marker = ev.data.marker;
				var obj;
				if (ev.data.type === artoolkit.PATTERN_MARKER) {
					obj = this.threePatternMarkers[ev.data.marker.idPatt];

				} else if (ev.data.type === artoolkit.BARCODE_MARKER) {
					obj = this.threeBarcodeMarkers[ev.data.marker.idMatrix];

				}
				if (obj) {
					obj.matrix.fromArray(ev.data.matrix);
					obj.visible = true;
				}
			});

            /**
				Index of Three.js pattern markers, maps markerID -> THREE.Object3D.
			*/
			// this.threePatternMarkers = {};
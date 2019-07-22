import { Group, PerspectiveCamera, WebGLRenderer } from 'three';
import { IVideoParams, IARController, IARCameraParams } from './typings/controller';

declare const ARController: IARController;
declare const ARCameraParam: IARCameraParams;

export default class Controller {
	public video: HTMLVideoElement;
	public ar: IARController | undefined;
	private width: number = 640;
	private height: number = 480;
	private videoParams: IVideoParams;
	private cameraParams: IARCameraParams;
	private readonly cameraUrl: string = './camera_para.dat';
    constructor(){
		this.video = document.createElement('video');
		this.cameraParams = new ARCameraParam();
        this.videoParams = {
            audio: false,
            video: {
                width: {
					ideal: this.width
				},
                height: {
					ideal: this.height
				},
                facingMode: 'environment'
            }
		}; 
		this.process = this.process.bind(this);
		this.playVideo = this.playVideo.bind(this);
	}
	
	public init(camera: PerspectiveCamera, renderer: WebGLRenderer): Promise<HTMLVideoElement>{
		return new Promise((resolve) => {
			this.cameraParams.onload = () => {
				this.ar = new ARController(this.width, this.height, this.cameraParams);
				const cameraMatrix = this.ar.getCameraMatrix();
				camera.projectionMatrix.fromArray((cameraMatrix as number[]));
			};
			this.cameraParams.load(this.cameraUrl);
			this.initVideoSource()
			.then(video => {
				this.onResize(camera, renderer);
				window.addEventListener('resize', () => {
					this.onResize(camera, renderer);
				});
				resolve((video as HTMLVideoElement));
			})
			.catch(err => {
				console.warn('error occured', err.message);
			});
		});
	}

	public setMarker(url: string): Promise<Group>{
		return new Promise((resolve) => {
		  	(this.ar as IARController).loadMarker(url, (markerUid: any) => {
				const markerRoot = this.createMarkerRoot(markerUid);
				resolve(markerRoot);
			});
		});
	  }

	public process(video: HTMLVideoElement): void{
		return this.ar!.process(video);
	}

	public onResize(camera: PerspectiveCamera, renderer: WebGLRenderer): void{
		this.onVideoResize();
		// this.copyElementSizeTo(renderer.domElement);
		// this.copyElementSizeTo(this.ar!.canvas);
		this.onWindowResize(camera, renderer);
	}

    private getStream(): Promise<MediaStream>{
        return navigator.mediaDevices.getUserMedia(this.videoParams);
    }

    private initVideoSource(): Promise<HTMLVideoElement | void>{
		return new Promise((resolve) => {
			this.getStream()
            .then(stream => {
                // for devices that needs user interaction to play a video
                this.video.srcObject = stream;
				this.setVideoStyles();
                resolve(this.video);
            })
            .catch(err =>{
                // user denied camera access or webRTC is not supported
                console.warn('Camera access needed', err.message);
            });
		});
    }

    private playVideo(): void{
        this.video.play();
        document.body.removeEventListener('click', this.playVideo);
	}
	
	private setVideoStyles(): void{
		this.video.style.position = 'absolute';
		this.video.style.top = '0px';
		this.video.style.left = '0px';
		this.video.style.zIndex = '-2';
		document.body.addEventListener('click', this.playVideo);
		this.video.setAttribute('autoplay', '');
		this.video.setAttribute('muted', '');
		this.video.setAttribute('playsinline', ''); 
		this.video.addEventListener('loadedmetadata', () => {
			document.body.appendChild(this.video);
			this.onVideoResize();
		});
		this.video.style.width = '640px';
		this.video.style.height = '480px';
	}

	private onWindowResize(camera: PerspectiveCamera, renderer: WebGLRenderer): void{
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
	}
	
	private onVideoResize(): void{
		const screenWidth = window.innerWidth;
		const screenHeight = window.innerHeight;
	
		// compute sourceWidth, sourceHeight
		const sourceWidth = this.video.videoWidth;
		const sourceHeight = this.video.videoHeight;
		
		// compute sourceAspect
		const sourceAspect = sourceWidth / sourceHeight;
		// compute screenAspect
		const screenAspect = screenWidth / screenHeight;
	
		// if screenAspect < sourceAspect, then change the width, else change the height
		if( screenAspect < sourceAspect ){
			// compute newWidth and set .width/.marginLeft
			const newWidth = sourceAspect * screenHeight;
			this.video.style.width = newWidth +'px';
			this.video.style.marginLeft = -(newWidth-screenWidth)/2 + 'px';
			
			// init style.height/.marginTop to normal value
			this.video.style.height = screenHeight + 'px';
			this.video.style.marginTop = '0px';
		}else{
			// compute newHeight and set .height/.marginTop
			const newHeight = 1 / (sourceAspect / screenWidth);
			this.video.style.height = newHeight + 'px';
			this.video.style.marginTop = -(newHeight-screenHeight)/2 + 'px';
			
			// init style.width/.marginLeft to normal value
			this.video.style.width = screenWidth + 'px';
			this.video.style.marginLeft = '0px';
		}
	}

	// private copyElementSizeTo(elem: HTMLElement): void{
	// 	if (window.innerWidth > window.innerHeight) {
	// 		// landscape
	// 		elem.style.width = this.video.style.width;
	// 		elem.style.height = this.video.style.height;
	// 		elem.style.marginLeft = this.video.style.marginLeft;
	// 		elem.style.marginTop = this.video.style.marginTop;
	// 	} else {
	// 		// portrait
	// 		elem.style.height = this.video.style.height;
	// 		elem.style.width =
	// 			(parseInt(elem.style.height!, 10) * 4) / 3 + "px";
	// 		elem.style.marginLeft =
	// 			(window.innerWidth - parseInt(elem.style.width, 10)) / 2 + "px";
	// 		elem.style.marginTop = '0';
	// 	}
	// }

	private createMarkerRoot(markerUid: number): Group{
		const root = new Group();
		this.ar!.threePatternMarkers = {};
		(root as any).markerTracker = this.ar!.trackPatternMarkerId(markerUid);
		(root as any).markerMatrix = new Float64Array(12);
		root.matrixAutoUpdate = false;
		this.ar!.threePatternMarkers[markerUid] = root;
		return root;
	}

}
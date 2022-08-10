import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import interact from 'interactjs'
import React, { useEffect, useState, useCallback, useRef } from 'react';
import domtoimage from 'dom-to-image';
import * as mySvg from 'save-svg-as-png';
import downloadPng from 'svg-crowbar';

export default function Home() {
	const [ imageFile, setImageFile ] = useState('https://tartl-canvas.s3.ap-south-1.amazonaws.com/canvas/688aae6f-c199-4875-a0e0-e31f6f69bc0f');
	const [ isPayblockActive, setIsPayblockActive ] = useState(false);
	const [ sliderValueWidth, setSliderValueWidth ] = useState(10);
	const [ sliderValueHeight, setSliderValueHeight ] = useState(10);
	const myArea = useRef(null);
	const svgWrapperFinal = useRef(null);

	useEffect(() => {
		if (imageFile) {
			getBase64FromUrl();
			// Draggable Functionality
			const position = { x: 0, y: 0 };
			interact('.item').draggable({
			listeners: {
					start (event) {
							console.log(event.type, event.target)
							},
							move (event) {
							position.x += event.dx
							position.y += event.dy
							myArea.current.setAttribute("x", position.x)
							myArea.current.setAttribute("y", position.y)
							event.target.style.transform =
									`translate(${position.x}px, ${position.y}px)`
							},
					}
			})
			// http.get(imageFile, {responseType: "arraybuffer"}).success((data) => {
			// 		console.log('data', data)
			//     // fd.append('file', data);
			// });
			// fetch(imageFile)
			//   .then(res => res.blob()) // Gets the response and returns it as a blob
			//   .then(blob => {
			//     // Here's where you get access to the blob
			//     // And you can use it for whatever you want
			//     // Like calling ref().put(blob)
			//
			//     // Here, I use it to make an image appear on the page
			//     let objectURL = URL.createObjectURL(blob);
			//     let myImage = new Image();
			//     myImage.src = objectURL;
			//     document.getElementById('myImg').appendChild(myImage)
			// });
			// let svgString = new XMLSerializer().serializeToString(document.getElementById('svgWrapperFinal'));
			// let canvas = document.getElementById("canvas");
			// let ctx = canvas.getContext("2d");
			// let DOMURL = self.URL || self.webkitURL || self;
			// let img = new Image();
			// let svg = new Blob([svgString], {type: "image/svg+xml;charset=utf-8"});
			// let url = DOMURL.createObjectURL(svg);
			// img.onload = function() {
			//     ctx.drawImage(img, 0, 0);
			//     let png = canvas.toDataURL("image/png");
			//     document.querySelector('#png-container').innerHTML = '<img src="'+png+'"/>';
			//     DOMURL.revokeObjectURL(png);
			// };
			// img.src = url;
			// var canvas = document.getElementById("canvas"),
			// ctx = canvas.getContext("2d"),
			// image = document.getElementById("svgWrapperFinal");
			// ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

		}
	}, [imageFile]);

	const getBase64FromUrl = async () => {
			const data = await fetch(imageFile);
			const blob = await data.blob();
			return new Promise((resolve) => {
			  const reader = new FileReader();
			  reader.readAsDataURL(blob);
			  reader.onloadend = () => {
				const base64data = reader.result;
				console.log(base64data)
				setImageFile(base64data);
				resolve(base64data);
			  }
			});
	}


	const readURL = () => {
		if (event.target.files && event.target.files[0]) {
			const reader = new FileReader();
			reader.onload = function(e) {
				// setImageFile(e.target.result);
				getBase64FromUrl('https://tartl-canvas.s3.ap-south-1.amazonaws.com/canvas/688aae6f-c199-4875-a0e0-e31f6f69bc0f');
			};
			reader.readAsDataURL(event.target.files[0]);
		}
	}

	const increaseWidth = (event) => {
		setSliderValueWidth(event.target.value);
	}

	const increaseHeight = (event) => {
		setSliderValueHeight(event.target.value);
	}

	const generateSnapshot = () => {
		// const mySvg = document.querySelector('#svgWrapperFinal');
		// const node = document.getElementById('svgWrapperFinal');


		// downloadPng(node, 'my_svg', {downloadPNGOptions:{ scale: 2 }});
		// const options = {
		// 	width: 800,
		// 	height: 450,
		// 	scale: 1,
		// }
		// mySvg.svgAsPngUri(svgWrapperFinal.current, options).then(uri =>
		// 	console.log('test URL', uri)
		// );
		// svg.saveSvgAsPng(document.getElementById("svgWrapperFinal"), "masked_image.png");
		domtoimage.toJpeg(svgWrapperFinal.current, { quality: 1.5 })
		    .then(function (dataUrl) {
		        var link = document.createElement('a');
		        link.download = 'my-image-name.jpeg';
		        link.href = dataUrl;
		        link.click();
		    });
	}

	return (
		<div className={styles.container}>
			<Head>
				<title>Part Blur - Image</title>
				<meta name="description" content="Generated by create next app" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			{/* <div className="resizable">
			  <p> Resize from any edge or corner </p>
			</div> */}
			<main className={styles.main}>
				<h1 className={styles.title}>
					Part Blur - Image
				</h1>
				<h2>
					To blur a part of an image
				</h2>
				{/* <p>Upload an image</p>
				<input type="file" onChange={readURL} /> */}
				<div ref={svgWrapperFinal} >
					{/* <canvas id="canvas" width="500" height="500"></canvas> */}
					<svg id="svgWrapperFinal" x="0px" y="0px" width="500px" height="500px" viewbox="0 0 500 500">
			        <defs>
			          <filter id="blurry" x="0%" y="0%" height="100%" width="100%" primitiveUnits="userSpaceOnUse">
			            <feGaussianBlur x="0" y="0" width="400" height="400" stdDeviation="10" in="SourceGraphic" result="blurSquares"/>
			          </filter>
			        </defs>

			        <clipPath id="myClip">
			            {/* <!--
			              Everything outside the circle will be
			              clipped and therefore invisible.
			            --> */}
			            <rect ref={myArea} id = "area" x="0" y="20" height={sliderValueHeight + 20 } width={sliderValueWidth + 20} />
			          </clipPath>

			        <g id="squares">
			            <image width="100%" height="100%" href={imageFile} />
			        </g>

			          {/* <rect class = "item" x="50" y="50" height="400" width="400" fill="rgba(255,255,255)" fill-opacity="0.5" filter = "url(#blurry)" href = "squares" clipPath = "url(#myClip)"/> */}
			            <g clipPath = "url(#myClip)" className = "item" filter = "url(#blurry)">
			               <image width="100%" height="100%" href={imageFile} />
			            </g>

			          {/* <!-- <use class = "item" clipPath="url(#myClip)" href="#squares" filter = "url(#blurry)" /> --> */}
			      </svg>
				</div>
				<div id="myImg"></div>
				<>
					<div className="slidecontainer">
						<label>Height</label>
						<input onInput={increaseHeight} type="range" min="1" max="100" value={sliderValueHeight} className="slider" id="myRange" />
					</div>
					<div className="slidecontainer">
						<label>Width</label>
						<input onInput={increaseWidth} type="range" min="1" max="100" value={sliderValueWidth} className="slider" id="myRange" />
					</div>
				</>

				{/* {isPayblockActive && <img className={styles.imageStyled} id="img" src={imageFile} alt="your image" />} */}
				{/* {!isPayblockActive &&
					<button className={styles.payblock} onClick={() => setIsPayblockActive(true)}>Add Payblock</button>} */}
				{/* <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 800 450" width="800pt" height="450pt">
              <image
                width="100%"
                height="100%"
                href={imageFile}
              />
              <defs>
            		<mask id="_mask_pB4Ra2I60T86cut51HZ7BCkqZ7LSdYEe">
            			<path d="M 0 0 L 600 0 L 600 450 L 0 450 L 0 0 Z" style="stroke:black;fill:white;stroke-miterlimit:10;" />
            		</mask>
            		<mask id="_mask_BJfMUC3NRUGzvxmaY8oMfw68uFinikyu">
            			<path d="M 0 0 L 600 0 L 600 450 L 0 450 L 0 0 Z" style="stroke:black;fill:white;stroke-miterlimit:10;" />
            		</mask>
            	</defs>

              <g mask="url(#_mask_BJfMUC3NRUGzvxmaY8oMfw68uFinikyu)"><g mask="url(#_mask_pB4Ra2I60T86cut51HZ7BCkqZ7LSdYEe)" /></g>

              <g mask="url(#_mask_pB4Ra2I60T86cut51HZ7BCkqZ7LSdYEe)">
            		<use xlinkHref="#img_iQDqhiJUKqUepKE6W8dFNkNj1zTAUvgy" transform="matrix(0.3,0,0,0.3,0,0)" preserveAspectRatio="none" style="" />
            	</g>

              <rect className={styles.draggable} x="152" y="47" width="372" height="279" transform="matrix(1,0,0,1,0,0)" id="Mask-added" />

              <clipPath id="clipPath">
            		<rect className={styles.draggable} x="152" y="47" width="372" height="279" transform="matrix(1,0,0,1,0,0)" id="Mask-added" />
            	</clipPath>

              <g clipPath="url(#clipPath)">
            		<defs>
            			<filter id="gBlur" x="-200%" y="-200%" width="400%" height="400%" filterUnits="objectBoundingBox" color-interpolation-filters="sRGB">
            				<feGaussianBlur xmlns="http://www.w3.org/2000/svg" stdDeviation="42" />
            			</filter>
            		</defs>

            		<defs>
            			<filter id="imageFilter" x="-200%" y="-200%" width="400%" height="400%" filterUnits="objectBoundingBox" colorInterpolationFilters="sRGB">
            				<feGaussianBlur xmlns="http://www.w3.org/2000/svg" stdDeviation="42" />
            			</filter>
            			<!-- <mask id="maskId">
            				<path d="M 0 0 L 600 0 L 600 450 L 0 450 L 0 0 Z" style="stroke:black;fill:white;stroke-miterlimit:10;" />
            			</mask>
            			<mask id="maskId2">
            				<path d="M 0 0 L 600 0 L 600 450 L 0 450 L 0 0 Z" style="stroke:black;fill:white;stroke-miterlimit:10;" />
            			</mask> -->
            		</defs>

            		<g filter="url(#imageFilter)">
            			<g mask="url(#maskId2)">
            				<g mask="url(#maskId)" />
            			</g>
            		</g>

                <g filter="url(#imageFilter)">
            			<g mask="url(#maskId)">
            				<use xlinkHref="#imageId"
            					transform="matrix(0.3,0,0,0.3,0,0)"
            					preserveAspectRatio="none"
            				/>
            			</g>
            		</g>

            	</g>
            	<defs>
            		<image
            			width="2000"
            			height="1500"
            			href={imageFile}
            			id="imageId"
            		/>
            	</defs>
            </svg> */
				}
					{/* <div id="svgWrapperFinal">
						<svg xmlns="http://www.w3.org/2000/svg" id="finalSvg" viewBox="0 0 800 450">
						<defs>
							<filter id="f1" x="0" y="0">
								<feGaussianBlur in="SourceGraphic" stdDeviation="20" />
							</filter>
						</defs>

						<image className="imageStyled" width="100%" height="100%" href={imageFile} />

						<clipPath id="clipPath">
							<rect className="draggable" x="110" y="10" width="550" height="450" fill="white"/>
						</clipPath>

						<g clipPath="url(#clipPath)">
							<image
								className="imageStyled"
								width="100%"
								height="100%"
								href={imageFile}
								filter="url(#f1)"
							/>
						</g>
					</svg>
					</div> */}
					{imageFile && <button onClick={generateSnapshot}>Save</button>}
			</main>
		</div>
	);
}

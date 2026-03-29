function main() {
	const canvas = document.querySelector('#gl_canvas')
	if (!canvas) {
		alert('Unable to find canvas!')
		return
	}
	if (!(canvas instanceof HTMLCanvasElement)) {
		alert('Canvas is not a HTMLCanvasElement!')
		return
	}

	const gl = canvas.getContext('webgl')
	if (!gl) {
		alert('Unable to initialize WebGL!')
		return
	}

	gl.clearColor(0.0, 0.0, 0.0, 1.0)
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
}

main()

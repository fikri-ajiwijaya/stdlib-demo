import {
	vertex_shader_source,
	fragment_shader_source,
	create_program_info
}
from './shader_source.js'

import {
	create_program_from_source
}
from './shader.js'

import Float32Array from '@stdlib/array/float32'
import Float64Array from '@stdlib/array/float64'
import dgemm from '@stdlib/blas/base/dgemm'

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

	const program = create_program_from_source(gl, [
		{ type : gl.VERTEX_SHADER, code : vertex_shader_source },
		{ type : gl.FRAGMENT_SHADER, code : fragment_shader_source}
	])
	if (!program) {
		return null
	}

	gl.useProgram(program)

	const program_info = create_program_info(gl, program)
	const buffer_position = gl.createBuffer()
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer_position)

	{
		const positions = [
			 1.0,  1.0,
			-1.0,  1.0,
			 1.0, -1.0,
			-1.0, -1.0
		]
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)
		const num_components = 2
		const type = gl.FLOAT
		const normalize = false
		const stride = 0
		const offset = 0
		gl.vertexAttribPointer(program_info.attrib_locations.position, num_components, type, normalize, stride, offset)
	}
	gl.enableVertexAttribArray(program_info.attrib_locations.position)

	const frustum = (() => {
		const aspect = canvas.width / canvas.height
		const r =  aspect
		const l = -aspect
		const t =  1.0
		const b = -1.0
		const n = 0.1
		const f = 10.0
		return new Float64Array([
			2.0*n/(r-l),        0.0,           0.0,  0.0,
			        0.0, 2.0*n/(t-b),          0.0,  0.0,
			(r+l)/(r-l), (t+b)/(t-b),  (f+n)/(n-f), -1.0,
			        0.0,        0.0, 2.0*f*n/(n-f),  0.0
		])
	})()

	const translate = new Float64Array([
		1.0, 0.0,  0.0, 0.0,
		0.0, 1.0,  0.0, 0.0,
		0.0, 0.0,  1.0, 0.0,
		0.0, 0.0, -0.5, 1.0
	])

	const transform = (() => {
		const A = frustum
		const B = translate
		var C = new Float64Array(16)
		dgemm(
			'column-major',
			'no-transpose',
			'no-transpose',
			4, 4, 4,
			1.0, A, 4,
			B, 4, 1.0,
			C, 4
		)
		return C
	})()

	gl.uniformMatrix4fv(program_info.uniform_locations.transform, false, transform)

	gl.enable(gl.DEPTH_TEST)
	gl.depthFunc(gl.LEQUAL)

	gl.clearColor(0.0, 0.0, 0.0, 1.0)
	gl.clearDepth(1.0)

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

	{
		const offset = 0
		const n = 4
		gl.drawArrays(gl.TRIANGLE_STRIP, offset, n)
	}

	return
}

main()

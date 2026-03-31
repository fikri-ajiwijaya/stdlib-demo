import {
	vertex_shader_source,
	fragment_shader_source,
	program_info_t,
	create_program_info
}
from './shader_source.js'

import {
	create_program_from_source
}
from './shader.js'

import {
	create_frustum,
	create_rotate,
	create_translate,
	multiply,
	serialize
}
from './matrix.js'

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

	const slider_yaw = document.querySelector('#yaw')
	const slider_roll = document.querySelector('#roll')
	const slider_pitch = document.querySelector('#pitch')
	if (!slider_yaw || !slider_roll || !slider_pitch) {
		alert('Unable to find sliders!')
		return
	}
	if (
		!(slider_yaw instanceof HTMLInputElement) ||
		!(slider_roll instanceof HTMLInputElement) ||
		!(slider_pitch instanceof HTMLInputElement)
	) {
		alert('Sliders are not HTMLInputElement!')
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
			 1,  1,
			-1,  1,
			 1, -1,
			-1, -1
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

	const aspect = canvas.width / canvas.height
	const frustum = create_frustum(aspect, -aspect, 1, -1, .1, 2)
	const translate = create_translate(0, 0, -1)

	gl.enable(gl.DEPTH_TEST)
	gl.depthFunc(gl.LEQUAL)

	gl.clearColor(0, 0, 0, 1)
	gl.clearDepth(1)

	const rotate_draw = () => {
		const yaw = slider_yaw.valueAsNumber / 180 * Math.PI
		const roll = slider_roll.valueAsNumber / 180 * Math.PI
		const pitch = slider_pitch.valueAsNumber / 180 * Math.PI

		const rotate_yaw = create_rotate('y', yaw)
		const rotate_roll = create_rotate('x', roll)
		const rotate_pitch = create_rotate('z', pitch)

		const transform = multiply(frustum, multiply(translate, multiply(rotate_pitch, multiply(rotate_roll, rotate_yaw))))
		const transform_serialized = serialize(transform, 'column-major')

		draw(gl, program_info, transform_serialized)
	}

	slider_yaw.addEventListener('input', _ => rotate_draw())
	slider_roll.addEventListener('input', _ => rotate_draw())
	slider_pitch.addEventListener('input', _ => rotate_draw())

	rotate_draw()

	return
}

function draw(
	gl : WebGLRenderingContext,
	program_info : program_info_t,
	transform_serialized : Float32Array
) {
	gl.uniformMatrix4fv(program_info.uniform_locations.transform, false, transform_serialized)

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

	const offset = 0
	const n = 4
	gl.drawArrays(gl.TRIANGLE_STRIP, offset, n)
}

main()

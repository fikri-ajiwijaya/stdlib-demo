const vertex_shader_source = `
	attribute vec4 position;
	attribute vec4 color;

	uniform mat4 transform;

	varying lowp vec4 vcolor;

	void main() {
		gl_Position = transform * position;
		vcolor = color;
	}
`

const fragment_shader_source = `
	varying lowp vec4 vcolor;

	void main() {
		gl_FragColor = vcolor;
	}
`

type program_info_t = {
	attrib_locations : {
		position : number,
		color : number
	},
	uniform_locations : {
		transform : WebGLUniformLocation
	}
}

function create_program_info(
	gl : WebGLRenderingContext,
	program : WebGLProgram
)
: program_info_t
{
	return {
		attrib_locations : {
			position : gl.getAttribLocation(program, 'position'),
			color : gl.getAttribLocation(program, 'color')
		},
		uniform_locations : {
			transform : gl.getUniformLocation(program, 'transform')!
		}
	}
}

export {
	vertex_shader_source,
	fragment_shader_source,
	program_info_t,
	create_program_info
}

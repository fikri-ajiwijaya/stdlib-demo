const vertex_shader_source = `
	attribute vec4 position;
	uniform mat4 transform;

	void main() {
		gl_Position = transform * position;
	}
`

const fragment_shader_source = `
	void main() {
		gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
	}
`

function create_program_info(
	gl : WebGLRenderingContext,
	program : WebGLProgram
)
: {
		attrib_locations : {
			position : number
		},
		uniform_locations : {
			transform : WebGLUniformLocation | null
		}
}
{
	return {
		attrib_locations : {
			position : gl.getAttribLocation(program, 'position')
		},
		uniform_locations : {
			transform : gl.getUniformLocation(program, 'transform')
		}
	}
}

export {
	vertex_shader_source,
	fragment_shader_source,
	create_program_info
}

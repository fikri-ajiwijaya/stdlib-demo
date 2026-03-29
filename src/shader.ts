type source_t = {
	type : number,
	code : string
}

function create_shader(
	gl : WebGLRenderingContext,
	source : source_t
)
: WebGLShader | null
{
	const shader = gl.createShader(source.type)
	if (!shader) {
		alert('Unable to create shader!')
		return null
	}

	gl.shaderSource(shader, source.code)

	gl.compileShader(shader)
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		alert('Unable to compile shader!')
		gl.deleteShader(shader)
		return null
	}

	return shader
}

function create_program(
	gl : WebGLRenderingContext,
	shaders : WebGLShader[]
)
: WebGLProgram | null
{
	const program = gl.createProgram()

	for (const shader of shaders)
		gl.attachShader(program, shader)

	gl.linkProgram(program)
	if (!(gl.getProgramParameter(program, gl.LINK_STATUS))) {
		alert('Unable to link program!')
		gl.deleteProgram(program)
		return null
	}

	return program
}

function create_program_from_source(
	gl : WebGLRenderingContext,
	sources : source_t[]
)
: WebGLProgram | null
{
	const shaders = sources.map( source => create_shader(gl, source) )
	if (shaders.includes(null))
		return null
	return create_program(gl, shaders as WebGLShader[])
}

export {
	source_t,
	create_shader,
	create_program,
	create_program_from_source
}

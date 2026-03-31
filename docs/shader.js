function create_shader(gl, source) {
    const shader = gl.createShader(source.type);
    if (!shader) {
        alert('Unable to create shader!');
        return null;
    }
    gl.shaderSource(shader, source.code);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert('Unable to compile shader!');
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}
function create_program(gl, shaders) {
    const program = gl.createProgram();
    for (const shader of shaders)
        gl.attachShader(program, shader);
    gl.linkProgram(program);
    if (!(gl.getProgramParameter(program, gl.LINK_STATUS))) {
        alert('Unable to link program!');
        gl.deleteProgram(program);
        return null;
    }
    return program;
}
function create_program_from_source(gl, sources) {
    const shaders = sources.map(source => create_shader(gl, source));
    if (shaders.includes(null))
        return null;
    return create_program(gl, shaders);
}
export { create_shader, create_program, create_program_from_source };

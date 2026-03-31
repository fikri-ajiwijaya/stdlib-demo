type source_t = {
    type: number;
    code: string;
};
declare function create_shader(gl: WebGLRenderingContext, source: source_t): WebGLShader | null;
declare function create_program(gl: WebGLRenderingContext, shaders: WebGLShader[]): WebGLProgram | null;
declare function create_program_from_source(gl: WebGLRenderingContext, sources: source_t[]): WebGLProgram | null;
export { source_t, create_shader, create_program, create_program_from_source };

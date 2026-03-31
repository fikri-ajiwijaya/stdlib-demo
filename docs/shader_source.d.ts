declare const vertex_shader_source = "\n\tattribute vec4 position;\n\tattribute vec4 color;\n\n\tuniform mat4 transform;\n\n\tvarying lowp vec4 vcolor;\n\n\tvoid main() {\n\t\tgl_Position = transform * position;\n\t\tvcolor = color;\n\t}\n";
declare const fragment_shader_source = "\n\tvarying lowp vec4 vcolor;\n\n\tvoid main() {\n\t\tgl_FragColor = vcolor;\n\t}\n";
type program_info_t = {
    attrib_locations: {
        position: number;
        color: number;
    };
    uniform_locations: {
        transform: WebGLUniformLocation;
    };
};
declare function create_program_info(gl: WebGLRenderingContext, program: WebGLProgram): program_info_t;
export { vertex_shader_source, fragment_shader_source, program_info_t, create_program_info };

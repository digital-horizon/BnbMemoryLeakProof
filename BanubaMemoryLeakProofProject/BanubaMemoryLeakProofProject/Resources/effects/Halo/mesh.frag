#version 300 es

precision highp float;
precision highp sampler2D;

in vec2 var_uv;
layout( location = 0 ) out vec4 frag_color;
uniform sampler2D tex_diffuse;

void main()
{
    vec4 base_opacity = texture(tex_diffuse,var_uv);
    frag_color = base_opacity;

}
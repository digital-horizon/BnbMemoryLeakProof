#version 300 es

precision highp float;

in vec2 var_uv;

layout( location = 0 ) out vec4 F;

uniform sampler2D glfx_BACKGROUND;

void main()
{
	float g = dot( vec3(0.299,0.587,0.114), texture( glfx_BACKGROUND, var_uv ).xyz );
	F = vec4(g,g,g, 1.0);
}

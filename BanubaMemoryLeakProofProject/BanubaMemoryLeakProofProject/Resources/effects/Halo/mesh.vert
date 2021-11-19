#version 300 es

precision mediump sampler2DArray;

layout( location = 0 ) in vec3 attrib_pos;
layout( location = 3 ) in vec2 attrib_uv;
layout( location = 4 ) in uvec4 attrib_bones;

layout(std140) uniform glfx_GLOBAL
{
    mat4 glfx_MVP;
    mat4 glfx_PROJ;
    mat4 glfx_MV;
};
layout(std140) uniform glfx_INSTANCES
{
    vec4 glfx_IDATA[48];
};
uniform uint glfx_CURRENT_I;
#define glfx_T_SPAWN (glfx_IDATA[glfx_CURRENT_I].x)
#define glfx_T_ANIM (glfx_IDATA[glfx_CURRENT_I].y)
#define glfx_ANIMKEY (glfx_IDATA[glfx_CURRENT_I].z)

uniform sampler2D glfx_BONES;

out vec2 var_uv;

mat3x4 get_bone( uint bone_idx, int y )
{
    int b = int(bone_idx)*3;
    mat3x4 m = mat3x4( 
        texelFetch( glfx_BONES, ivec2(b,y), 0 ),
        texelFetch( glfx_BONES, ivec2(b+1,y), 0 ),
        texelFetch( glfx_BONES, ivec2(b+2,y), 0 ) );
    return m;
}

mat3x4 get_transform()
{
    int y = int(glfx_ANIMKEY);
    mat3x4 m = get_bone( attrib_bones[0], y );
    return m;
}

void main()
{
    mat3x4 m = get_transform();
    vec3 vpos = attrib_pos;
    vpos = vec4(vpos,1.)*m;
    gl_Position =  glfx_MVP  * vec4(vpos,1.);
    var_uv = attrib_uv;
}
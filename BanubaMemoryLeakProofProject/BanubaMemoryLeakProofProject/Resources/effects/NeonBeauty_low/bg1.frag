#version 300 es

precision highp float;

in vec2 var_uv;
in vec2 var_bgmask_uv;

layout( location = 0 ) out vec4 F;

uniform sampler2D glfx_BACKGROUND;
uniform sampler2D glfx_BG_MASK;

float filtered_bg_simple( sampler2D mask_tex, vec2 uv )
{
	float bg1 = texture( mask_tex, uv ).x;
	if( bg1 > 0.98 || bg1 < 0.02 )
		return bg1;

	vec2 o = 1./vec2(textureSize(mask_tex,0));
	float bg2 = texture( mask_tex, uv + vec2(o.x,0.) ).x;
	float bg3 = texture( mask_tex, uv - vec2(o.x,0.) ).x;
	float bg4 = texture( mask_tex, uv + vec2(0.,o.y) ).x;
	float bg5 = texture( mask_tex, uv - vec2(0.,o.y) ).x;

	return 0.2*(bg1+bg2+bg3+bg4+bg5);
}

vec4 blur13(sampler2D image, vec2 uv, vec2 resolution, vec2 direction) {
  vec4 color = vec4(0.0);
  vec2 off1 = vec2(1.411764705882353) * direction;
  vec2 off2 = vec2(3.2941176470588234) * direction;
  vec2 off3 = vec2(5.176470588235294) * direction;
  color += texture(image, uv) * 0.1964825501511404;
  color += texture(image, uv + (off1)) * 0.2969069646728344;
  color += texture(image, uv - (off1)) * 0.2969069646728344;
  color += texture(image, uv + (off2)) * 0.09447039785044732;
  color += texture(image, uv - (off2)) * 0.09447039785044732;
  color += texture(image, uv + (off3)) * 0.010381362401148057;
  color += texture(image, uv - (off3)) * 0.010381362401148057;
  return color;
}

vec4 blur( sampler2D tex, int level, vec2 uv )
{
	vec2 o = 1./vec2(textureSize(tex,level));

	// kernel: 0.06136	0.24477	0.38774	0.24477	0.06136
	const float w0 = 0.38774;
	const float w1 = 0.24477;
	const float w2 = 0.06136;

	const float w01 = w0 + w1;
	const float o01 = w0/w01;

	const float w12 = w1 + w2;
	const float o12 = 1.+w1/w12;

	const float w = w0*w0 + 4.*w01*w12;

	const float wa = w0*w0/w;
	const float wb = w01*w12/w;

	vec4 c = wa*textureLod( tex, uv, float(level) )
		+ wb*( textureLod( tex, uv + vec2(o01,o12)*o, float(level) )
			+ textureLod( tex, uv + vec2(o12,-o01)*o, float(level) )
			+ textureLod( tex, uv - vec2(o01,o12)*o, float(level) )
			+ textureLod( tex, uv - vec2(o12,-o01)*o, float(level) ) );

	return c;
}

vec4 cubic(float v){
    vec4 n = vec4(1.0, 2.0, 3.0, 4.0) - v;
    vec4 s = n * n * n;
    float x = s.x;
    float y = s.y - 4.0 * s.x;
    float z = s.z - 4.0 * s.y + 6.0 * s.x;
    float w = 6.0 - x - y - z;
    return vec4(x, y, z, w) * (1.0/6.0);
}

vec4 textureBicubicLod(sampler2D sampler, vec2 texCoords, float lod){

   vec2 texSize = vec2(textureSize(sampler, int(lod)));
   vec2 invTexSize = 1.0 / texSize;
   
   texCoords = texCoords * texSize - 0.5;

   
    vec2 fxy = fract(texCoords);
    texCoords -= fxy;

    vec4 xcubic = cubic(fxy.x);
    vec4 ycubic = cubic(fxy.y);

    vec4 c = texCoords.xxyy + vec2(-0.5, +1.5).xyxy;
    
    vec4 s = vec4(xcubic.xz + xcubic.yw, ycubic.xz + ycubic.yw);
    vec4 offset = c + vec4(xcubic.yw, ycubic.yw) / s;
    
    offset *= invTexSize.xxyy;
    
    vec4 sample0 = textureLod(sampler, offset.xz, lod);
    vec4 sample1 = textureLod(sampler, offset.yz, lod);
    vec4 sample2 = textureLod(sampler, offset.xw, lod);
    vec4 sample3 = textureLod(sampler, offset.yw, lod);

    float sx = s.x / (s.x + s.y);
    float sy = s.z / (s.z + s.w);

    return mix(
       mix(sample3, sample2, sx), mix(sample1, sample0, sx)
    , sy);
}

vec4 blur3(sampler2D tex, vec2 uv, float resolution, float radius, vec2 dir) {
	vec4 sum = vec4(0.0);
	
	//our original texcoord for this fragment
	vec2 tc = uv;
	
	//the amount to blur, i.e. how far off center to sample from 
	//1.0 -> blur by one pixel
	//2.0 -> blur by two pixels, etc.
	float blur = radius/resolution; 
    
	//the direction of our blur
	//(1.0, 0.0) -> x-axis blur
	//(0.0, 1.0) -> y-axis blur
	float hstep = dir.x;
	float vstep = dir.y;
    
	//apply blurring, using a 9-tap filter with predefined gaussian weights
    
	sum += texture(tex, vec2(tc.x - 4.0*blur*hstep, tc.y - 4.0*blur*vstep)) * 0.0162162162;
	sum += texture(tex, vec2(tc.x - 3.0*blur*hstep, tc.y - 3.0*blur*vstep)) * 0.0540540541;
	sum += texture(tex, vec2(tc.x - 2.0*blur*hstep, tc.y - 2.0*blur*vstep)) * 0.1216216216;
	sum += texture(tex, vec2(tc.x - 1.0*blur*hstep, tc.y - 1.0*blur*vstep)) * 0.1945945946;
	
	sum += texture(tex, vec2(tc.x, tc.y)) * 0.2270270270;
	
	sum += texture(tex, vec2(tc.x + 1.0*blur*hstep, tc.y + 1.0*blur*vstep)) * 0.1945945946;
	sum += texture(tex, vec2(tc.x + 2.0*blur*hstep, tc.y + 2.0*blur*vstep)) * 0.1216216216;
	sum += texture(tex, vec2(tc.x + 3.0*blur*hstep, tc.y + 3.0*blur*vstep)) * 0.0540540541;
	sum += texture(tex, vec2(tc.x + 4.0*blur*hstep, tc.y + 4.0*blur*vstep)) * 0.0162162162;

	return sum;
}

in float var_resolution;

void main()
{
	float mask = filtered_bg_simple( glfx_BG_MASK, var_bgmask_uv );
	
	F = mix( texture(glfx_BACKGROUND,var_uv), blur3( glfx_BACKGROUND, var_uv, var_resolution, 4., vec2(1., 0.)), pow(mask,0.25) );
}

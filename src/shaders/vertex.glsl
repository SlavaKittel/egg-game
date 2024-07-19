precision highp float;

uniform vec3 mousePos;
uniform float uTime;
uniform float size;
uniform float scale;

void main() {
  vec3 transformed = vec3( position );
  vec3 seg = position - mousePos;
  vec3 dir = normalize(seg);
  float dist = length(seg);
  if (dist < 2.){
    float force = clamp(1. / (dist * dist), 0., 1.);
    transformed += dir * force;
  }

  vec4 mvPosition = modelViewMatrix * vec4( transformed, 1.0 );
  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = size;
}
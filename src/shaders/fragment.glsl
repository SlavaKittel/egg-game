varying float vPattern;
varying vec3 vNormal;
varying vec3 vPosition;

uniform vec3 uColor;

uniform vec3 lightDirection;
uniform vec3 ambientColor;
uniform float lightIntensity;

void main() {
    vec3 normal = normalize(vNormal);
    vec3 lightDir = normalize(lightDirection);
    vec3 viewDir = normalize(-vPosition); // assuming camera is at (0,0,0)

    // Ambient component
    vec3 ambient = ambientColor * 0.1;

    // Diffuse component
    float diff = max(dot(normal, lightDir), 0.0);
    vec3 diffuse = diff * vec3(1.0, 1.0, 1.0) * lightIntensity; // Red color

    // Combine all components
    vec3 color = ambient + diffuse + (vPattern * uColor) * 0.3;


    // gl_FragColor = vec4(uColor, 1.);
    gl_FragColor = vec4(color, 1.);
}
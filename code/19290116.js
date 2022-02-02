//19290116
//MOHAMMAD SHABIB
var gl;
const numPoints = 5000;
var thetaLoc;
var theta;
var isDirClockwise = false;
var stop = true;
var delay = 50;
var NAME_size = 0;
var colorLocation;
var color = [0.16862745098039217, 1, 0, 1];
var BackgroundColor = [0, 0, 0, 1];
var scalerloc;
var scaler = 1;
var translateloc;
var transalte = [0, 0, 0, 0];
window.onload = function main() {
  const canvas = document.querySelector("#glcanvas");
  // Initialize the GL context
  gl = WebGLUtils.setupWebGL(canvas, {
    transparent: true,
  });
  // Only continue if WebGL is available and working
  if (!gl) {
    alert(
      "Unable to initialize WebGL. Your browser or machine may not support it."
    );
    return;
  }
  var program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);

  gl.enable(gl.BLEND); //to enable transparency (to enable alpha in RGBA)
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  //Rotation Start/Stop Button
  var StartButton = document.getElementById("StartRotationButton");
  StartButton.addEventListener("click", function () {
    stop = !stop;
  });

  //Rotation Direction Button
  var DirectionButton = document.getElementById("DirectionButton");
  DirectionButton.addEventListener("click", function () {
    isDirClockwise = !isDirClockwise;
  });

  //slider, changing speed
  document.getElementById("RotationSpeedSlide").onchange = function () {
    delay = this.value;
  };
  //slider, Scaling
  document.getElementById("ScallingSlide").onchange = function () {
    scaler = this.value;
  };
  //Background Button
  var ColorButton = document.getElementById("BackgroundColor");
  ColorButton.addEventListener("input", (e) => {
    BackgroundColor = e.target.value;
    //console.log(color);
    BackgroundColor = BackgroundColor.slice(1, BackgroundColor.length);
    //CONVERTING HEX TO RGBA SINCE WEBGL ONLY USES RGBA
    var aRgbHex = BackgroundColor.match(/.{1,2}/g);
    BackgroundColor = [
      parseInt(aRgbHex[0], 16) / 255,
      parseInt(aRgbHex[1], 16) / 255,
      parseInt(aRgbHex[2], 16) / 255,
    ];
    BackgroundColor.push(1);
    console.log(BackgroundColor);
  });

  //Color Button
  var ColorButton = document.getElementById("fontColor");
  ColorButton.addEventListener("input", (e) => {
    color = e.target.value;
    //console.log(color);
    color = color.slice(1, color.length);
    //CONVERTING HEX TO RGBA SINCE WEBGL ONLY USES RGBA
    var aRgbHex = color.match(/.{1,2}/g);
    color = [
      parseInt(aRgbHex[0], 16) / 255,
      parseInt(aRgbHex[1], 16) / 255,
      parseInt(aRgbHex[2], 16) / 255,
    ];
    color.push(1);
    console.log(color);
  });

  //slider, Color Transparency
  document.getElementById("transparencySlide").onchange = function () {
    color[3] = parseFloat(this.value);
    console.log(color);
  };

  //translate
  var DirectionButton = document.getElementById("Right");
  DirectionButton.addEventListener("click", function () {
    translate[0] += 0.05;
  });
  var DirectionButton = document.getElementById("left");
  DirectionButton.addEventListener("click", function () {
    translate[0] -= 0.05;
  });
  var DirectionButton = document.getElementById("Up");
  DirectionButton.addEventListener("click", function () {
    translate[1] += 0.05;
  });
  var DirectionButton = document.getElementById("Down");
  DirectionButton.addEventListener("click", function () {
    translate[1] -= 0.05;
  });

  //Keyboard

  window.addEventListener("keydown", function () {
    switch (event.keyCode) {
      case 37: //arrow left
      case 65: // 'A'
        translate[0] -= 0.05;
        break;
      case 38: //arrow up
      case 87: // 'W'
        translate[1] += 0.05;
        break;
      case 39: //arrow right
      case 68: //'D'
        translate[0] += 0.05;
        break;
      case 40: //arrow down
      case 83: // 'S'
        translate[1] -= 0.05;
        break;
      case 32: // space
        stop = !stop;
        break;
      case 13: // ENTER
        isDirClockwise = !isDirClockwise;
        break;
      case 71: //'G'
        color = [0, 1, 0, 1];
        break;
      case 82: //'R'
        color = [1, 0, 0, 1];
        break;
      case 187: //'+'
        scaler += 0.01;
        break;
      case 189: //'-'
        scaler -= 0.01;
        break;
    }
  });

  //letters
  var l1_distance = 0.5;
  var l1_width = [-0.7, -0.65];
  //0,1 index for horizontal width, index 2 for vertical width
  var l2_width = [0, 0.6, 0.05];
  var l2_upperB = [0.1, 10];

  //index 0 for horizontal height
  var l2_height = [0.05];

  var floor = -0.5;
  var top = 0.4;
  var NAME = [
    //L1
    vec2(l1_width[0], floor),
    vec2(l1_width[1], floor),
    vec2(l1_width[1], top),
    vec2(l1_width[0], top),
    vec2(l1_width[1], top),
    vec2(l1_width[0], floor),
    //
    vec2(l1_width[0], top),
    vec2(l1_width[1], top),
    vec2(l1_width[1] + l1_distance / 2, floor),

    vec2(l1_width[0] + l1_distance / 2, floor),
    vec2(l1_width[1] + l1_distance / 2, floor),
    vec2(l1_width[0], top),
    //
    vec2(l1_width[0] + l1_distance, top),
    vec2(l1_width[1] + l1_distance, top),
    vec2(l1_width[1] + l1_distance / 2, floor),
    vec2(l1_width[0] + l1_distance / 2, floor),
    vec2(l1_width[1] + l1_distance / 2, floor),
    vec2(l1_width[0] + l1_distance, top),

    //
    vec2(l1_width[0] + l1_distance, floor),
    vec2(l1_width[1] + l1_distance, floor),
    vec2(l1_width[1] + l1_distance, top),
    vec2(l1_width[0] + l1_distance, top),
    vec2(l1_width[1] + l1_distance, top),
    vec2(l1_width[0] + l1_distance, floor),

    // L2

    vec2(l2_width[0], top),
    vec2(l2_width[0], top - l2_height[0]),
    vec2(l2_width[1] - l2_upperB[0], top),
    vec2(l2_width[1] - l2_upperB[0], top),
    vec2(l2_width[1] - l2_upperB[0], top - l2_height[0]),
    vec2(l2_width[0], top - l2_height[0]),
    //

    vec2(l2_width[0], top),
    vec2(l2_width[0] + l2_width[2], top),
    vec2(l2_width[0], floor),
    vec2(l2_width[0], floor),
    vec2(l2_width[0] + l2_width[2], floor),
    vec2(l2_width[0] + l2_width[2], top),

    //

    vec2(l2_width[1] - l2_width[2] - l2_upperB[0], top),
    vec2(l2_width[1] + l2_width[2] - l2_upperB[0] - l2_width[2], top),
    vec2(l2_width[1] - l2_width[2] - l2_upperB[0], floor / l2_upperB[1]),

    vec2(l2_width[1] - l2_width[2] - l2_upperB[0], floor / l2_upperB[1]),
    vec2(
      l2_width[1] - l2_width[2] + l2_width[2] - l2_upperB[0],
      floor / l2_upperB[1]
    ),
    vec2(l2_width[1] - l2_width[2] + l2_width[2] - l2_upperB[0], top),

    //
    vec2(l2_width[0], floor / l2_upperB[1]),
    vec2(l2_width[0], floor / l2_upperB[1] - l2_height[0]),
    vec2(l2_width[1], floor / l2_upperB[1]),
    vec2(l2_width[1], floor / l2_upperB[1]),
    vec2(l2_width[1], floor / l2_upperB[1] - l2_height[0]),
    vec2(l2_width[0], floor / l2_upperB[1] - l2_height[0]),

    //
    vec2(l2_width[1] - l2_width[2], floor),
    vec2(l2_width[1] + l2_width[2] - l2_width[2], floor),
    vec2(l2_width[1] - l2_width[2], floor / l2_upperB[1]),
    vec2(l2_width[1] - l2_width[2], floor / l2_upperB[1]),
    vec2(l2_width[1] - l2_width[2] + l2_width[2], floor / l2_upperB[1]),
    vec2(l2_width[1] - l2_width[2] + l2_width[2], floor),
    //
    vec2(l2_width[0], floor),
    vec2(l2_width[0], floor + l2_height[0]),
    vec2(l2_width[1], floor),
    vec2(l2_width[1], floor),
    vec2(l2_width[1], floor + l2_height[0]),
    vec2(l2_width[0], floor + l2_height[0]),
  ];

  NAME_size = NAME.length;

  var bufferId = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(NAME), gl.STATIC_DRAW);

  // Associate our shader variables with our data buffer
  var vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  //CONNECTING THETA WITH THE SHADER
  thetaLoc = gl.getUniformLocation(program, "theta");
  theta = 0;
  gl.uniform1f(thetaLoc, theta);

  //CONNECTING SCALLING  WITH THE SHADER
  scalerloc = gl.getUniformLocation(program, "scaler");
  scaler = 1;
  gl.uniform1f(scalerloc, scaler);

  //CONNECTING COLOR  WITH THE SHADER
  colorLocation = gl.getUniformLocation(program, "u_color");
  gl.uniform4fv(colorLocation, color);

  //CONNECTING Translate  WITH THE SHADER
  translateloc = gl.getUniformLocation(program, "translate");
  translate = [0, 0, 0, 0];
  gl.uniform4f(
    translateloc,
    translate[0],
    translate[1],
    translate[2],
    translate[3]
  );

  render();
};

function render() {
  setTimeout(function () {
    gl.clearColor(
      BackgroundColor[0],
      BackgroundColor[1],
      BackgroundColor[2],
      BackgroundColor[3]
    );
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform4fv(colorLocation, color); // letter color
    if (!stop) theta += isDirClockwise ? -0.1 : 0.1; //rotation direction
    gl.uniform1f(thetaLoc, theta); //rotation
    gl.uniform1f(scalerloc, scaler); //scalloing
    gl.uniform4f(
      //translating
      translateloc,
      translate[0],
      translate[1],
      translate[2],
      translate[3]
    );
    gl.drawArrays(gl.TRIANGLES, 0, NAME_size); //drawing the letters
    requestAnimFrame(render);
  }, delay);
}

// variables to play around with
let period = 1;
let speed = 6;
let mod_deg = 16; // modulation degree

let samples = [];
let constellation_points = [];
let time = 0;
let scale = 45;
let sample_start_x;
let curr_constellation_point, indicator, anchor;

function setup() {
  createCanvas(windowWidth, windowHeight);
  stroke(255); textAlign(CENTER);
  anchor = createVector(width / 4, height / 2);

  sample_start_x = width / 2 - anchor.x; // pow(mod_deg/2, 2)*2 + 100;
  time = period - 0.0001; // hacky workaround, otherwise the samples == 0 until first reset (line 31). No idea why ¯\_(ツ)_/¯

  generateConstellationPoints();
  chooseConstellationPoint();
}

function draw() {
  background(0);
  translate(anchor.x, anchor.y);

  time += deltaTime / 1000;
  
  if (time >= period) { // reset
    time %= period;
    curr_constellation_point.is_selected = false;
    chooseConstellationPoint();
  }
  
  indicator.rotate(TWO_PI / frameRate() / period);
  
  // show constellation points
  noStroke(); fill(255);
  constellation_points.forEach(c_point => {
    c_point.show();
  });

  stroke(255, 64); strokeWeight(1); // horizontal
  line(indicator.x, indicator.y, sample_start_x, indicator.y);

  // create new sample
  samples.push(new SignalSample(sample_start_x, indicator.y, speed));

  stroke(255); strokeWeight(2); // radial
  line(0, 0, indicator.x, indicator.y);
  handleSamples();
}


function generateConstellationPoints()
{
  const OFFSET = 0.5 - (mod_deg >> 1);
  const MAX_BITS = Math.log2(mod_deg*mod_deg);
  for (let i = 0; i < mod_deg*mod_deg; i++)
  {
    const x = i % mod_deg + OFFSET;
    const y = floor(i / mod_deg) + OFFSET;

    let data = i.toString(2);
    data = "0".repeat(MAX_BITS - data.length) + data;

    constellation_points.push(new ConstellationPoint(x, y, data, scale));
  }
}

function chooseConstellationPoint()
{
  curr_constellation_point = random(constellation_points);
  curr_constellation_point.is_selected = true;
  const x = curr_constellation_point.pos.x;
  const y = curr_constellation_point.pos.y;
  indicator = createVector(x, y);
}

function handleSamples()
{
    for (let i = 0; i < samples.length; i++) {
        const sample = samples[i];
        sample.update();
        sample.show();

        if (sample.pos.x > width + speed) {
            samples.splice(i, 1);
        }
    }

    stroke(255); strokeWeight(3);
    for (let i = 1; i < samples.length; i++) {
        const prev_sample = samples[i-1];
        const sample = samples[i];

        line(sample.pos.x, sample.pos.y, prev_sample.pos.x, prev_sample.pos.y);
    }
}

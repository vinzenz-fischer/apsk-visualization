// variables to play around with
let period = 1;
let speed = 3;
let mod_deg = 4; // modulation degree
let speed_slider;

let samples = [];
let constellation_points = [];
let symbol_labels = [];
let reset = false;
let has_bg = true;
let time = period - 0.0001; // hacky workaround, otherwise the samples == 0 until first reset. No idea why ¯\_(ツ)_/¯;
let scale = 100;
let sample_start_x;
let curr_sample, curr_label, curr_constell_point
let indicator, anchor;

function setup() {
  createCanvas(windowWidth, windowHeight);
  stroke(255); textAlign(CENTER);
  anchor = createVector(width / 4, height / 2);
  sample_start_x = width / 2 - anchor.x;

  speed_slider = new Slider("Speed", 0.25, 3, 1, 0.25, "x", 50, height - 50);

  generateConstellationPoints();
  chooseConstellationPoint();
}

function draw() {
  background(0);
  push();
  translate(anchor.x, anchor.y);

  if (speed_slider.valueChanged()) {
    period = 1 / speed_slider.slider.value();
    speed  = 3 * speed_slider.slider.value();
  }

  time += deltaTime / 1000;
  reset = time >= period;
  if (reset) {
    time -= period;
    has_bg = !has_bg;
    curr_constell_point.is_selected = false;
    chooseConstellationPoint();
  }
  
  indicator.rotate(TWO_PI / frameRate() / period);
  
  // show constellation points
  noStroke(); fill(255);
  constellation_points.forEach(c_point => {
    c_point.show();
  });

  stroke(255, 128); strokeWeight(1); // horizontal line
  line(indicator.x, indicator.y, sample_start_x, indicator.y);

  // create new sample
  curr_sample = new SignalSample(sample_start_x, indicator.y)
  samples.push(curr_sample);

  // if sample is part of a new symbol, create a label
  if (reset) {
    curr_label = new SymbolLabel(curr_sample, curr_constell_point.data, has_bg)
    symbol_labels.push(curr_label);
  }

  try {
    curr_label.end_sample = curr_sample;
  } catch { }

  stroke(255); strokeWeight(2);
  line(0, 0, indicator.x, indicator.y); // turning line
  handleSymbols();

  pop();
  // UI related stuff; canvas-space coords
  noStroke(); fill(255); textSize(32);
  text("Amplitude & phase-shift keying", width>>1, 48);
  textSize(13);

  speed_slider.show();
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
  curr_constell_point = random(constellation_points);
  curr_constell_point.is_selected = true;
  const x = curr_constell_point.pos.x;
  const y = curr_constell_point.pos.y;
  indicator = createVector(x, y);
}

function handleSymbols()
{
    for (let i = 0; i < samples.length; i++) {
        const sample = samples[i];
        sample.update(speed);

        if (sample.pos.x > width + speed) {
            samples.splice(i, 1);
        }
    }

    const smd = scale * mod_deg;
    noStroke();
    for (let i = 0; i < symbol_labels.length; i++) {
      const symbol_label = symbol_labels[i];
      symbol_label.show(smd);
    }

    for (let i = 0; i < symbol_labels.length; i++) {
      if (symbol_labels[i].start_sample.pos.x > width + speed) {
        symbol_labels.splice(i, 1);
      }
    }

    stroke(255); strokeWeight(3);
    for (let i = 1; i < samples.length; i++) {
        const prev_sample = samples[i-1];
        const sample = samples[i];

        line(sample.pos.x, sample.pos.y, prev_sample.pos.x, prev_sample.pos.y);
    }
}

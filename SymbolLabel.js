class SymbolLabel
{
    constructor(start_sample, data, has_bg) {
        this.start_sample = start_sample;
        this.end_sample = start_sample;
        this.data = data;
        this.has_bg = has_bg;
    }

    show(scaled_mod_deg) {
        const avg_x = (this.start_sample.pos.x + this.end_sample.pos.x) >> 1;
        
        if (this.has_bg) {
            let w = abs(this.start_sample.pos.x - this.end_sample.pos.x);
            fill(128, 64); noStroke();
            rect(this.end_sample.pos.x, -height>>1, w, height);
        }

        fill(255);
        text(this.data, avg_x, scaled_mod_deg);
    }
}

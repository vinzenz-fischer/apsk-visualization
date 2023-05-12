class ConstellationPoint
{
    constructor(x, y, data, scale) {
        this.pos = createVector(x * scale, y * scale);
        this.data = data;
        this.is_selected = false;
    }

    show() {
        noStroke();
        fill(this.is_selected ? 255 : 80);
        circle(this.pos.x, this.pos.y, 8);

        text(this.data, this.pos.x, this.pos.y + 20);
        // if (this.is_selected) {
        //     text(this.data, this.pos.x, this.pos.y + 20);
        // }
    }
}

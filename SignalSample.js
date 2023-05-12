class SignalSample
{
    constructor(x, y, speed) {
        this.pos = createVector(x, y);
        this.speed = speed;
    }

    update() {
        this.pos.x += this.speed;
    }

    show() {
        point(this.pos.x, this.pos.y);
    }
}

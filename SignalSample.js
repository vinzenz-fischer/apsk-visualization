class SignalSample
{
    constructor(x, y) {
        this.pos = createVector(x, y);
    }

    update(speed) {
        this.pos.x += speed;
    }

    show() {
        point(this.pos.x, this.pos.y);
    }
}

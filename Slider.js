class Slider
{
    constructor(name, min, max, def = 1, step = 1, unit = "x", x = width/2, y = height/2) {
        this.slider = createSlider(min, max, def, step);
        this.slider.size(200, 20);
        this.slider.position(x, y);
        this.name = name;
        this.unit = unit;
        this.old_value = this.slider.value();
    }

    valueChanged() {
        const current_value = this.slider.value();
        const changed = current_value != this.old_value;
        this.old_value = current_value;
        return changed;
    }

    show(displayValue = this.slider.value()) {
        text(`${this.name} ${displayValue}${this.unit}`, this.slider.x + 100, this.slider.y - 10);
    }
}
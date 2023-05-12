class SymbolLabel
{
    constructor(start_sample, data) {
        this.start_sample = start_sample;
        this.data = data;
    }

    show() {
        text(this.data, this.start_sample.x, scale+20);
    }
}
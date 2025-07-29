export class Formatter {
  reversible: boolean;
  constructor() {
    this.reversible = true;
    this.format = this.format.bind(this);
    this.parse = this.parse.bind(this);
  }

  format(value, pattern?) {
    return value;
  }

  parse(value, pattern?) {
    return value;
  }
}

export const noopFormatter = new Formatter();

export default Formatter;

class Ul {
constructor(listStyleType, margin, padding, overflow, backgroundColor) {

this.listStyleType = 'none';
this.margin = 0;
this.padding = 0;
this.overflow = 'hidden';
this.backgroundColor = '#333';
 }
}

class Li {
  constructor(float) {
    this.float = 'left';
  }
}

class Link {
  constructor(display, color, textAlign, padding, textDecoration) {
    this.display = 'block';
    this.color = 'white';
    this.textAlign = 'center';
    this.padding = '14px 16px';
    this.textDecoration = 'none';
  }
}
let ul = new Ul();
let link = new Link();
let li = new Li();

export { ul };
export { li };
export { link };

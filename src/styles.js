class Ul {
connstructor(listStyleType, margin, padding, overflow, backroundColor) {

this.listStyleType = 'none';
this.margin = '0';
this.padding = '0';
this.overflow = 'hidden';
this.backroundColor = '#333';
 }
}

class Li {
  connstructor(float) {
    this.float = 'left';
  }
}

class Link {
  connstructor(display, color, textAlign, padding, textDecoration) {
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

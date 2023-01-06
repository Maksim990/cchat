var g = 0.1;
var vg = 0;

this.loops.push(() => {

    const cv = this.gameobject.renderCanvas;
    const transf = this.gameobject.transform;
    cv.push();
    cv.noFill();
    cv.stroke(255, 0, 0);
    cv.strokeWeight(1);
    cv.rect(transf.position.x, transf.position.y, transf.size.width, transf.size.height);
    cv.pop();

    vg += g;
    transf.position.y += vg;

});
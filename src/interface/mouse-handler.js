import {degToRad, glContext} from "../common/common";

export class MouseHandler {
    constructor(camera) {
        this.lastX = glContext.viewportWidth / 2;
        this.lastY = glContext.viewportHeight / 2;
        this.camera = camera;
    }

    handleEvent(event) {
        // transforms the view matrix
        let x = event.clientX;
        let y = event.clientY;

        let deltaX = -(x - this.lastX);
        let deltaY = -(y - this.lastY);

        this.lastX = x;
        this.lastY = y;

        this.camera.rotate(degToRad(deltaX / 10), [0, 1, 0]);
        this.camera.rotate(degToRad(deltaY / 10), [1, 0, 0]);
    }
}
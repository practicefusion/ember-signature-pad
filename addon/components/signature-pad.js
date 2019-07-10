import { isPresent } from '@ember/utils';
import { A } from '@ember/array';
import { computed, observer } from '@ember/object';
import Component from '@ember/component';

export default Component.extend({
    color: '#0000ff', // blue
    weight: 1,
    height: 68,
    width: 386,
    // collection of penstrokes to submit
    value: computed(function () {
        return A();
    }),

    canvasContext: null,
    canvasElement: null,

    penstate: false,  // is the pen down?
    pos: null,   // {x: int, y: int} last pen position

    newStroke: 1,
    continueStroke: 0,

    tagName: '',

    registerCanvasElement(element) {
      this.canvasElement = element;
      this.canvasContext = element.getContext('2d');
    },

    onPenStyleChange: observer('color', 'weight', function () {
        this.canvasContext.strokeStyle = this.get('color');
        this.canvasContext.lineWidth = this.get('weight');
    }),

    savePenStroke(isNewStroke) {
        let value = this.get('value'),
            penStroke = [isNewStroke, this.get('pos').x, this.get('pos').y];
        if (isNewStroke) {
            penStroke.push(this.get('color'), this.get('weight'));
        }
        value.pushObject(penStroke);
    },

    penDown(event) {
        this.set('penstate', true);
        this.set('pos', this.newEvent(event).penPosition());
        this.canvasContext.strokeStyle = this.get('color');
        this.canvasContext.lineWidth = this.get('weight');
        this.canvasContext.beginPath();
        this.canvasContext.moveTo(this.pos.x, this.pos.y);
        this.savePenStroke(this.get('newStroke'));
        return false; // return false to prevent IE selecting the image
    },

    penMove(event) {
        var newPos = this.newEvent(event).penPosition();
        if (this.get('penstate')) {
            this.set('pos', newPos);
            this.canvasContext.lineTo(newPos.x, newPos.y);
            this.canvasContext.stroke();
            this.savePenStroke(this.get('continueStroke'));
        } else {
            this.canvasContext.moveTo(newPos.x, newPos.y);
        }
        return false;
    },

    penUp() {
        this.set('penstate', false);
        return false;
    },

    newEvent(event) {
        var signaturePad = this.canvasElement;

        return {
            crossPlatform: function () {
                // mobile safari
                if (event.originalEvent && event.originalEvent.touches) {
                    return event.originalEvent.touches[0];
                }
                return event;
            }(),
            penPosition: function () {
                let rect = signaturePad.getBoundingClientRect();
                let offset = {
                  top: rect.top + document.body.scrollTop,
                  left: rect.left + document.body.scrollLeft
                };
                let x = this.crossPlatform.pageX - offset.left;
                let y = this.crossPlatform.pageY - offset.top;

                return { x, y };
            }
        };
    },

    draw() {
        if (isPresent(this.get('value'))) {
            this.get('value').forEach((point) => {
                if (point[0] === 1) {
                    this.canvasContext.strokeStyle = point[3];
                    this.canvasContext.lineWidth = point[4];
                    this.canvasContext.beginPath();
                    this.canvasContext.moveTo(point[1], point[2]);
                } else {
                    this.canvasContext.lineTo(point[1], point[2]);
                    this.canvasContext.stroke();
                }
            });
        }
    },

    valueObserver: observer('value', function () {
        if (this.canvasContext) {
            this.canvasContext.clearRect(0, 0, this.get('width'), this.get('height'));
            this.draw();
        }
    }),
});

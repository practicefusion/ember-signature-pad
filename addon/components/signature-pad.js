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

    canvasSelector: 'canvas',
    classNames: ['signature-pad'],
    penstate: false,  // is the pen down?
    pos: null,   // {x: int, y: int} last pen position

    newStroke: 1,
    continueStroke: 0,

    canvasContext: computed('canvasSelector', function () {
        if (this.element) {
            var canvasSelector = this.get('canvasSelector'),
                signaturePad = this.element.querySelector(canvasSelector);
            return signaturePad.getContext('2d');
        } else {
            return null;
        }
    }),

    didInsertElement() {
        this.get('canvasContext').strokeStyle = this.get('color');
        this.get('canvasContext').lineWidth = this.get('weight');

        this.draw();
    },

    onPenStyleChange: observer('color', 'weight', function () {
        this.get('canvasContext').strokeStyle = this.get('color');
        this.get('canvasContext').lineWidth = this.get('weight');
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
        this.get('canvasContext').strokeStyle = this.get('color');
        this.get('canvasContext').lineWidth = this.get('weight');
        this.get('canvasContext').beginPath();
        this.get('canvasContext').moveTo(this.pos.x, this.pos.y);
        this.savePenStroke(this.get('newStroke'));
        return false; // return false to prevent IE selecting the image
    },

    penMove(event) {
        var newPos = this.newEvent(event).penPosition();
        if (this.get('penstate')) {
            this.set('pos', newPos);
            this.get('canvasContext').lineTo(newPos.x, newPos.y);
            this.get('canvasContext').stroke();
            this.savePenStroke(this.get('continueStroke'));
        } else {
            this.get('canvasContext').moveTo(newPos.x, newPos.y);
        }
        return false;
    },

    penUp() {
        this.set('penstate', false);
        return false;
    },

    newEvent(event) {
        var signaturePad = this.element.querySelector('canvas');

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
                    this.get('canvasContext').strokeStyle = point[3];
                    this.get('canvasContext').lineWidth = point[4];
                    this.get('canvasContext').beginPath();
                    this.get('canvasContext').moveTo(point[1], point[2]);
                } else {
                    this.get('canvasContext').lineTo(point[1], point[2]);
                    this.get('canvasContext').stroke();
                }
            });
        }
    },

    valueObserver: observer('value', function () {
        if (this.element) {
            this.get('canvasContext').clearRect(0, 0, this.get('width'), this.get('height'));
            this.draw();
        }
    }),
});

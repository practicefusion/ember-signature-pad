import Ember from 'ember';

export default Ember.Component.extend({
    color: '#0000ff', // blue
    weight: 1,
    height: 68,
    width: 386,
    // collection of penstrokes to submit
    value: Ember.computed(function () {
        return Ember.A();
    }),

    canvasSelector: 'canvas',
    classNames: ['signature-pad'],
    penstate: false,  // is the pen down?
    pos: null,   // {x: int, y: int} last pen position

    newStroke: 1,
    continueStroke: 0,

    canvasContext: Ember.computed('canvasSelector', function () {
        if (this.$()) {
            var canvasSelector = this.get('canvasSelector'),
                signaturePad = this.$(canvasSelector).get(0);
            return signaturePad.getContext('2d');
        } else {
            return null;
        }
    }),

    onDidInsertElement: Ember.on('didInsertElement', function () {
        this.get('canvasContext').strokeStyle = this.get('color');
        this.get('canvasContext').lineWidth = this.get('weight');
        // add events
        this.$().on('mousedown touchstart', this.penDown.bind(this));
        this.$().on('mousemove touchmove', this.penMove.bind(this));
        this.$().on('mouseup touchend', this.penUp.bind(this));

        this.draw();
    }),

    onPenStyleChange: Ember.observer('color', 'weight', function () {
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
        var signaturePad = this.$('canvas');

        return {
            crossPlatform: function () {
                // mobile safari
                if (event.originalEvent && event.originalEvent.touches) {
                    return event.originalEvent.touches[0];
                }
                return event;
            }(),
            penPosition: function () {
                var offset = signaturePad.offset(),
                    x = this.crossPlatform.pageX - offset.left,
                    y = this.crossPlatform.pageY - offset.top;

                return {
                    x: x,
                    y: y
                };
            }
        };
    },

    draw() {
        if (Ember.isPresent(this.get('value'))) {
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

    valueObserver: Ember.observer('value', function () {
        if (this.$()) {
            this.get('canvasContext').clearRect(0, 0, this.get('width'), this.get('height'));
            this.draw();
        }
    }),

    onWillDestroyElement: Ember.on('willDestroyElement', function () {
        // remove events
        this.$().off();
    })
});

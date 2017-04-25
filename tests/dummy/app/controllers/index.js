import Ember from 'ember';

export default Ember.Controller.extend({
    color: '#0000ff',
    height: 68,
    weight: 1,
    width: 386,
    signature: Ember.computed(function () {
        return Ember.A();
    }),
    stringifiedSignature: Ember.computed('signature.[]', function() {
        return JSON.stringify(this.get('signature'));
    }),
    actions: {
        reset() {
            this.set('signature', Ember.A());
        },
        undo() {
            let lastNewLine;
            this.get('signature').forEach((item, index) => {
                if (item[0] === 1) {
                    lastNewLine = index;
                }
            });
            this.set('signature', Ember.A(this.get('signature').slice(0, lastNewLine)));
        }
    }
});

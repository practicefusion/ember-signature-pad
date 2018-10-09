import { A } from '@ember/array';
import { computed } from '@ember/object';
import Controller from '@ember/controller';

export default Controller.extend({
    color: '#0000ff',
    height: 68,
    weight: 1,
    width: 386,
    signature: computed(function () {
        return A();
    }),
    stringifiedSignature: computed('signature.[]', function() {
        return JSON.stringify(this.get('signature'));
    }),
    actions: {
        reset() {
            this.set('signature', A());
        },
        undo() {
            let lastNewLine;
            this.get('signature').forEach((item, index) => {
                if (item[0] === 1) {
                    lastNewLine = index;
                }
            });
            this.set('signature', A(this.get('signature').slice(0, lastNewLine)));
        }
    }
});

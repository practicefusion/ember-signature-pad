# ember-signature-pad

This is an ember-cli addon component that allows for users to draw their own signature in a canvas element.


Compatibility
------------------------------------------------------------------------------

* Ember.js v2.18 or above
* Ember CLI v2.13 or above
* Node.js v8 or above


Installation
------------------------------------------------------------------------------

```
ember install ember-signature-pad
```


Usage
------------------------------------------------------------------------------

```javascript
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

```

```handlebars
{{signature-pad
    color=color
    weight=weight
    value=signature
    height=height
    width=width
}}
{{input type="color" value=color}}
{{input type="number" value=weight}}
<button {{action "reset"}}>Reset</button>
<button {{action "undo"}}>Undo</button>
<div><code>{{stringifiedSignature}}</code></div>
```

Contributing
------------------------------------------------------------------------------

See the [Contributing](CONTRIBUTING.md) guide for details.


License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).

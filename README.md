# ember-signature-pad

This is an ember-cli addon component that allows for users to draw their own signature in a canvas element.

## Installation

* `git clone` this repository
* `npm install`
* `bower install`

## Running

* `ember server`
* Visit your app at http://localhost:4200.
* Demo the app at [https://ember-signature-pad.firebaseapp.com/](https://ember-signature-pad.firebaseapp.com/)

## Running Tests

* `ember test`
* `ember test --server`

## Building

* `ember build`

## Usage

```javascript
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

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).

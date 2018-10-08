# ember-signature-pad

This is an ember-cli addon component that allows for users to draw their own signature in a canvas element.

Installation
------------------------------------------------------------------------------

```
ember install my-addon
```


Usage
------------------------------------------------------------------------------

[Longer description of how to use the addon in apps.]


Contributing
------------------------------------------------------------------------------

### Installation

* `git clone https://github.com/practicefusion/ember-signature-pad.git`
* `cd my-addon`
* `npm install`

### Linting

* `npm run lint:hbs`
* `npm run lint:js`
* `npm run lint:js -- --fix`

### Running tests

* `ember test` – Runs the test suite on the current Ember version
* `ember test --server` – Runs the test suite in "watch mode"
* `ember try:each` – Runs the test suite against multiple Ember versions

### Running the dummy application

* `ember serve`
* Visit the dummy application at [http://localhost:4200](http://localhost:4200).
* Demo the app at [https://ember-signature-pad.firebaseapp.com/](https://ember-signature-pad.firebaseapp.com/)

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

=======
For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).

License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).

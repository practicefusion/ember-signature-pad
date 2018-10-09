import { A } from '@ember/array';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find, triggerEvent } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | signature pad', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
      assert.expect(1);

      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await render(hbs`{{signature-pad}}`);

      assert.dom('*').hasText('');
  });

  test('it saves pen strokes', async function(assert) {
      assert.expect(1);
      this.set('value', A());
      await render(hbs`{{signature-pad value=value}}`);

      await triggerEvent('.signature-pad', 'mousedown');
      await triggerEvent('.signature-pad', 'mouseup');

      assert.equal(this.get('value').length, '1');
  });
});

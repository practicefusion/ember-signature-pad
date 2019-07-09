import { A } from '@ember/array';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, triggerEvent } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | signature pad', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders a canvas element', async function(assert) {
      await render(hbs`<SignaturePad />`);

      assert.dom('canvas').exists({ count: 1 });
  });

  test('it saves pen strokes', async function(assert) {
      this.set('value', A());
      await render(hbs`<SignaturePad @value={{value}} />`);

      await triggerEvent('canvas', 'mousedown');
      await triggerEvent('canvas', 'mouseup');

      assert.equal(this.get('value').length, '1');
  });

  test('it allows to set width and height (angle-bracket invocation)', async function(assert) {
    await render(hbs`<SignaturePad width="100" height="200" />`);

    assert.dom('canvas').hasAttribute('width', '100');
    assert.dom('canvas').hasAttribute('height', '200');
  });

  test('it allows to set width and height (curly-bracket invocation)', async function(assert) {
    await render(hbs`{{signature-pad width="100" height="200"}}`);

    assert.dom('canvas').hasAttribute('width', '100');
    assert.dom('canvas').hasAttribute('height', '200');
  });
});

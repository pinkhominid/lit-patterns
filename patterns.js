import { LitElement, css, html } from './web_modules/lit-element.js'

/**
 * Demonstrates default hidden true
 */
class DefaultHiddenElement extends LitElement {
  static get styles() {
    return css`
      :host([hidden]) { /* necessary if your element (or super) explicitly sets display */
        display: none;
      }
    `
  }

  constructor() {
    super();
    this.hidden = true;
  }

  render() {
    return html`
      <p>This will not render until consumer removes hidden attribute, or sets hidden property false</p>
    `
  }
}

customElements.define('default-hidden', DefaultHiddenElement)

/**
 * Demonstrates using an open attribute/property
 */
class OpenPropertyElement extends LitElement {
  static get properties() {
    return {
      open: { type: Boolean, reflect: true }
    }
  }

  static get styles() {
    return css`
      :host {
        display: none;
      }
      :host([open]) {
        display: block;
      }
    `
  }

  constructor() {
    super();
    this.open = false;
  }

  render() {
    return html`
      <p>This will not render until consumer adds open attribute, or sets open property true</p>
    `
  }
}

customElements.define('open-property', OpenPropertyElement)

/**
 * Demonstrates default light DOM content
 */
class DefaultLightDomContentElement extends LitElement {
  render() {
    return html`
      <slot>
        <p>This is default slotted light DOM content</p>
      </slot>
    `
  }
}

customElements.define('default-light-dom-content', DefaultLightDomContentElement)

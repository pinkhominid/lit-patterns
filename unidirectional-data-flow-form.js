import { LitElement, css, html } from './web_modules/lit-element.js'
import { guard } from './web_modules/lit-html/directives/guard.js'

/**
 * Demonstrates uni-directional data flow for html forms
 *
 * Goals:
 * ui = f(state)
 * Use every built-in form element
 * Auto type conversion
 * Minimal event handlers
 * Validation
 * Semantic HTML
 * Disabled form
 * A11y
 * Demos async option data
 *
 * Todo:
 * Cancel (w/preventDefault) not resetting select and radio
 * Single state prop (how to define and automate type conversion? defaultConverter?)
 * Demonstrate side-effect free (clone props, immer?)
 * Other form validation patterns
 * Demo Aync save
 * State machine?
 * Reflection?
 */
export class UnidirectionalDataFlowFormElement extends LitElement {
  static get properties() {
    return {
      name: String,
      eyeColor: Number,
      wearsGlasses: Boolean,
      kind: Number,
      favTastes: Array,
      comments: String,

      eyeColors: Array,
      kinds: Array,
      tastes: Array,

      disabled: Boolean
    }
  }

  static get styles() {
    return css`
      fieldset { border: 0 }
      fieldset > label { display: block }
    `
  }

  constructor() {
    super()

    this.init()

    this.eyeColors = []

    // Test async
    setTimeout(val => this.eyeColors = val, 2000, [
      { id: 0, name: 'Brown' },
      { id: 1, name: 'Blue' },
      { id: 2, name: 'Green' },
    ])

    this.kinds = [
      { id: 0, name: 'Beatles' },
      { id: 1, name: 'Elvis' },
    ]
    this.tastes = [
      { id: 0, name: 'Bitter' },
      { id: 1, name: 'Salty' },
      { id: 2, name: 'Sour' },
      { id: 3, name: 'Sweet' },
      { id: 4, name: 'Umami' },
    ]
    this.disabled = false
  }

  init() {
    this.name = null
    this.eyeColor = null
    this.wearsGlasses = false
    this.kind = null
    this.favTastes = []
    this.comments = null
  }

  render() {
    return html`
      <form
        @submit=${this.onFormSubmit}
        @reset=${this.onFormReset}
        @input=${this.onFormInput}
        novalidate
      >
        <fieldset .disabled=${this.disabled}>

          <label>Name:
            <input name=name placeholder="Jane Doe" .value=${this.name}>
          </label>

          <label>Eye Color:
            ${guard([this.eyeColors], () => this.eyeColors.length
              ? this.eyeColors.map(eyeColor => html`
                <label>${eyeColor.name}
                  <input
                    name=eyeColor
                    type=radio
                    .checked=${this.eyeColor === eyeColor.id}
                    .value=${eyeColor.id}
                    required
                  >
                </label>
              `)
              : html`loading…`
            )}
          </label>

          <label>Glasses?
            <input
              name=wearsGlasses
              type=checkbox
              .checked=${this.wearsGlasses}
            >
          </label>

          <label>Kind:
            <select name=kind>
              <option></option>
              ${this.kinds.map(kind => html`
                <option .selected=${kind.id === this.kind} .value=${kind.id}>${kind.name}</option>
              `)}
            </select>
          </label>

          <label>Fav Tastes:
            <select name=favTastes multiple>
              ${this.tastes.map(taste => html`
                <option .selected=${this.favTastes.includes(taste.id)} .value=${taste.id}>
                  ${taste.name}
                </option>
              `)}
            </select>
          </label>

          <label>Comments:
            <textarea name=comments .value=${this.comments}></textarea>
          </label>

          <button .disabled=${!this.ready}>Save</button>
          <button type=reset>Cancel</button>

        </fieldset>
      </form>
    `
  }

  get ready() {
    return this.eyeColors.length && this.kinds.length && this.tastes.length
  }

  get state() {
    // create state object on-the-fly
    return Object.keys(this.constructor.properties).reduce((state, key) => {
      state[key] = this[key]
      return state
    }, {})
  }

  reportValidity() {
    return this.shadowRoot.querySelector('form').reportValidity()
  }

  onFormSubmit(e) {
    e.preventDefault()
    if (this.reportValidity()) {
      this.dispatchEvent(new CustomEvent('save', { detail: this.state }))
    }
  }

  onFormReset(e) {
    // e.preventDefault()
    this.init()
    this.dispatchEvent(new CustomEvent('cancel'))
  }

  onFormInput(e) {
    if (e.target.matches('select[multiple]')) {
      this[e.target.name] = Array.from(e.target.selectedOptions).map(
        option => parseInt(option.value)
      )
    } else {
      this[e.target.name] = e.target[e.target.type === 'checkbox' ? 'checked' : 'value']
    }
  }
}

customElements.define('unidirectional-data-flow-form', UnidirectionalDataFlowFormElement)

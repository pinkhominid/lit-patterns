import { LitElement, defaultConverter, css, html } from './web_modules/lit-element.js'

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
 * Demo async option data
 *
 * Todo:
 * Demo datalist (combobox)
 * Other form validation patterns
 * Demo Async save
 * Demo side-effect free (clone props)
 *
 * Consider single state prop (how to define and automate type conversion?)
 * Consider using a state machine
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
    this.name = ''
    this.eyeColor = -1
    this.wearsGlasses = false
    this.kind = -1
    this.favTastes = []
    this.comments = ''
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
            <!-- Show loading message before required async data arrives -->
            ${!this.eyeColors.length
              ? html`Loading…`
              : this.eyeColors.map(eyeColor => html`
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
            }
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

          <button>Save</button>
          <button type=reset>Cancel</button>

        </fieldset>
      </form>
    `
  }

  get state() {
    // create state object on-the-fly
    return Object.keys(this.constructor.properties).reduce((state, key) => {
      state[key] = this[key]
      return state
    }, {})
  }

  isFormSubmittable() {
    // 1. Collections supplying options for required fields are populated
    // 2. HTML form validation requirements are met
    return this.eyeColors.length && this.shadowRoot.querySelector('form').reportValidity()
  }

  onFormSubmit(e) {
    e.preventDefault()
    if (this.isFormSubmittable()) {
      this.dispatchEvent(new CustomEvent('save', { detail: this.state }))
    }
  }

  onFormReset(e) {
    // can't preventDefault as reset behavior is necessary to deselect radio groups
    this.init()
    this.dispatchEvent(new CustomEvent('cancel'))
  }

  onFormInput(e) {
    if (e.target.matches('select[multiple]')) {
      this[e.target.name] = Array.from(e.target.selectedOptions).map(
        // use defaultConverter to convert form values to numbers (assumes numeric IDs)
        option => defaultConverter.fromAttribute(option.value, Number)
      )
    } else {
      // use property converter to convert form values to declared types
      const convert = this.constructor.properties[e.target.name]
      this[e.target.name] = convert(e.target[e.target.type === 'checkbox' ? 'checked' : 'value'])
    }
  }
}

customElements.define('unidirectional-data-flow-form', UnidirectionalDataFlowFormElement)

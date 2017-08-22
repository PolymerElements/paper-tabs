import '../polymer/polymer.js';
import { IronButtonState } from '../iron-behaviors/iron-button-state.js';
import { IronControlState } from '../iron-behaviors/iron-control-state.js';
import '../iron-flex-layout/iron-flex-layout.js';
import { PaperRippleBehavior } from '../paper-behaviors/paper-ripple-behavior.js';
import { Polymer } from '../polymer/lib/legacy/polymer-fn.js';
import { dom } from '../polymer/lib/legacy/polymer.dom.js';
Polymer({
  _template: `
    <style>
      :host {
        @apply --layout-inline;
        @apply --layout-center;
        @apply --layout-center-justified;
        @apply --layout-flex-auto;

        position: relative;
        padding: 0 12px;
        overflow: hidden;
        cursor: pointer;
        vertical-align: middle;

        @apply --paper-font-common-base;
        @apply --paper-tab;
      }

      :host(:focus) {
        outline: none;
      }

      :host([link]) {
        padding: 0;
      }

      .tab-content {
        height: 100%;
        transform: translateZ(0);
          -webkit-transform: translateZ(0);
        transition: opacity 0.1s cubic-bezier(0.4, 0.0, 1, 1);
        @apply --layout-horizontal;
        @apply --layout-center-center;
        @apply --layout-flex-auto;
        @apply --paper-tab-content;
      }

      :host(:not(.iron-selected)) > .tab-content {
        opacity: 0.8;

        @apply --paper-tab-content-unselected;
      }

      :host(:focus) .tab-content {
        opacity: 1;
        font-weight: 700;
      }

      paper-ripple {
        color: var(--paper-tab-ink, var(--paper-yellow-a100));
      }

      .tab-content > ::slotted(a) {
        @apply --layout-flex-auto;

        height: 100%;
      }
    </style>

    <div class="tab-content">
      <slot></slot>
    </div>
`,

  is: 'paper-tab',

  behaviors: [
    IronControlState,
    IronButtonState,
    PaperRippleBehavior
  ],

  properties: {

    /**
     * If true, the tab will forward keyboard clicks (enter/space) to
     * the first anchor element found in its descendants
     */
    link: {
      type: Boolean,
      value: false,
      reflectToAttribute: true
    }

  },

  hostAttributes: {
    role: 'tab'
  },

  listeners: {
    down: '_updateNoink',
    tap: '_onTap'
  },

  attached: function() {
    this._updateNoink();
  },

  get _parentNoink () {
    var parent = dom(this).parentNode;
    return !!parent && !!parent.noink;
  },

  _updateNoink: function() {
    this.noink = !!this.noink || !!this._parentNoink;
  },

  _onTap: function(event) {
    if (this.link) {
      var anchor = this.queryEffectiveChildren('a');

      if (!anchor) {
        return;
      }

      // Don't get stuck in a loop delegating
      // the listener from the child anchor
      if (event.target === anchor) {
        return;
      }

      anchor.click();
    }
  }
});

class FABCard extends HTMLElement {
  static get properties() {
    return {
      _config: {},
      _hass: {},
    };
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.positiveStates = [
      true,
      'true',
      'on',
      'open',
      'active',
      'detected',
      'occupied',
      'unlocked',
      'home',
      'above_horizon',
      'ready',
    ];
  }

  setConfig(config) {
    this._config = config;
    this.render();
  }

  render() {
    if (!this.shadowRoot) return;

    const leftButtonEnabled = this._config.left ? ' fab-left' : '';

    const primaryColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--primary-color')
      .trim();
    const textPrimaryColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--text-primary-color')
      .trim();
    const accentColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--accent-color')
      .trim();

    this.shadowRoot.innerHTML = `
      <style>
        .fab {
          position: fixed;
          bottom: 1em;
          right: 1em;
          width: 3.5em;
          height: 3.5em;
          border-radius: 50%;
          background-color: ${this._config.button_color || primaryColor};
          box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.26);
          color: ${this._config.icon_color || textPrimaryColor} !important;
          text-align: center;
          line-height: 3.5em;
          cursor: pointer;
          outline: 0;
          z-index: 1024;
        }
        .fab.fab-left {
          right: auto;
          left: 1em;
        }
        .fab ha-icon {
          font-size: 1.5em;
        }
        .fab.active {
          background-color: ${this._config.active_color || accentColor};
        }
      </style>
      <div class="fab${leftButtonEnabled}">
        <ha-icon icon="${this._config.icon}"></ha-icon>
      </div>
    `;

    this.shadowRoot.querySelector('.fab').addEventListener('click', () => {
      this._handleAction(this._config.action);
    });

    if (this._config.entity) {
      this.updateActiveClass(this._config.entity);
    }
  }

  _handleAction(actionConfig) {
    if (!actionConfig) return;

    if (actionConfig.action === 'navigate' && actionConfig.navigation_path) {
      window.location.href = actionConfig.navigation_path;
    } else if (actionConfig.action === 'call-service' && actionConfig.service) {
      const [domain, service] = actionConfig.service.split('.', 2);
      this._hass.callService(domain, service, actionConfig.service_data);
    }
  }

  updateActiveClass(entityId) {
    if (!this._hass) return;

    try {
      const entityState = this._hass.states[entityId].state;
      const fabButton = this.shadowRoot.querySelector('.fab');
      if (this.positiveStates.includes(entityState)) {
        fabButton.classList.add('active');
      } else {
        fabButton.classList.remove('active');
      }
    } catch (error) {
      console.error('Failed to update active class:', error);
    }
  }

  set hass(hass) {
    if (this._hass !== hass) {
      this._hass = hass;
      if (this._config.entity) {
        this.updateActiveClass(this._config.entity);
      }
    }
  }

  getCardSize() {
    return 0; // This card doesn't occupy any space
  }
}

customElements.define('fab-card', FABCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'fab-card',
  name: 'FAB Card',
  description: 'A customizable floating button with actions.',
  preview: false,
  documentationURL: 'https://github.com/bhuebschen/fab-card',
});

console.info(
  '%c     FAB-CARD     \n%c   Version: 1.0.0  ',
  'color: white; background: #db9834; font-weight: bold; padding: 5px 0;',
  'color: white; background: #333; font-weight: bold; padding: 5px 0;',
);

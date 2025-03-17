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

    const {
      position,
      offset_x,
      offset_y,
      icon_offset_x,
      icon_offset_y,
      animation,
      disabled,
    } = this._config;

    const primaryColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--primary-color')
      .trim();
    const textPrimaryColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--text-primary-color')
      .trim();
    const accentColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--accent-color')
      .trim();

    let positionStyles = '';
    switch (position) {
      case 'top-right':
        positionStyles = `top: calc(1em + ${
          offset_y || '0px'
        }); right: calc(1em + ${offset_x || '0px'});`;
        break;
      case 'top-left':
        positionStyles = `top: calc(1em + ${
          offset_y || '0px'
        }); left: calc(1em + ${offset_x || '0px'});`;
        break;
      case 'middle-right':
        positionStyles = `top: calc(50% + ${
          offset_y || '0px'
        }); right: calc(1em + ${
          offset_x || '0px'
        }); transform: translateY(-50%);`;
        break;
      case 'middle-left':
        positionStyles = `top: calc(50% + ${
          offset_y || '0px'
        }); left: calc(1em + ${
          offset_x || '0px'
        }); transform: translateY(-50%);`;
        break;
      case 'middle-top':
        positionStyles = `top: calc(1em + ${
          offset_y || '0px'
        }); left: 50%; transform: translateX(-50%);`;
        break;
      case 'middle-bottom':
        positionStyles = `bottom: calc(1em + ${
          offset_y || '0px'
        }); left: 50%; transform: translateX(-50%);`;
        break;
      case 'bottom-left':
        positionStyles = `bottom: calc(1em + ${
          offset_y || '0px'
        }); left: calc(1em + ${offset_x || '0px'});`;
        break;
      default:
        positionStyles = `bottom: calc(1em + ${
          offset_y || '0px'
        }); right: calc(1em + ${offset_x || '0px'});`;
    }

    let animationClass = '';
    if (animation) animationClass = `animate__animated animate__${animation}`;

    this.shadowRoot.innerHTML = `
      <style>
        .fab {
          position: fixed;
          ${positionStyles}

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
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease-in-out;
        }

        .fab.disabled {
          opacity: 0.5;
          cursor: not-allowed;
          pointer-events: none;
        }

        .fab ha-icon {
          font-size: 1.5em;
          transform: translate(${icon_offset_x || '0px'}, ${
            icon_offset_y || '0px'
          });
        }

        .fab.active {
          background-color: ${this._config.active_color || accentColor};
        }
      </style>
      <div class="fab ${animationClass} ${disabled ? 'disabled' : ''}">
        <ha-icon icon="${this._config.icon}"></ha-icon>
      </div>
    `;

    this.shadowRoot.querySelector('.fab').addEventListener('click', (ev) => {
      this._handleAction(this._config.action);
    });

    if (this._config.entity) {
      this.updateActiveClass(this._config.entity);
    }
  }

  doAction(config) {
    if (config) {
      switch (config.action) {
        case 'assist':
          let assistButton = this.deepQuerySelectorAll(
            "ha-icon-button[data-selector='ASSIST']",
          );
          if (assistButton.length == 0) {
            assistButton = this.deepQuerySelectorAll(
              "mwc-icon-button[title='Assist']",
            );
          }
          if (assistButton.length > 0) {
            assistButton[0].click();
            setTimeout(
              () =>
                this.deepQuerySelectorAll('.listening-icon')[0]
                  .querySelectorAll('ha-icon-button')[0]
                  .click(),
              250,
            );
          }
        case 'more-info':
          if (config.entity) {
            const event = new Event('hass-more-info', { composed: true });
            event.detail = { entityId: config.entity };
            this.dispatchEvent(event);
          }
          break;
        case 'navigate':
          if (config.navigation_path) {
            history.pushState(null, '', config.navigation_path);
            const navEvent = new Event('location-changed', {
              bubbles: true,
              composed: true,
            });
            navEvent.detail = { replace: false };
            this.dispatchEvent(navEvent);
          }
          break;
        case 'call-service':
          this._hass.callService(
            config.service.split('.')[0],
            config.service.split('.')[1],
            config.service_data,
          );
          break;
        case 'fire-dom-event':
          const event = new Event('ll-custom', {
            composed: true,
            bubbles: true,
          });
          event.detail = config;
          this.dispatchEvent(event);
          break;
        case 'url':
          if (config.url_path) {
            if (config.target) {
              window.open(config.url_path, config.target);
            } else {
              window.location.href = config.url_path;
            }
          }
          break;
        default:
          break;
      }
    }
  }

  _handleAction(actionConfig) {
    if (!actionConfig) return;

    this.doAction(actionConfig);
  }

  updateActiveClass(entityId) {
    if (!this._hass) return;

    try {
      const entityState = this._hass.states[entityId].state;
      const fabButton = this.shadowRoot.querySelector('.fab');
      if (animation) {
        setTimeout(() => {
          fabButton.classList.add('animate__animated', `animate__${animation}`);
          fabButton.style.opacity = '1';
        }, 100);
      } else {
        fabButton.style.opacity = '1';
      }
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

  deepQuerySelectorAll(selector, rootNode = document.body) {
    const nodes = [];
    const traverse = (node) => {
      if (node.nodeType !== Node.ELEMENT_NODE) return;
      if (node.matches(selector)) nodes.push(node);
      [...node.children].forEach(traverse);
      if (node.shadowRoot) [...node.shadowRoot.children].forEach(traverse);
    };
    traverse(rootNode);
    return nodes;
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
  '%c     FAB-CARD     \n%c   Version: 1.0.4  ',
  'color: white; background: #db9834; font-weight: bold; padding: 5px 0;',
  'color: white; background: #333; font-weight: bold; padding: 5px 0;',
);

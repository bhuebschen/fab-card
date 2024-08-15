# FAB Card

[![hacs][hacs-image]][hacs-url]
[![GitHub Sponsors][gh-sponsors-image]][gh-sponsors-url]

The FAB Card is a custom Lovelace card for Home Assistant that allows you to place a floating action-button. This card provides a visually appealing way to access common actions or navigate to different parts of your Home Assistant dashboard.

### Features:
- **Customization:** Configure the icons, colors, and positions of the floating button to match your dashboard's theme.

### Installation:

### [HACS](hacs) (Home Assistant Community Store)

1. Go to HACS page on your Home Assistant instance
1. Add this repository (https://github.com/bhuebschen/fab-card) via HACS Custom repositories [How to add Custom Repositories](https://hacs.xyz/docs/faq/custom_repositories/)
1. Select `Frontend`
1. Press add icon and search for `FAB Card`
1. Select FAB Card repo and install
1. Force refresh the Home Assistant page (<kbd>Ctrl</kbd> + <kbd>F5</kbd> / (<kbd>Shift</kbd> +) <kbd>⌘</kbd> + <kbd>R</kbd>)
1. Add fab-card to your page

[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=bhuebschen&repository=fab-card&category=plugin)

### Manual

1. Download the 'fab-card.js' from the latest [release][release-url] (with right click, save link as)
1. Place the downloaded file on your Home Assistant machine in the `config/www` folder (when there is no `www` folder in the folder where your `configuration.yaml` file is, create it and place the file there)
1. In Home Assistant go to `Configuration->Lovelace Dashboards->Resources` (When there is no `resources` tag on the `Lovelace Dashboard` page, enable advanced mode in your account settings, and retry this step)
1. Add a new resource
   1. Url = `/local/fab-card.js.js`
   1. Resource type = `module`
1. Force refresh the Home Assistant page (<kbd>Ctrl</kbd> + <kbd>F5</kbd> / (<kbd>Shift</kbd> +) <kbd>⌘</kbd> + <kbd>R</kbd>)
1. Add fab-card to your page

### Configuration:
Here's an example configuration for the FAB Card:

```yaml
type: 'custom:fab-card'
button_color: '#FF5722'
icon_color: '#FFFFFF'
active_color: '#2257FF'
icon: 'mdi:menu'
action:
  action: navigate
  navigation_path: '/lovelace/1'
# Example for service call:
# action:
#   action: call-service
#   service: light.turn_on
#   service_data:
#     entity_id: light.living_room
entity: light.living_room
positive_states:
  - 'on'
  - 'home'
left: false
```
### Options:

## Options

| Name             | Type     | Requirement  | Description                                                   | Default             |
|------------------|----------|--------------|---------------------------------------------------------------|---------------------|
| type             | string   | **Required** | `custom:fab-card`                                              |                     |
| button_color     | string   | **Optional** | Background color of the button                                 | `--primary-color`   |
| icon_color       | string   | **Optional** | Color of the icon                                              | `--text-primary-color` |
| active_color     | string   | **Optional** | Background color of the button when active                     | `--accent-color`    |
| icon             | string   | **Required** | Icon to display on the FAB button                              | `mdi:menu`          |
| action           | object   | **Required** | Action to perform when the button is clicked                   |                     |
| action.action    | string   | **Required** | Type of action (`navigate`, `call-service`, `more-info`, `fire-dom-event`, `url`)              |                     |
| action.navigation_path | string | **Optional** | Path to navigate to (required if action is `navigate`)         |                     |
| action.service   | string   | **Optional** | Service to call (required if action is `call-service`)         |                     |
| action.service_data | object | **Optional** | Data to include with the service call (required if action is `call-service`) |                     |
| action.url_path | string | **Optional** | URL to navigate to  (required if action is `url`) |
| action.target | string | **Optional** | Sets the target-frame/window/tab of the URL  (optional if action is `url`) |
| entity           | string   | **Optional** | Entity to monitor for state changes                            |                     |
| positive_states  | list     | **Optional** | List of states considered positive                             | `['true', 'on', 'open', 'active', 'detected', 'occupied', 'unlocked', 'home', 'above_horizon', 'ready']` |
| left             | boolean  | **Optional** | Position the button on the left side                           | `false`             |

### Usage:
After installation, you can add the fab-card to your Lovelace dashboard using the sample configuration provided above. Customize the card by setting the desired options in your YAML configuration

### Issues & Contributions:
If you encounter any issues or have suggestions for improvements, feel free to [open an issue](https://github.com/bhuebschen/fab-card/issues) or submit a pull request.

## License

MIT © [Benedikt Hübschen][bhuebschen]

<!-- Badges -->

[hacs-url]: https://github.com/hacs/integration
[hacs-image]: https://img.shields.io/badge/hacs-custom-orange.svg?style=flat-square
[gh-sponsors-url]: https://github.com/sponsors/bhuebschen
[gh-sponsors-image]: https://img.shields.io/github/sponsors/bhuebschen?style=flat-square

<!-- References -->

[home-assistant]: https://www.home-assistant.io/
[hacs]: https://hacs.xyz
[latest-release]: https://github.com/bhuebschen/fab-card/releases/latest
[ha-scripts]: https://www.home-assistant.io/docs/scripts/
[edit-readme]: https://github.com/bhuebschen/fab-card/edit/master/README.md

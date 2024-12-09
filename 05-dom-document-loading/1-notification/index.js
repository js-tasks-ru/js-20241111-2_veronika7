export default class NotificationMessage {
  static lastShownNotification;

  constructor(messageText = '', props = {}) {
    const {
      duration = 0,
      type = '',
    } = props;
    this.messageText = messageText;
    this.duration = duration;
    this.type = type;
    this.element = this.createElement(this.createTemplate());
  }

  createElement(template) {
    const element = document.createElement("div");
    element.innerHTML = template;
    return element.firstElementChild;
  }

  createTemplate() {
    return (
      `
        <div class="notification ${this.type}" style="--value:${this.duration}ms">
          <div class="timer"></div>
          <div class="inner-wrapper">
            <div class="notification-header">${this.type}</div>
            <div class="notification-body">
              ${this.messageText}
            </div>
          </div>
        </div>
      `
    );
  }

  show(targetElement = document.body) {
    if (NotificationMessage.lastShownNotification) {
      NotificationMessage.lastShownNotification.remove();
    }
    NotificationMessage.lastShownNotification = this;

    targetElement.appendChild(this.element);
    this.hide();
  }

  hide() {
    setTimeout(() => this.remove(), this.duration);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}

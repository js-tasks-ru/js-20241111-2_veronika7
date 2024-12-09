export default class ColumnChart {
  chartHeight = 50;

  constructor(props = {}) {
    const {
      data = [],
      label = '',
      link = '',
      value = 0,
      formatHeading = (data) => data,
    } = props;
    this.data = data;
    this.label = label;
    this.value = value;
    this.link = link;
    this.formatHeading = formatHeading;
    this.element = this.createElement(this.createTemplate());
  }

  createElement(template) {
    const element = document.createElement("div");
    element.innerHTML = template;
    return element.firstElementChild;
  }

  createLink() {
    return this.link ? `<a href="/sales" class="column-chart__link">View all</a>` : '';
  }

  getColumnProps(data) {
    const maxValue = Math.max(...data);
    const scale = this.chartHeight / maxValue;

    return data.map(item => {
      return {
        percent: (item / maxValue * 100).toFixed(0) + '%',
        value: String(Math.floor(item * scale))
      };
    });
  }

  createChartBodyTemplate() {
    return this.getColumnProps(this.data).map(({value, percent}) => `
        <div style="--value: ${value}" data-tooltip="${percent}"></div>
      `).join('');
  }

  createTemplate() {
    return (
      `
        <div class="${this.data.length ? "column-chart" : "column-chart column-chart_loading"} " style="${this.chartHeight}">
            <div class="column-chart__title">
                ${this.label}
                ${this.createLink()}
            </div>
            <div class="column-chart__container">
              <div data-element="header" class="column-chart__header">
              ${this.formatHeading(this.value)}
              </div>
              <div data-element="body" class="column-chart__chart">
                ${this.createChartBodyTemplate()}
              </div>
            </div>
        </div>
      `
    );
  }

  update(newData) {
    this.data = newData;
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}

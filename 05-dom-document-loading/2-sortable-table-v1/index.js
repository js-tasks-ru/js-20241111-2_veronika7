export default class SortableTable {
  subElements = {};
  orderValue;
  fieldValue;

  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = data;
    this.element = this.createElement(this.createTemplate());
    this.selectSubElements();
  }

  createElement(template) {
    const element = document.createElement("div");
    element.innerHTML = template;
    return element.firstElementChild;
  }

  selectSubElements() {
    this.element.querySelectorAll('[data-element]').forEach(element => {
      this.subElements[element.dataset.element] = element;
    });
  }

  createTableHeaderArrowTemplate() {
    return `<span data-element="arrow" class="sortable-table__sort-arrow">
                <span class="sort-arrow"></span>
            </span>`;
  }

  createTableHeaderCellTemplate(columnData) {
    const isSortable = columnData.sortable && this.orderValue && columnData.id === this.fieldValue;
    const dataOrder = isSortable ? `data-order="${this.orderValue}"` : '';
    return `
      <div
          class="sortable-table__cell"
          data-id="${columnData.id}"
          data-sortable="${columnData.sortable}"
          ${dataOrder}
      >
        <span>${columnData.title}</span>
        ${isSortable ? this.createTableHeaderArrowTemplate() : ''}
      </div>
    `;
  }

  createTableHeaderTemplate() {
    return this.headerConfig.map(headerColumn => (
      this.createTableHeaderCellTemplate(headerColumn)
    )).join('');
  }

  createTableBodyCellTemplate(product, columnConfig) {
    const id = columnConfig.id;

    if (columnConfig.template) {
      return columnConfig.template(product);
    }
    return (
      `
        <div class="sortable-table__cell">${product[id]}</div>
      `
    );
  }

  createTableBodyRowTemplate(product) {
    return (
      `
        <a href="/products/3d-ochki-epson-elpgs03" class="sortable-table__row">
            ${this.headerConfig.map(column => this.createTableBodyCellTemplate(product, column)).join('')}
        </a>
      `
    );
  }

  createTableBodyTemplate(data) {
    return data.map((product) => (
      this.createTableBodyRowTemplate(product)
    )).join('');
  }

  createTemplate() {
    return (
      `
        <div class="sortable-table">
            <div data-element="header" class="sortable-table__header sortable-table__row">
                ${this.createTableHeaderTemplate()}
            </div>
            <div data-element="body" class="sortable-table__body">
                ${this.createTableBodyTemplate(this.data)}
            </div>
            <div data-element="loading" class="loading-line sortable-table__loading-line"></div>

            <div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
              <div>
                <p>No products satisfies your filter criteria</p>
                <button type="button" class="button-primary-outline">Reset all filters</button>
              </div>
            </div>
        </div>
      `
    );
  }

  sortByType(sortType) {
    if (sortType === 'number') {
      return this.sortNumbers(this.data, this.fieldValue, this.orderValue);
    }
    if (sortType === 'string') {
      return this.sortStrings(this.data, this.fieldValue, this.orderValue);
    }
  }

  sortNumbers(data) {
    if (this.orderValue === 'asc') {
      return [...data].sort((a, b) => a[this.fieldValue] - b[this.fieldValue]);
    }
    if (this.orderValue === 'desc') {
      return [...data].sort((a, b) => b[this.fieldValue] - a[this.fieldValue]);
    }
    return [...data];
  }

  sortStrings(data) {
    if (this.orderValue === 'asc') {
      return [...data].sort(
        (a, b) => {
          return a[this.fieldValue].localeCompare(b[this.fieldValue], ['ru', 'en'], { caseFirst: "upper" });
        });
    }
    if (this.orderValue === 'desc') {
      return [...data].sort(
        (a, b) => {
          return b[this.fieldValue].localeCompare(a[this.fieldValue], ['ru', 'en'], { caseFirst: "upper" });
        });
    }
    return [...data];
  }

  sort(fieldValue, orderValue) {
    this.fieldValue = fieldValue;
    this.orderValue = orderValue;

    this.setDataOrderAttribute(orderValue);

    const sortType = this.headerConfig.find(obj => obj.id === fieldValue).sortType;
    const sortedData = this.sortByType(sortType);

    this.updateTemplate(sortedData);
  }

  setDataOrderAttribute() {
    const sortableElems = document.body.querySelectorAll('.sortable-table__cell');
    for (let element of sortableElems) {
      element.setAttribute('data-order', this.orderValue);
    }
  }

  updateTemplate(sortedData) {
    this.subElements.header.innerHTML = this.createTableHeaderTemplate();
    this.subElements.body.innerHTML = this.createTableBodyTemplate(sortedData);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}


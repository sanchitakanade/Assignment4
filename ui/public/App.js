/* Name: Sanchita Kanade
   Class:CS648.02 Modern Full-Stack Web Development (Spring 2020)
   Assignment: 4
   File: App.jsx
*/

/* eslint "react/react-in-jsx-scope": "off" */

/* globals React ReactDOM */

/* eslint "react/jsx-no-undef": "off" */

/* eslint "react/no-multi-comp": "off" */

/* eslint "no-alert": "off" */

/* eslint linebreak-style: ["error", "windows"] */
async function graphQLFetch(query, variables = {}) {
  try {
    const response = await fetch(window.ENV.UI_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query,
        variables
      })
    });
    const body = await response.text();
    const result = JSON.parse(body);

    if (result.errors) {
      const error = result.errors[0];

      if (error.extensions.code === 'BAD_USER_INPUT') {
        const details = error.extensions.exception.errors.join('\n ');
        alert(`${error.message}:\n ${details}`);
      } else {
        alert(`${error.extensions.code}: ${error.message}`);
      }
    }

    return result.data;
  } catch (e) {
    alert(`Error in sending data to server: ${e.message}`);
    return null;
  }
}

function ProductRow({
  product
}) {
  return /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, product.Name), /*#__PURE__*/React.createElement("td", null, '$'.concat(product.Price)), /*#__PURE__*/React.createElement("td", null, product.Category), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("a", {
    href: product.Image,
    target: "_blank",
    rel: "noopener noreferrer"
  }, "View")));
}

function ProductTable({
  products
}) {
  const productrows = products.map(product => /*#__PURE__*/React.createElement(ProductRow, {
    key: product.id,
    product: product
  }));
  return /*#__PURE__*/React.createElement("table", {
    className: "bordered-table"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Product Name"), /*#__PURE__*/React.createElement("th", null, "Price"), /*#__PURE__*/React.createElement("th", null, "Category"), /*#__PURE__*/React.createElement("th", null, "Image"))), /*#__PURE__*/React.createElement("tbody", null, productrows));
}

class ProductAdd extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    const form = document.forms.productAdd;
    const price = form.Price.value;
    const newPrice = price.substr(1, price.length);
    e.preventDefault();
    const product = {
      Category: form.Category.value,
      Price: newPrice,
      Name: form.Name.value,
      Image: document.getElementById('image').value
    };
    const {
      createProduct
    } = this.props;
    createProduct(product);
    form.Category.value = 'Shirts';
    form.Price.value = '$';
    form.Name.value = '';
    form.Image.value = '';
  }

  render() {
    return /*#__PURE__*/React.createElement("form", {
      name: "productAdd",
      onSubmit: this.handleSubmit
    }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("label", {
      htmlFor: "productCategory"
    }, "Category", /*#__PURE__*/React.createElement("select", {
      name: "Category",
      id: "productCategory"
    }, /*#__PURE__*/React.createElement("option", null, "Shirts"), /*#__PURE__*/React.createElement("option", null, "Jeans"), /*#__PURE__*/React.createElement("option", null, "Jackets"), /*#__PURE__*/React.createElement("option", null, "Sweaters"), /*#__PURE__*/React.createElement("option", null, "Accessories"))), /*#__PURE__*/React.createElement("label", {
      htmlFor: "name"
    }, "Product Name", /*#__PURE__*/React.createElement("input", {
      type: "text",
      name: "Name",
      id: "name"
    }))), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("label", {
      htmlFor: "price"
    }, "Price Per Unit", /*#__PURE__*/React.createElement("input", {
      type: "text",
      name: "Price",
      id: "price"
    })), /*#__PURE__*/React.createElement("label", {
      htmlFor: "image"
    }, "Image URL", /*#__PURE__*/React.createElement("input", {
      type: "url",
      name: "Image",
      id: "image"
    }))), /*#__PURE__*/React.createElement("button", {
      type: "submit"
    }, "Add Product"));
  }

}

class ProductList extends React.Component {
  constructor() {
    super();
    this.state = {
      products: []
    };
    this.list();
    this.createProduct = this.createProduct.bind(this);
  }

  componentDidMount() {
    this.list();
    document.forms.productAdd.Price.value = '$';
  }

  async createProduct(product) {
    const query = `mutation addProduct($product: productInputs!) {
      addProduct(product: $product) {
        id
      } 
    }`;
    const data = await graphQLFetch(query, {
      product
    });

    if (data) {
      this.list();
    }
  }

  async list() {
    const query = `query {
      productList {
        id Category Name Price
        Image
      }
    }`;
    const data = await graphQLFetch(query);

    if (data) {
      this.setState({
        products: data.productList
      });
    }
  }

  render() {
    const {
      products
    } = this.state;
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h1", null, "My Company Inventory"), /*#__PURE__*/React.createElement("div", null, "Showing all available products"), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement(ProductTable, {
      products: products
    }), /*#__PURE__*/React.createElement("div", null, "Add a new product to inventory"), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement(ProductAdd, {
      createProduct: this.createProduct
    }));
  }

}

const element = /*#__PURE__*/React.createElement(ProductList, null);
ReactDOM.render(element, document.getElementById('content'));
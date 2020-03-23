{/*Name: Sanchita Kanade
   Class:CS648.02 Modern Full-Stack Web Development (Spring 2020)
   Assignment: 3
   File: App.jsx
*/}
async function graphQLFetch(query, variables = {}) {
  try {
    const response = await fetch('/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({ query, variables })
    });
    const body = await response.text();
    const result = JSON.parse(body);
    if(result.errors) {
      const error = result.errors[0];
      if (error.extensions.code == 'BAD_USER_INPUT') {
        const details = error.extensions.exception.errors.join('\n ');
        alert(`${error.message}:\n ${details}`);
      } else {
        alert(`${error.extensions.code}: ${error.message}`);
      }
    }
    return result.data;
    } catch(e) {
      alert(`Error in sending data to server: ${e.message}`);
    }
}
function ProductRow(props) {
  const product = props.product;
  return(
    <tr>
      <td>{product.Name}</td>
      <td>{("$").concat(product.Price)}</td>
      <td>{product.Category}</td>
      <td><a href={product.Image} target="_blank">View</a></td>
    </tr>
  );
}

function ProductTable(props) {
  const productrows = props.products.map(
    product => <ProductRow key={product.id} product={product}/>);
  return (
    <table className="bordered-table">
      <thead>
        <tr>
          <th>Product Name</th>
          <th>Price</th>
          <th>Category</th>
          <th>Image</th>
        </tr>
      </thead>
      <tbody>
        {productrows}
      </tbody>
    </table>
  );
}

class ProductAdd extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit(e) {
    e.preventDefault();
    const form = document.forms.productAdd;
    var price = form.Price.value;
    var newPrice = price.substr(1, price.length);    
    const product = {
      Category:form.Category.value, Price: newPrice, 
      Name: form.Name.value, Image:document.getElementById("image").value
    };
    this.props.createProduct(product);
    form.Category.value="Shirts";
    form.Price.value="$";
    form.Name.value="";
    form.Image.value="";
  }
  render() {
    return(
      <form name= "productAdd" onSubmit={this.handleSubmit}>
        <span>
          <label>Category </label>
          <select name="Category">
            <option>Shirts</option>
            <option>Jeans</option>
            <option>Jackets</option>
            <option>Sweaters</option>
            <option>Accessories</option>
          </select>
          <label>Product Name </label>
          <input type="text" name="Name"/> 
        </span>
        <span>
          <label>Price Per Unit</label>
          <input type="text" name="Price"/>
          <label>Image URL </label>
          <input type="url" name="Image" id="image"/>
        </span>
        <button>Add Product</button>
      </form>
    );
  }
}

class ProductList extends React.Component {
  constructor() {
    super();
    this.state = {products:[]};
    this.list();
    this.createProduct = this.createProduct.bind(this);
  }
  componentDidMount() {
    this.list();
    document.forms.productAdd.Price.value = "$";
  }
  async createProduct(product) {
    const query = `mutation addProduct($product: productInputs!) {
      addProduct(product: $product) {
        id
      } 
    }`;
    const data = await graphQLFetch(query, { product });
    if(data) {
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
    if(data) {
      this.setState({ products: data.productList });
    }
  }
  render() {
    return(
      <React.Fragment>
        <h1>My Company Inventory</h1>
        <div>Showing all available products</div>
        <hr/>
        <ProductTable products={this.state.products}/>
        <div>Add a new product to inventory</div>
        <hr/>
        <ProductAdd createProduct={this.createProduct}/>
      </React.Fragment>
    );
  }
}
const element = <ProductList/>
ReactDOM.render(element, document.getElementById('content'));
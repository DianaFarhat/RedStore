async function fetchProducts() {
  try {
    const response = await fetch('products.json');
    if (!response.ok) throw new Error('Failed to fetch products');
    return await response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

function getTemplate(product) {
  // Determine template based on discount availability
  const templateId = product.discount > 0 ? '#discounted-product-template' : '#product-template';
  const template = document.querySelector(templateId);
  if (!template) throw new Error(`Template ${templateId} not found`);
  return template.content.cloneNode(true);
}

function createProductCard(product) {
  
  const { productId, productName, description, brand, price, discount, imageURLs } = product;
  const imageUrl = Object.values(imageURLs)[0] || 'placeholder.jpg'; // Fallback image
  const discountedPrice = (price * (1 - discount)).toFixed(2);

  const template = getTemplate(product);


  // Add product ID as a data attribute to the card div for easy access
  template.querySelector('.card').dataset.productId = productId;

  // Populate template
  template.querySelector('.card-img-top').src = imageUrl;
  template.querySelector('.card-img-top').alt = productName; // Accessibility
  template.querySelector('.card-img-top').loading = 'lazy'; // Lazy loading
  template.querySelector('.product-name').textContent = productName;
  template.querySelector('.product-description').textContent = description;
  template.querySelector('.product-brand').textContent = brand;

  if (discount > 0) {
    template.querySelector('.discounted-price').textContent = `$${discountedPrice}`;
    template.querySelector('.og-price').textContent = `$${price}`;
    template.querySelector('.product-discount').textContent = `${Math.round(discount * 100)}% off`;
  } else {
    template.querySelector('.product-price').textContent = `$${price}`;
  }

   // Add onclick handler to the .card element
   template.querySelector('.card').onclick = function() {
    /*
    const productId = template.querySelector('.card').dataset.productId;
    */
   
    // Debug logs
    console.log('Clicked Product:', product);       // Check if product exists
    console.log('Saving productId:', productId);    // Verify the productId is captured

    // Save to localStorage
    localStorage.setItem('currentProductId', productId);
    
    // Redirect to sproduct.html
    window.location.href = 'sproduct.html';
  };


  return template;
}

async function displayProducts() {
  const products = await fetchProducts();
  const productContainer = document.querySelector('#product1 .row');

  if (products.length === 0) {
    productContainer.innerHTML = '<p>No products available</p>';
    return;
  }

  products.forEach(product => {
    try {
      const productCard = createProductCard(product);
      productContainer.appendChild(productCard);
    } catch (error) {
      console.error('Error creating product card:', error);
    }
  });
}


function redirectToProductPage(card) {
  const productId = card.dataset.productId; // Get the product ID from the data attribute
  const url = new URL('sproduct.html', window.location.href); // Create a URL object for sproduct.html
  url.searchParams.set('productId', productId); // Append the productId as a query parameter
  window.location.href = url; // Redirect to sproduct.html with the productId in the URL
}



document.addEventListener('DOMContentLoaded', displayProducts);
/*
document.addEventListener('DOMContentLoaded', redirectToProductPage);
*/
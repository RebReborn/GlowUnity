document.addEventListener('DOMContentLoaded', () => {
  // Initialize GlowUnity blocks
  const glowunityBlocks = document.querySelectorAll('.glowunity-app-block');
  
  if (glowunityBlocks.length > 0) {
    // Load products for each block
    glowunityBlocks.forEach(block => {
      const container = block.querySelector('.glowunity-products-container');
      const productCount = block.dataset.productCount || 4;
      
      fetch(`/apps/glowunity/api/products?count=${productCount}`)
        .then(response => response.json())
        .then(products => {
          products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.innerHTML = `
              <a href="/products/${product.handle}">
                <img src="${product.image}" alt="${product.title}">
                <h3>${product.title}</h3>
                <p>${product.price}</p>
              </a>
            `;
            container.appendChild(productCard);
          });
        });
    });
  }
});

// Theme editor compatibility
if (Shopify.designMode) {
  document.addEventListener('shopify:section:load', (event) => {
    if (event.target.querySelector('.glowunity-app-block')) {
      window.location.reload();
    }
  });
}

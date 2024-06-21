const menu = document.getElementById('menu')
const cartBtn = document.getElementById('cart-btn')

const cartModal = document.getElementById('cart-modal')
const cartItemnsModal = document.getElementById('cart-items')
const cartTotalModal = document.getElementById('cart-total')
const checkoutBtnModal = document.getElementById('checkout-btn')
const closeBtnModal = document.getElementById('close-modal-btn')
const addressInputModal = document.getElementById('address')
const addressWornModal = document.getElementById('address-warn')

const cartCounter = document.getElementById('cart-count')

//Lita de itens do carrinho
let cartList = []

//Abre o modal do carrinho
cartBtn.addEventListener('click', function () {
  updateCartModal()
  cartModal.style.display = 'flex'
})
//Fecha modal quando clica fora
cartModal.addEventListener('click', function (event) {
  if (event.target === cartModal) {
    cartModal.style = 'none'
  }

})

closeBtnModal.addEventListener('click', function () {
  cartModal.style = 'none'
})

//Recebe o nome, valor e adiciona ao carrinho ao clicar no button ou no ícone 
menu.addEventListener('click', function (event) {
  let parentButton = event.target.closest('.add-to-cart-btn')


  if (parentButton) {
    const name = parentButton.getAttribute('data-name')
    const price = parseFloat(parentButton.getAttribute("data-price"))

    //Adicionando no carrinho
    addToCard(name, price)

  }
})

function addToCard(name, price) {
  const existingItem = cartList.find(item => item.name === name)

  if (existingItem) {
    existingItem.quantity += 1
  }

  else {
    cartList.push({
      name,
      price,
      quantity: 1,
    })
  }

  updateCartModal()
}

function updateCartModal() {
  cartItemnsModal.innerHTML = ""
  let total = 0

  cartList.forEach(item => {
    const cartItemElement = document.createElement('div')
    cartItemElement.classList.add('flex', 'justify-between', 'mb-2', 'flex-col')

    cartItemElement.innerHTML = `
            <div class='flex items-center justify-between'>
                <div>
                    <p class='font-medium'>${item.name}</p>
                    <p>Qtd: ${item.quantity}</p>
                    <p  class='font-medium mt-2'>R$ ${item.price.toFixed(2)}</p>
                </div>


                <button class="remove-from-cart-btn" data-name="${item.name}"> 
                    Remover
                </button>
             
            </div>
        `
    total += item.price * item.quantity


    cartItemnsModal.appendChild(cartItemElement)

  })

  cartTotalModal.textContent = total.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })

  cartCounter.innerHTML = cartList.length
}

cartItemnsModal.addEventListener('click', function (event) {
  if (event.target.classList.contains('remove-from-cart-btn')) {
    const name = event.target.getAttribute('data-name')

    removeItemCart(name);
  }
})

function removeItemCart(name) {
  const index = cartList.findIndex(item => item.name === name)

  if (index !== -1) {
    const item = cartList[index]

    if (item.quantity > 1) {
      item.quantity -= 1
      updateCartModal()
      return
    }

    cartList.splice(index, 1)
    updateCartModal()
  }
}

addressInputModal.addEventListener('input', function (event) {
  let inputValue = event.target.value

  if (inputValue !== "") {
    addressInputModal.classList.remove('border-red-500')
    addressWornModal.classList.add('hidden')
  }
})

//Finalizar pedido
checkoutBtnModal.addEventListener('click', function () {

  const isOpen = checkRestaurantOpen()
  if (!isOpen) {
    Toastify({
      text: "Ops!! restaurante fechado no momento",
      duration: 3000,
      destination: "https://github.com/apvarun/toastify-js",
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "left", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "#ef4444",
      },
    }).showToast()

    return
  }

  if (cartList.length === 0) return

  if (addressInputModal.value === "") {
    addressWornModal.classList.remove('hidden')
    addressInputModal.classList.add('border-red-500')
  }

  //Enviar o pedido para API whtas
  const cartItems = cartList.map((item) => {
    return (
      `${item.name} Quantidade: (${item.quantity}) Preço: R$${item.price} |`
    )
  }).join("")

  const message = encodeURIComponent(cartItems)
  //Adicionar número de WhatsApp
  const phone = ''

  window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInputModal.value}`, "_blank")

  cartList = []
  updateCartModal()
})

function checkRestaurantOpen() {
  const data = new Date()
  const hora = data.getHours()

  return hora >= 18 && hora < 22
}

const spanItem = document.getElementById('date-span')
const isOpen = checkRestaurantOpen()

if (isOpen) {
  spanItem.classList.remove('bg-red-500')
  spanItem.classList.add('bg-green-600')
}
else {
  spanItem.classList.remove('bg-green-600')
  spanItem.classList.add('bg-red-500')
}
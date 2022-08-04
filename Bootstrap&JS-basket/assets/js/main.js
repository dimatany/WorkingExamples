"use strict"
const topPanel = {
    show: function (text, className) {
        let panel = `<div  id="top-panel" class="top-panel ${className}">${text}</div>`;
        if (document.getElementById('top-panel') !== null) {
            document.getElementById('top-panel').remove();
        }
        document.body.insertAdjacentHTML('afterBegin', panel);
        this.hide();
    },
    hide: function () {
        setTimeout(function () {
            if (document.getElementById('top-panel') !== null) {
                document.getElementById('top-panel').remove();
            }
        }, 3000)
    },
    error: function (text) {
        this.show(text, 'panel-error');
    },
    success: function (text) {
        this.show(text, 'panel-success');
    },
    info: function (text) {
        this.show(text, 'panel-info');
    }
}

const CARD = [{
    name: 'Chocolate',
    qty: 1,
    isBuy: true,
    price: 25.25,
    total: 25.25
},
    {
        name: 'Bread',
        qty: 1,
        isBuy: true,
        price: 20,
        total: 20
    },
    {
        name: 'Apple',
        qty: 1,
        isBuy: true,
        price: 45,
        total: 45
    }
];

viewCardTable()

function addToCard(name, qty, price) {
    if (CARD.find(el => el.name === name) === undefined) {
        CARD.push({
            name: name,
            qty: qty,
            isBuy: false,
            price: price,
            total: parseFloat((qty * price).toFixed(2))
        })
    } else {
        const prodIndex = CARD.findIndex(el => el.name === name);
        const newQty = CARD[prodIndex].qty + qty;
        CARD[prodIndex].qty = newQty;
        CARD[prodIndex].total = parseFloat((newQty * CARD[prodIndex].price).toFixed(2));
        topPanel.success('Product quantity changed')
    }
    viewCardTable();
}

function checkAndAddToCard() {
    let name = document.getElementById('product_name').value,
        qty = parseInt(document.getElementById('product_qty').value),
        price = parseFloat(document.getElementById('product_price').value);
    
    let valid = true;
    if (name === '') {
        // alert('Enter product name');
        topPanel.error('Enter product name');
        valid = false;
    }
    if (isNaN(qty)) {
        topPanel.error('Enter quantity valid value');
        valid = false;
    }
    if (qty <= 0) {
        topPanel.error('Quantity value must be positive');
        valid = false;
    }
    
    if (isNaN(price)) {
        topPanel.error('Enter price valid value');
        valid = false;
    }
    if (price <= 0) {
        topPanel.error('Price must be positive');
        valid = false;
    }
    if (valid) {
        addToCard(name, qty, price)
        topPanel.success('Product successfully added');
        document.getElementById('product_name').value = '';
        document.getElementById('product_qty').value = '1';
        document.getElementById('product_price').value = '';
    }
}

function viewCardTable() {
    let html = '';
    CARD.sort((a, b) => Number(a.isBuy) - Number(b.isBuy));
    CARD.forEach(product => {
        html +=
            `<tr>
        <td>${product.name}</td>
        <td>${product.isBuy ? '<span class="badge bg-success">Yes</span>' : '<span class="badge bg-danger">No</span>'} </td>
        <td>
            <button class="btn btn-info btn-sm" onclick="changeProductQty('${product.name}', 'dec')">-</button>
            ${product.qty}
            <button class="btn btn-info btn-sm" onclick="changeProductQty('${product.name}', 'inc')">+</button>
        </td>
        <td>${product.price.toFixed(2)}</td>
        <td>${product.total.toFixed(2)}</td>
        <td>
        <button type="button" class="btn btn-primary" onclick="changeProdStatus('${product.name}')">Change Status</button></td>
        <td>
        <button type="button" class="btn btn-danger" onclick="askProdDel('${product.name}')">&times;</button>
        </td>
    </tr>`;
    });
    document.getElementById('cart-body').innerHTML = html;
    document.getElementById('cart-total').innerText = summTotal();
}

function changeProductQty(name, action) {
    let index = CARD.findIndex(el => el.name === name);
    let newQty;
    newQty = 0;
    if (action === 'inc') {
        newQty = CARD[index].qty + 1;
    } else {
        if (CARD[index].qty >= 2) {
            newQty = CARD[index].qty - 1;
        } else {
            askProdDel(name);
            return false;
        }
    }
    CARD[index].qty = newQty;
    CARD[index].total = CARD[index].price * newQty;
    viewCardTable();
    setSorting();
}

function summTotal() {
    return CARD.reduce((acc, curr) => {
        return acc + curr.total;
    }, 0);
}

function askProdDel(name) {
    if (confirm('Delete ' + name + '?')) {
        let index = CARD.findIndex(el => el.name === name);
        CARD.splice(index, 1);
        viewCardTable();
        setSorting();
        topPanel.info('Product successfuly deleted!')
    }
}

function changeProdStatus(name) {
    let index = CARD.findIndex((el) => el.name === name);
    CARD[index].isBuy = !CARD[index].isBuy;
    viewCardTable();
    setSorting();
}

const DISCOUNT = [{
    promo: 'qwerty',
    type: 'fixed',
    value: 15,
    isUsed: false,
},
    {
        promo: 'asdfg',
        type: 'persent',
        value: 5,
        isUsed: false,
    }
]

function checkAndApplyDiscount() {
    const discPromo = document.getElementById('discountField').value;
    if (discPromo === '') {
        topPanel.error('Enter promo code');
        return false;
    }
    
    const index = DISCOUNT.findIndex(el => el.promo === discPromo);
    
    if (index === -1) {
        topPanel.error('Promo code not found');
        return false;
    }
    
    const disc = DISCOUNT[index];
    
    if (disc.isUsed) {
        topPanel.error('Promo code already used');
        return false;
    }
    let newTotal = calcDiscount(disc);
    DISCOUNT[index].isUsed = true;
    document.getElementById('discValue').innerText = disc.value + ((disc.type === 'fixed') ? 'UAH' : '%');
    document.getElementById('totalWithDisc').innerText = newTotal.toFixed(2);
    document.getElementById('discountField').value = '';
    document.getElementById('viewReceiptTotalWithDisc').innerHTML =
        `
    <div class="col-8">Total with discount</div>
    <div class="col-4">${newTotal.toFixed(2)}</div>
    `
}

function calcDiscount(disc) {
    debugger;
    const {
        type,
        value
    } = disc;
    const sumTotalValue = summTotal();
    switch (type) {
        case 'fixed':
            return sumTotalValue - value;
        case 'persent':
            return sumTotalValue - (sumTotalValue / 100 * value);
    }
}

viewReceipt();

function viewReceipt() {
    let html = '';
    let sum = 0;
    CARD.map(function (el) {
        if (el.isBuy === true) {
            sum += el.total;
            html +=
                `<div class="row">
            <div class="col-8">${el.name}</div>
            <div class="col-8 small">${el.qty} x ${el.price.toFixed(2)}</div>
            <div class="col-4">${el.total.toFixed(2)}</div>
            <hr>
            </div>
            `
        }
    });
    document.getElementById('viewReceipt').innerHTML = html;
    document.getElementById('viewReceiptTotal').innerHTML =
        `<div>${sum} </div> `;
}

setSorting();

function setSorting() {
    const sorting = document.getElementById('sorting').value;
    switch (sorting) {
        default:
            CARD.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'az':
            CARD.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'za':
            CARD.sort((a, b) => b.name.localeCompare(a.name));
            break;
        case 'desc':
            CARD.sort((a, b) => a.total - b.total);
            break;
        case 'asc':
            CARD.sort((a, b) => b.total - a.total);
            break;
    }
    viewReceipt();
}
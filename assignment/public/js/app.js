window.app = {
    apiUrl: "http://localhost:3000/",
    getMenu: function(){
        
        // gửi request lên server json => danh sách của danh mục
        // từ danh sách danh mục sinh ra code html cho phần #navbar_content
        fetch(this.apiUrl + "categories")
        .then(responseData => responseData.json())
        .then(data => {
            let menuContent = data.map(function(element){
                return `<li class="nav-item active">
                            <a class="nav-link" href="danh-muc.html?id=${element.id}"> ${element.name} </a>
                        </li>`; 
            }).join('');
            menuContent += `<li class="nav-item active">
                                <a id="menu_cart_total" class="nav-link" href="gio-hang.html"> Giỏ hàng(${this.getTotalItemOnCart()})</a>
                            </li>`;
            document.querySelector('#navbar_content').innerHTML = menuContent;
        })
    },
    getProducts: function(){
        fetch(this.apiUrl + "products?_expand=category")
        .then(responseData => responseData.json())
        .then(data => {
            let productContent = data.map(function(element){
                return `<div class="col-4">
                            <div class="card" style="width: 100%;">
                                <img src="${element.image}" class="card-img-top" alt="...">
                                <div class="card-body">
                                <h5 class="card-title">
                                    <a href="chi-tiet.html?id=${element.id}">${element.name}</a>    
                                </h5>
                                <p class="card-text">Danh mục: ${element.category.name}</p>
                                <p class="card-text">${element.detail}</p>
                                <p class="card-text">${element.price}</p>
                                <a href="chi-tiet.html?id=${element.id}" class="btn btn-primary">Chi tiết</a>
                                <button class="btn btn-warning" data-id="${element.id}" data-img="${element.image}" onclick="app.add2Cart(${element.id}, 
                                                                                        '${element.name}', 
                                                                                        '${element.image}', 
                                                                                        ${element.price}, 
                                                                                        ${element.categoryId}, 
                                                                                        '${element.category.name}')">Thêm giỏ hàng</button>
                                </div>
                            </div>
                        </div>`; 
            }).join('');
            document.querySelector('.list-products').innerHTML = productContent;
        })
    },
    getQueryStringParam: function(name){
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    },
    add2Cart: function(id, name, image, price, cateId, cate_name){
        let cartStorage = localStorage.getItem('cart');
        let screenCart = null;
        if(cartStorage == null){
            screenCart = [];
        }else{
            screenCart = JSON.parse(cartStorage);
        }
        
        let item = {
            id: id,
            name: name,
            image: image,
            price: price,
            cateId: cateId,
            cate_name: cate_name
        };

        let existed = screenCart.findIndex(ele => ele.id == item.id);

        if(existed == -1){
            item.quantity = 1;
            screenCart.push(item);            
        }else{
            screenCart[existed].quantity++;
        }

        localStorage.setItem('cart', JSON.stringify(screenCart));
        document.querySelector('a#menu_cart_total').innerText = `Giỏ hàng (${this.getTotalItemOnCart()})`;
        alert("Cập nhật sản phẩm vào giỏ hàng thành công!");
    },
    getTotalItemOnCart: function(){
        let cartStorage = localStorage.getItem('cart');
        let screenCart = null;
        if(cartStorage == null){
            screenCart = [];
        }else{
            screenCart = JSON.parse(cartStorage);
        }
        let totalItem = 0;
        screenCart.forEach(element => {
            totalItem += element.quantity;
        });

        return totalItem;
    }
}
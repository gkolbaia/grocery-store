/**
 * class Person
 *  - WakeUp +
 *  - Walk +
 *  - GoIn +
 *  - GoOut +
 *  - Buy +
 *  - Sleep +
 *  - give+
 *  - take
 *  - 
 *  - describeInterior
 * class Home
 *  - saveItem
 * class Warehouse
 *  - addItem+
 *  - takeItem+
 * class Store
 *  - addStaffPerson +
 *  - removeStaffPerson +
 * class Item
 *  - getName
 */


function Person(name) {
    var money = 100;
    var items = {};
    this.name = name;

    this.personAwake = function () {
        if (this.awake != true) {
            this.awake = true;
        } else {
            throw 'You are already awake';
        }
    }
    this.personSleep = function () {
        if (this.personIsIn == home) {
            if (this.awake == true) {
                this.awake = false;
            } else {
                throw 'you are already sleeping';
            }
        } else {
            throw 'you are not home';
        }
    }
    this.walk = function (whereTowalk) {
        if (this.awake) {
            if (this.personIsIn) {
                throw 'You have to come out of building to walk';
            } else {
                if (this.personisAt != whereTowalk) {
                    this.personisAt = whereTowalk;
                } else {
                    throw 'you are at destination';
                }
            }
        } else {
            throw 'you are sleeping'
        }
    }
    this.goIn = function (whereToGo) {
        if (this.personIsIn) {
            throw 'You are already in building';
        } else {
            if (this.personisAt == whereToGo) {
                if (whereToGo.needsPermission) {
                    if (whereToGo.permissionForVisitor(this)) {
                        this.personIsIn = whereToGo;
                        this.personisAt = null;
                    } else {
                        throw 'you can not come in';
                    }
                } else {
                    this.personIsIn = whereToGo;
                    this.personisAt = null;
                }
            } else {
                throw 'You are not at the place you want to enter';
            }
        }
    }
    this.leaveBuilding = function (whatToLeave) {
        if (this.personIsIn == whatToLeave) {
            this.personIsIn = null;
            this.personisAt = whatToLeave;
        } else {
            throw 'You are not in that building';
        }
    }
    this.buy = function (product, amount) {
        if (this.personIsIn) {
            if (this.personIsIn.storeProducts[product]) {
                if (money >= this.personIsIn.storeProducts[product]['price'] * amount) {
                    if (items[product]) {
                        items[product]['amount'] += amount;
                    } else {
                        items[product] = this.personIsIn.sellProducts(product, amount);
                    }
                } else {
                    console.log('you dont have enough money')
                }
            } else {
                console.log('there is not such product in this store');
            }
        } else {
            throw 'you are not in shop'
        }
    }
    this.saveItemInHome = function (product) {
        if (this.personIsIn == home) {
            if (items[product]) {
                home.items[product] = {
                    amount: items[product]['amount']
                }
                delete items[product];
            } else {
                throw 'you dont have that product to save';
            }
        } else {
            throw ' you are not at home ';
        }
    }
    this.returnItems = function () {
        return items;
    }
    this.describePlace = function () {
        if (this.personIsIn) {
            for (var property in this.personIsIn) {
                if (typeof this.personIsIn[property] != 'function') {
                    if (typeof this.personIsIn[property] != 'boolean') {
                        console.log(property + ':');
                        console.log(this.personIsIn[property]);
                    }
                }
            }
        } else {
            console.log('person is you of building');
        }
    }
}
function Home() {
    this.items = {};
    this.needsPermission = false;
}
function Warehouse() {
    var warehouseProducts = {};
    this.addProduct = function (product, amount, price) {
        if (warehouseProducts[product]) {
            warehouseProducts[product]['amount'] += amount;
        } else {
            warehouseProducts[product] = {
                'amount': amount,
                'price': price
            }
        }
    }
    this.returnWarehouseProducts = function () {
        return warehouseProducts;
    }
    this.giveProductToStore = function (product, amount) {
        var productToGive = {};
        if (warehouseProducts[product]) {
            if (warehouseProducts[product]['amount'] == amount) {
                productToGive = warehouseProducts[product];
                delete warehouseProducts[product];
            } else if (warehouseProducts[product]['amount'] > amount) {
                productToGive = {
                    'amount': amount,
                    'price': warehouseProducts[product]['price']
                }
                warehouseProducts[product]['amount'] -= amount;
            } else {
                console.log('we dont have so many ' + product + ' take ' + warehouseProducts[product]['amount']);
                productToGive = warehouseProducts[product];
                delete warehouseProducts[product];
            }
            return productToGive;
        } else {
            console.log('there is no ' + product + ' in warewhouse');
        }
    }
}
function Store() {
    this.storeProducts = {};
    var personsInStore = [];
    this.personAmountInStore = null;
    var budget = 1000;
    this.warehouse = new Warehouse();
    this.needsPermission = true;
    this.dayTime = function () {
        if (new Date().getHours() > 10 && new Date().getHours() < 19) {
            return true;
        } else {
            return false;
        }
    }
    this.addStaff = function (person) {
        if (this.staff) {
            console.log('we already have staff');
        } else {
            this.staff = person;
        }
    }
    this.removeStaff = function (person) {
        if (this.staff == person) {
            this.staff = null;
        } else {
            throw 'this person is not our staff'
        }
    }
    this.openStore = function () {
        if (this.dayTime()) {
            if (this.staff.personIsIn == this) {
                return true;
            } else {
                return false;
            }
        }
    }
    this.permissionForVisitor = function (person) {
        if (this.staff != person) {
            if (this.openStore()) {
                if (person.name == 'giorgi') {
                    return false;
                } else {
                    personsInStore.push(person['name']);
                    this.personAmountInStore += 1;
                    return true;
                }
            } else {
                console.log('we are closed');
            }
        } else {
            return true;
        }
    }
    this.sellProducts = function (product, amount) {
        var productToSell = {};
        if (this.openStore()) {
            if (this.storeProducts[product]) {
                if (this.storeProducts[product]['amount'] == amount) {
                    budget += amount * this.storeProducts[product]['price'];
                    productToSell = this.storeProducts[product];
                    delete this.storeProducts[product];
                } else if (this.storeProducts[product]['amount'] > amount) {
                    budget += amount * this.storeProducts[product]['price'];
                    productToSell = {
                        'amount': amount,
                        'price': this.storeProducts[product]['price']
                    }
                    this.storeProducts[product]['amount'] -= amount;
                } else {
                    if (confirm('we dont have ' + amount + ' ' + product + ', we only have ' + this.storeProducts[product]['amount'] + ' one, want to buy?')) {
                        budget += this.storeProducts[product]['amount'] * this.storeProducts[product]['price'];
                        productToSell = this.storeProducts[product];
                        delete this.storeProducts[product];
                    }
                }
                return productToSell;
            } else {
                console.log('we dont have ' + product);
            }
        } else {
            throw 'we are closed';
        }
    }
    this.buyingProducts = function (product, amount, price) {
        if (this.openStore()) {
            if (budget >= amount * price) {
                this.warehouse.addProduct(product, amount, price);
                budget -= amount * price;
            } else {
                console.log('we have no enough money');
            }
        } else {
            throw 'store is closed';
        }
    }
    this.returnBudget = function () {
        return budget;
    }
    this.getProductsFromWarehouse = function (product, amount) {
        if (this.storeProducts[product]) {
            this.storeProducts[product]['amount'] += this.warehouse.giveProductToStore(product, amount)['amount'];
        } else {
            this.storeProducts[product] = this.warehouse.giveProductToStore(product, amount);
        }
    }
}
var giorgi = new Person('giorgi');
var irakli = new Person('irakli');
var store = new Store();
var home = new Home();
irakli.personAwake();
giorgi.personAwake();
irakli.walk(store);
giorgi.walk(store);
store.addStaff(giorgi);
giorgi.goIn(store);
store.buyingProducts('book1', 5, 5);
store.buyingProducts('book2', 4, 7);
store.buyingProducts('book3', 7, 2);
store.buyingProducts('book4', 11, 6);
store.buyingProducts('book5', 8, 8);
store.buyingProducts('book6', 10, 9);
store.getProductsFromWarehouse('book1', 4);
store.getProductsFromWarehouse('book2', 3);
store.getProductsFromWarehouse('book3', 6);
store.getProductsFromWarehouse('book4', 9);
store.getProductsFromWarehouse('book5', 4);
store.getProductsFromWarehouse('book6', 7);

irakli.goIn(store);
irakli.buy('book1', 3);
irakli.leaveBuilding(store);
irakli.walk(home);
irakli.goIn(home);
irakli.saveItemInHome('book1');
console.log(irakli.describePlace());

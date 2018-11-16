/**
 * class Person
 *  - WakeUp +
 *  - Walk +
 *  - GoIn +
 *  - GoOut +
 *  - Buy
 *  - Sleep +
 *  - describeInterior
 * class Home
 *  - saveItem
 * class Warehouse
 *  - addItem+
 *  - takeItem+
 * class Store
 *  - addStaffPerson +
 *  - removeStaffPerson
 * class Item
 *  - getName
 */
function Person(name) {
    this.name = name;
    this.awake = null;
    this.personIsIn = null;
    this.personisAt = null;
    this.personAwake = function () {
        if (this.awake != true) {
            this.awake = true;
        } else {
            console.log('You are already awake');
        }
    }
    this.personSleep = function () {
        if (this.personIsIn == home) {
            if (this.awake == true) {
                this.awake = false;
            } else {
                console.log('you are already sleeping')
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
            this.personIsIn.sellProducts(product, amount);
        } else {
            throw 'you arenot in shop'
        }
    }
}
function Home() {
    this.needsPermission = false;
    var homeItems = [];
}
function Warehouse() {
    var money;
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
    this.removeProduct = function (product, amount) {
        if (warehouseProducts[product]) {
            if (warehouseProducts[product]['amount'] == amount) {
                money = amount * warehouseProducts[product]['price'];
                delete warehouseProducts[product];
            } else if (warehouseProducts[product]['amount'] > amount) {
                money = amount * warehouseProducts[product]['price'];
                warehouseProducts[product]['amount'] -= amount;
            } else if (warehouseProducts[product]['amount'] < amount) {
                if (confirm('Sorry, we only have ' + amount + ' ' + product + ', wanna take?')) {
                    money = amount * warehouseProducts[product]['price'];
                    delete warehouseProducts[product];
                } else {
                    console.log('BB');
                }
            }
        } else {
            throw 'Wa have not got ' + product;
        }
    }
    this.returnWarehouseProducts = function () {
        return warehouseProducts;
    }
    this.returnMoney = function () {
        return money;
    }

}
function Store() {
    this.products = {};
    this.personsInStore = [];
    var budget = 1000;
    this.warehouse = new Warehouse();
    this.needsPermission = true;
    this.dayTime = null;
    this.storeIsOpen = null;
    this.staff = null;
    this.addStaff = function (person) {
        if (this.staff) {
            throw 'we already have staff';
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
        if (this.dayTime) {
            if (this.staff.personIsIn == this) {
                this.storeIsOpen = true;

            } else {
                this.storeIsOpen = false;
            }
        }
    }
    this.permissionForVisitor = function (person) {
        if (this.staff != person) {
            if (this.storeIsOpen) {
                if (person.name == 'giorgi') {
                    return false;
                } else {
                    this.personsInStore.push(person['name'])
                    return true;
                }
            } else {
                throw 'we are closed';
            }
        } else {
            return true;
        }
    }
    this.sellProducts = function (product, amount) {
        if (this.storeIsOpen) {
            this.warehouse.removeProduct(product, amount);
            budget += this.warehouse.returnMoney();
        }
    }
    this.buyingProducts = function (product, amount, price) {
        if (this.storeIsOpen) {
            if (budget >= amount * price) {
                this.warehouse.addProduct(product, amount, price);
                budget -= amount * price;
            } else {
                throw 'we have no so much money';
            }
        } else {
            throw 'store is closed';
        }

    }
    this.returnBudget = function () {
        return budget;
    }
    this.day = function () {
        this.dayTime = true;
    }
    this.night = function () {
        this.dayTime = false;
    }

}




var giorgi = new Person('giorgi');
var irakli = new Person('irakli');
var store = new Store();
var home = new Home();
store.day();
giorgi.personAwake();
irakli.personAwake();
giorgi.walk(store);
irakli.walk(store);
store.addStaff(giorgi);
giorgi.goIn(store);
store.openStore();
irakli.goIn(store);
store.buyingProducts('book1', 4, 5);
irakli.leaveBuilding(store);
irakli.walk(home);
irakli.goIn(home);
irakli.personSleep();


console.log(store.returnBudget());
console.log(irakli.awake);

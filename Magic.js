/* NOTE: This code is not guaranteed to work if you do something other than
 * Have a poset of inheritance
 * Load the classes by some linear extension of the poset
 */

Object.prototype.extend = function(list){
    this.initInstances();
    for(var key in list)
	this[key] = list[key];
}

Object.prototype.initInstances = function(){
    if(this.__instances__ === undefined){
	this.__instances__ = new Array(this.name, "Object");
    }
}

Object.prototype.inherits = function(x){
    //if this doesn't inherit anything yet
    this.initInstances();

    //if the thing we are about to inherit doesn't inherit anything yet
    x.prototype.initInstances();

    this.__instances__ = this.__instances__.join(x.prototype.__instances__)

    //we could save space and remove duplicates, but that would
    //require writing the removeDuplicates() method. it doesn't seem
    //totally necessary at this point.
    //this.__instances__.removeDuplicates();
    
    //extend the methods
    this.extend(x.prototype);

}

Object.prototype.instanceOf = function(constructor){
    this.initInstances();
    for(x in this.prototype.__instances__)
	if(x == constructor)
	    return true;
    return false;
}
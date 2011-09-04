//implementation of a doubly linked list (with only one sentinal)

function List(){
    this.head = {prev: null, next: null, data: ""};
    this.head.next = this.head;
    this.head.prev = this.head;

    this.size = 0;
}

List.prototype = {
   toString: function(){
       alert("&&"+this.size);
       if(this.size = 0)
	   return "[]";

       var str = "[" + this.head.next.data;
       var ptr = this.head.next;

       while(ptr.next != this.head){
	   ptr = ptr.next;
	   str += ", " + ptr.data;
       }

       return str + "]";
   },

    //add data to the front of the list
    pushFront: function(d){
	++this.size;
	var n = {data: d, prev: this.head, next: this.head.next};
	this.head.next = n;
	n.next.prev = n;
    },


    //add data to the end of the list
    pushBack: function(d){
	++this.size;
	var n = {data: d, prev: this.head.prev, next: this.head};
	this.head.prev = n;
	n.prev.next = n;
    },

    //add data after the first element for which fn returns true
    addAfter: function(d, fn){
	var ptr = this.head.next;
	while(fn(ptr.data)){
	    ptr = ptr.next;
	    if(ptr == this.head)
		return this.pushBack(d);
	}
	var n = {data: d, prev: ptr, next: ptr.next};
	ptr.next = n;
	n.next.prev = n;
    },

    //remove last item in the list and return it
    popFront: function(){
	if(this.size == 0)
	    return;

	d = this.head.next.data;
	this.head.next.next.prev = this.head;
	this.head.next = this.head.next.next;
	--this.size;
	return d;
    },

    //remove last item in the list and return it
    popBack: function(){
	if(this.size == 0)
	    return;

	d = this.head.prev.data;
	this.head.prev.prev.next = this.head;
	this.head.prev = this.head.prev.prev;
	--this.size;
	return d;
    },

    //the first element in the list
    first: function(){ return this.head.next.data; },

    //the last element in the list
    last: function(){ return this.head.prev.data; },

    //empty the list
    empty: function(){
	this.size = 0;
	this.head.next = this.head;
	this.head.prev = this.head;
    },

    //if data is in the list, remove it otherwise, return null
    remove: function(data){
	var ptr = this.head.next;
	var prevPtr = this.head;

	while(ptr != this.head){
	    if(data === ptr.data)
		//remove the pointer
		prevPtr.next = ptr.next;
	    
	    return data;
	}
	return;
    },

    //call a function on every element of the list in order
    iterate: function(fn){
	var ptr = this.head.next;
	while(ptr != this.head){
	    fn(ptr.data)
	    ptr = ptr.next;
	}
    },

    //call a function on every element of the list in reverse order
    iterateReverse: function(fn){
	var ptr = this.head.prev;
	while(ptr != this.head){
	    fn(ptr.data)
	    ptr = ptr.prev;
	}
    }

};
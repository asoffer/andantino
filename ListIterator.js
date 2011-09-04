//implementation of a doubly linked list iterator
//applies a function to every element of a list

function ListIterator(l,fn){
    this.head = l.head;
    this.fn = fn;
}

ListIterator.prototype ={
   toString: function(){
       return "[ListIterator]";
   },

    apply: function(){
	var ptr=this.head.next;
	while(ptr != this.head){
	    this.fn(ptr.data);
	    ptr = ptr.next;
	}
    }
};
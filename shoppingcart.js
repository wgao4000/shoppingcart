/* 	author:Wei Gao
	date: 9/9/2015
*/
$(document).ready( function(){
	//initialize global variables
  	var total = 0.00;
  	var oldproduct = 0.00;
  	$("#item-name-group").before("<h4 class='totValdiv col-xs-4'>Total: <span class='totVal'></span></h4>");
  	setDigit();
	$("#item-name").on("keydown", function(event) {
		// "enter" button is "13"
		if(event.which == 13){
			event.preventDefault();
			//define local variables 
			var rowBeg = "<div class='row' id='item-row'>";
			var rowBeg1 = "<div class='col-xs-4 item-name'>";
			var rowBegs = rowBeg + rowBeg1;
			var formdiv = "</div>";
			var formdiv1 = "<div class='form-group'>";
			var formdivs = formdiv + formdiv1;
			var rowButtons = "<div class='col-xs-10'>";
			var contents = "<div class='rows'>";
			//add the input boxes and buttons for users to input the items' information
			contents += contentsRow("Price <i class='fa fa-usd'></i>", rowBegs + $(this).val() + formdivs, $(this).val() + "-price");
			contents += contentsRow("Amount ", rowBegs + formdivs, $(this).val() + "-amount");
			contents += addButtons(rowBeg + formdiv1 + rowButtons);
			contents += "<div>";
			$(".totValdiv").before(contents);
		}
	});
	
	/* 
	   When a user clicks the "update" button, the total amount of all items is updated.
	   If the user enters incorrect information into "price" and "amount" input boxes,
	   we will provide the warning to the user.  
	*/ 
	$(document).on("click", ".button1", function() {
		var prevRow = $(this).closest(".row").prev();
		var preRowvalue = findValue(prevRow);
		var prepreRowvalue = findValue(prevRow.prev());
		var hidden = $(this).parent();
		if(validateInt(preRowvalue) && validateInt(prepreRowvalue)) {
			var product = +(preRowvalue) * (Math.floor(+(prepreRowvalue)));
			total = total + product - oldproduct;
			setDigit();
			oldproduct = product;
			if(hidden.children().last().attr('type') == "button") {
				hidden.append("<input type='hidden' value="+ product + ">");
			}
			else
				hidden.children().last().val(product);
			$("#warning").remove();
		}
		else {
			if(! hidden.next().hasClass("text-info"))
				hidden.after('<span class="col-xs-12 text-info" id="warning">Please input positive numbers for both "value" and "amount" boxes.</span>');
		}
	});

	/*
		When a user clicks the "remove" button, the item is removed and the total amount is updated.
	*/
	$(document).on("click", ".button2", function() {
		var subvalue = $(this).next().val();
		if(!isNaN(subvalue)) {
			total -= +(subvalue);
			setDigit();
			oldproduct = 0.00;
		}	
		$(this).closest(".rows").remove();
	}); 

    /*
    	When the user click out the "checkout" button, all items are checked out unless some information is missing. 
    	In that case, the user sees the warning.
    */
	$(document).on("click", "#checkout", function(event){
		event.preventDefault();
		if(total > 0.00) {
			$(this).attr("disable", true);
			$(this).val("...Processing");
			$(this).parent().after("<h3 class='res-meg col-xs-12 text-left'></h3>");
			$(this).fadeOut(2000);
			setTimeout(function() {$(".res-meg").text("Your items have been checked out!"); $(".text-warning").remove()}, 2000);
		}
		else if(!($(this).parent().next().hasClass("text-warning"))){
			$(this).parent().after("<span class='col-xs-12 text-left text-warning'> You need to provide us with the items, prices, and qualities before proceeding.</span>");
		}
	});

	//add two input boxes for price and amount
	function contentsRow(t1, t2, t3) {
		var firstpart = t2 + "<label class='control-label col-sm-1 col-xs-12' for='" + t3 + "'>" + t1;
		var secondpart = firstpart + "</label><div class='col-sm-6 col-xs-12'><input type='text' class='form-control' id='" + t3 + "'></div></div></div>"
		return secondpart;
	}

	//add the "update" and "remove" buttons
	function addButtons(t1) {
		var buttons = t1 + "<button type='button' class='btn btn-primary button1'>Update Item</button><button type='button' class='btn btn-default button2'>Remove Item</button></div></div></div>"; 
		return buttons;
	}

	//find the value of an input box
	function findValue(p1) {
		return p1.find(".form-control").val();
	}

	//check if the input is a positive number
	function validateInt(v1){
        if(!isNaN(v1) && v1 > 0)
        	return true;
        else
        	return false;
	}

	//keep decimal to be 2
	function setDigit() {
		$(".totVal").text(total.toFixed(2));
	}
});
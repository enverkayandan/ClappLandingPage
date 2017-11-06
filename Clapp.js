var db = firebase.database();

var userEmail;
var userUni;
var extensions = [];
var checkedboxes;

db.ref("extensions").once("value").then(function(snapshot){
	snapshot.forEach(function(childSnapshot){
		extensions.unshift(childSnapshot.key);
	});
	return new Promise(function(resolve, reject){
		resolve(extensions);
	})
}).then(function(extensions){

		extensions.forEach(function(element, index){
		extensions[index] = decodeEmail(element);
	});
	
	$("button").click(function(){
		userEmail = $("input[id='email-input']").val();
		userUni = getUni(userEmail);
		checkedboxes = $("input[type='checkbox']:checked");

		extensions.forEach(function(element){
			if(userEmail.includes(element)){
				var interests = [];
				for(var x = 0 ; x < checkedboxes.length ; x++){
					interests[x] = $(checkedboxes[x]).val();
				}
				db.ref(userUni + "_users/" + encodeEmail(userEmail)).set(interests).then(function(){
					for(var i = 0 ; i < checkedboxes.length ; i++){
						db.ref(userUni + "_" + $(checkedboxes[i]).val() + "/" + encodeEmail(userEmail)).set(1);
					}
					$("#success-message").css("visibility", "visible");
				});
			}
		})
	});
});

function getUni(x) {
	for(var i = 0 ; i < x.length ; i++){
		if(x.charAt(i) == "@"){
			i++;
			var ret = "";
			for(var m = i ; m < x.length ; m++){
				if(x.charAt(m) == "."){
					return ret;
				}
				ret+= x.charAt(m);
			}
		}
	}
	return null;
}

function encodeEmail(email){
	for(var i = 0 ; i < email.length ; i++){
		email = email.replace(".", ",");
	}

	return email;
}

function decodeEmail(email){
	for(var i = 0 ; i < email.length ; i++){
		email = email.replace(",", ".");
	}
	return email;
}
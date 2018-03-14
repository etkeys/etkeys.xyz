var _mydob = new Date("1988-01-16");
function calculateMyAge(){
	var ageDif = new Date() - _mydob;
	var ageDifDate = new Date(ageDif);
	var actAge = Math.abs(ageDifDate.getUTCFullYear() - 1970);
	document.getElementById('myCurrentAge').innerHTML= "Age: " + actAge.toString();
}

function openTabContent(evt, sectionName){
	var i, tabcontent, tab;
	
	//Get all elements with class="tabcontent" and hide them
	tabcontent = document.getElementsByClassName("tabcontent");
	for(i=0; i<tabcontent.length; i++){
		tabcontent[i].style.display = "none";
	}
	
	// Get all elements with class="tablinks" and remove the class "active"
	tab = document.getElementsByClassName("tab");
    for (i = 0; i < tab.length; i++) {
        tab[i].className = tab[i].className.replace(" active", "");
    }

	// Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(sectionName).style.display = "inline";
    evt.currentTarget.className += " active";
}
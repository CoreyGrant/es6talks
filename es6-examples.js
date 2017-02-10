class PersonService{
	submit(values){
		console.log(values);
	}
}

class Person{
	constructor(name, age, height, favouriteThings){
		this.name = name;
		this.height = height;
		this.age = age;
		this.favouriteThings = favouriteThings;
	}
}

/**
 * We want the following functionality:
 * - a way to validate that a given value is unique, given a list of other values
 * - a way to take a person, and output a summary of their name, age, and favourite things (as a string)
 * - a way to filter a list of people based on either:
 *   1) an object of {propName: value}
 *   2) a string, which should search all properties
 *   This should be implemented on the filter input, updated when the filter value changes, 
 *   and support colon+comma seperations for prop1:val1,prop2:val2 or just a string.
 * - a way to take the list of people and submit it to the PersonService via a button on the page
 * 
 * Function signatures are provided as examples, feel free to change them. 
 * First thing to look at is why writePeople doesn't work (hint: it's been bound to a button click event)
 */
class Form{
	constructor(people = []){
		this.people = people;
		this.personService = new PersonService();
	}

	valueUnique(value, otherValues){

	}

	/**
	 * Used in writing people to the page
	 */
	getSummary({age, name, favouriteThings}){
	}

	filterPeople(filter){

	}

	writePeople(){
		writePeople(this.people, this.getSummary);
	}

	submitClick(){

	}

	addPerson(){
		const nameInput = document.getElementById('name');
		const heightInput = document.getElementById('height');
		const ageInput = document.getElementById('age');
		const favouriteThingsInput = document.getElementById('favouritethings')
		// Get values from our inputs, ensuring numbers where needed
		const name = nameInput.value;
		const height = +heightInput.value;
		const age = +ageInput.value;
		const favouriteThings = favouriteThingsInput.value.split('\n');
		// Set the inputs to empty
		[nameInput, heightInput, ageInput, favouriteThingsInput].forEach(x => x.value = "");
		// Check that the name is unique
		if(!this.valueUnique(name, people.map(x => x.name))){
			alert("Please make sure the name is unique");
			return;
		}
		// Add the person to the list
		this.people.push(new Person(name, age, height, favouriteThings));
		// Update people displayed
		this.writePeople();
	}
}

function writePeople(people, textSelector){
	// Clear any nodes in there first.
	const peopleDiv = document.querySelector('#people');
	var summaries = people.map(textSelector).map(x => `<p>${x}</p>`);
	peopleDiv.innerHTML = summaries.join('');
}

window.form = new Form([{
	name: "alice",
	height: 1.74,
	age: 18,
	favouriteThings: [
		"pink",
		"ponies"
	]
},{
	name: "bob",
	height: 1.94,
	age: 77,
	favouriteThings: [
		"complaining",
		"being racist"
	]
}, {
	name: "carol",
	height: 1.69,
	age: 36,
	favouriteThings: [
		"breaking cyptographic schemes",
		"SHA-1"
	]
}]);

document.getElementById('writepeople').addEventListener("click", window.form.writePeople);
document.getElementById('submit').addEventListener("click", window.form.submitClick);
document.getElementById('addperson').addEventListener("click", window.form.addPerson);
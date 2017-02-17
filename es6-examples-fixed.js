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
		this.filteredPeople = people;
		this.personService = new PersonService();
	}

	valueUnique(value, otherValues){
		return !otherValues.includes(value);
	}

	/**
	 * Used in writing people to the page
	 */
	getSummary({age, name, favouriteThings}){
		return `Name: ${name}, Age: ${age}, Favourite Things: ${favouriteThings.join(', ')}`;
	}

	/**
	 * Sets the filteredPeople field equal to people with a supplied filter
	 * @param filter: any | string
	 * 	if it is a string, check every property for the value
	 * 	if it is an object, check for each key/value pair
	 */
	filterPeople(filter){
		if(typeof filter === "string"){
			this.filteredPeople = this.people.filter(
				p => Object.keys(p).some(
					prop => p[prop].toString().toLowerCase().includes(filter.toLowerCase())));
		} else {
			const filterProps = Object.keys(filter);
			this.filteredPeople = this.people.filter(
				p => filterProps.every(
					fProp => p[fProp].toString().toLowerCase().includes(filter[fProp].toString().toLowerCase())));
		}
		this.updatePeople();
	}

	updatePeople(){
		// We might have changed filters, or added a new person, so either way toLowerCase
		// should use the filtered list of people
		writePeople(this.filteredPeople, this.getSummary);
	}

	submitClick(){
		this.personService.submit(this.people);
	}

	addPerson(){
		const nameInput = document.getElementById('name');
		const heightInput = document.getElementById('height');
		const ageInput = document.getElementById('age');
		const favouriteThingsInput = document.getElementById('favouritethings')
		// Get values from our inputs, ensuring numbers where needed
		// + is javascript's quick "to number" operator. If it can be turned into a number it is, otherwise it is NaN
		const name = nameInput.value;
		const height = +heightInput.value;
		const age = +ageInput.value;
		const favouriteThings = favouriteThingsInput.value.split('\n');
		// Set the inputs to empty
		[nameInput, heightInput, ageInput, favouriteThingsInput].forEach(x => x.value = "");
		// Check that the name is unique
		if(!this.valueUnique(name, this.people.map(x => x.name))){
			alert("Please make sure the name is unique");
			return;
		}
		// Add the person to the list
		this.people.push(new Person(name, age, height, favouriteThings));
		// Update people displayed
		this.updatePeople();
	}
}

// Writes a list to the page, using the textSelector to generate a line of text for each item
function writePeople(people, textSelector){
	const peopleDiv = document.querySelector('#people');
	const summaries = people.map(textSelector).map(x => `<p>${x}</p>`);
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

// Don't have to specify window.form, just form does.
// First three functions are all using bind, because they need the form to be the 'this' value'.
document.getElementById('writepeople').addEventListener("click", form.updatePeople.bind(form));
document.getElementById('submit').addEventListener("click", form.submitClick.bind(form));
document.getElementById('addperson').addEventListener("click", form.addPerson.bind(form));
// The last function just refers to the form via window.form, as it needs access to the click event.
// Notice it is NOT an arrow function, which would give us the global 'this' (window) instead of the event 
document.getElementById('peoplefilter').addEventListener("keypress", function(e){
	if(e.keyCode !== 13 /* enter key*/){
		return;
	}
	let value = this.value;
	// If it includes a :, it needs to be parsed as an object
	if(value.includes(':')){
		const valueObj = {};
		const splitValues = value.split(',').map(x => x.split(':').map(y => y.trim()));
		splitValues.forEach(([key, value]) => {
			valueObj[key] = [value];
		});
		value = valueObj;
	}
	form.filterPeople(value);
});

// Known bugs (which you can fix if you want):
// Adding/filtering can cause the list of people displayed to be incorrect
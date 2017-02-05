class Player{
	constructor(obj={}){
		this.playerName = "";
		this.charName = "";
		this.dutyType = "";
		this.dutyAmount = 0;
		this.id = 0;
		this.min = 0;
		this.max = 0;
		this.rolled = false;

		for(let key in obj){
			this[key] = obj[key];
		}
	}
}

class Party{
	constructor(arr=[]){
		this.members = arr;
		this.campaignName = "";
		this.campaignDescription = "";
		this.totalDuty = this.getTotalDuty();
		this.contributionRank = 0;
	}

	getTotalDuty(){
		let total = 0;
		for(let i = 0; i < this.members.length; i++){
			total += this.members[i].dutyAmount;
		}
		return total;
	}

	addMember(obj = {}){
		this.members.push(new Player(obj));
		this.setIds();
	}

	removeMember(position){
		this.members.splice(position, 1);
		this.setIds();
	}
	sort(){
		this.members.sort(function(a, b){
			return b.dutyAmount - a.dutyAmount;
		});
	}

	setIds(){
		for(let i = 0; i < this.members.length; i++){
			this.members[i].id = i;
		}
	}

	setRanges(){
		this.sort();
		this.setIds();
		let min, max;
		for(let i = 0; i < this.members.length; i++){
			let current = this.members[i];
			if(i !== 0){
				let last = this.members[i-1];
				if(current.dutyAmount > 0){
					min = last.max + 1;
					max = last.max + current.dutyAmount;
				} else {
					min = 0;
					max = 0;
				}
			} else {
				min = 0;
				max = current.dutyAmount;
			}
			current.min = min;
			current.max = max;
		}
	}

	loadFromLS(){
		let loaded = "";
		loaded = localStorage.getItem("partyDuty");
		let newObj = JSON.parse(loaded);

		// Get data from json object
		for(let key in newObj){
			this[key] = newObj[key];
		}

		// Save party members
		if(newObj.hasOwnProperty("members")){
			for(let i = 0; i < newObj.members.length; i++){
				this.members[i] = new Player(newObj.members[i]);
			}
		}
	}

	saveToLS(){
		let output = JSON.stringify(this);
		localStorage.setItem("partyDuty", output);
	}
}

// A function for a 100-sided die
function rollD100(){
	return Math.floor(Math.random() * (100 - 1)) + 1;
}

function viewInfoOnMobile(){
	// Check to see if it's on a mobile device
	let width = window.screen.width;
	if(width <= 768){
		$("#playerList").hide();
		$("#partyInfo").removeClass("hidden-xs");
		$("#partyInfo").show();
	}
}
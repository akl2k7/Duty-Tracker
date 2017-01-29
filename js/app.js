class Player{
	constructor(obj={}){
		this.playerName = "";
		this.charName = "";
		this.dutyType = "";
		this.dutyAmount = 0;
		this.id = 0;
		this.min = 0;
		this.max = 0;

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
				min = last.max + 1;
				max = last.max + current.dutyAmount;
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

// For a list of players
Vue.component("duty-list", {
	template: `<li class="list-group-item" v-on:click="showPlayer">
		<div class="row">
			<div class="col-xs-6"><strong>Player:</strong>{{player.playerName}}</div> 
			<div class="col-xs-6"><strong>Character:</strong> {{player.charName}}</div> 
		</div>
	</li>`,
	props: ["player"],
	methods: {
		showPlayer(){
			app.currentIndex = this.player.id;
			app.currentView = "view-player";
		}
	} 
});

// For a way to view players
Vue.component("view-player", {
	props: ["player"],
	data: function(){
		return {
			party: app.party
		};
	},
	template: `<div>
			<h2>{{player.charName}}</h2>
			<p><strong>Name:</strong> {{player.playerName}}</p>
			<p><strong>Character Name:</strong> {{player.charName}}</p>
			<p><strong>Duty Type:</strong> {{player.dutyType}} <strong>Magnitude:</strong> {{player.dutyAmount}}</p>
			<p><strong>Minimum Roll:</strong> {{player.min}} <strong>Maximum Roll:</strong> {{player.max}}</p>
			<button class="btn btn-default" v-on:click="editPlayer">Edit</button> <button class="btn btn-warning" v-on:click="deletePlayer">Delete</button>
		</div>
	`,
	methods: {
		deletePlayer(){
			this.party.removeMember(app.currentIndex);
			app.currentView = "duty-form";
			this.party.setIds();
			this.party.saveToLS();

		},
		editPlayer(){
			app.currentView = "edit-player";
		}
		
	}
})

// The component for editing players
Vue.component("edit-player", {
	template: `<div>
		<h2>Edit Player</h2>
		<div class="input-group">
			<label>Player Name</label>
			<input type="text" class="form-control" v-model="playerName"/>
		</div>
		<div class="input-group">
			<label>Character Name</label>
			<input type="text" class="form-control" v-model="charName"/>
		</div>
		<div class="input-group">
			<label>Duty Type</label>
			<input type="text" class="form-control" v-model="dutyType"/>
		</div>
		<div class="input-group">
			<label>Duty Amount</label>
			<input type="number" class="form-control" v-model="dutyAmount"/>
		</div>
		<button class="btn btn-default" v-on:click="editPlayer">Submit Edit</button>
	</div>`,
	props:["player", "players"],
	data(){
		return {
			playerName: this.player.playerName,
			charName: this.player.charName,
			dutyType: this.player.dutyType,
			dutyAmount: this.player.dutyAmount,
			id: this.player.id
		};
	},
	methods: {
		editPlayer(){
			let output = new Player({
				playerName: this.playerName,
				charName: this.charName,
				dutyType: this.dutyType,
				dutyAmount: this.dutyAmount
			});
			this.players.splice(this.id, 1, output);
			app.party.setRanges();
			app.party.saveToLS();
		}
	}
});


// Viewing party stats
Vue.component("view-party", {
	template: `<div>
		<h2>Party Info</h2>
		<p><strong>Campaign Name</strong> {{party.campaignName}}</p>
		<p><strong>Campaign Description</strong> {{party.campaignDescription}}</p>
		<p><strong>Contribution Rank</strong> {{party.contributionRank}}</p>
		<ol>
			<li v-for="player in party.members">
			<strong>{{player.playerName}}, {{player.charName}}:</strong> {{player.dutyAmount}}
			</li>
		</ol>
		<button class="btn btn-default" v-on:click="editParty">Edit Party Info</button>
	</div>`,
	props: ["party"],
	methods: {
		editParty(){
			app.currentView = "edit-party";
		}
	}
});

// For editing any party info
Vue.component("edit-party", {
	template: `<div>
		<h2>Edit Party</h2>
		<div class="input-group">
			<label>Campaign Name</label>
			<input type="text" class="form-control" v-model="campaignName"/>
		</div>
		<div class="input-group">
			<label>Campaign Description</label>
			<input type="text" class="form-control" v-model="campaignDescription"/>
		</div>
		<div class='input-group'>
			<label>Contribution Rank</label>
			<input type="number" class="form-control" v-model="contributionRank"/>
		</div>
		<button class="btn btn-default" v-on:click="editParty">Edit Party Info</button>
	</div>`,
	props: ["party"],
	data(){
		return {
			campaignName: this.party.campaignName,
			campaignDescription: this.party.campaignDescription,
			contributionRank: this.party.contributionRank
		}
	},
	methods: {
		editParty(){
			this.party.campaignName = this.campaignName;
			this.party.campaignDescription = this.campaignDescription;
			this.party.contributionRank = this.contributionRank;
			this.party.saveToLS();
			app.currentView = "view-party";
		}
	}
});

var app = new Vue({
	el: "#app",
	data: {
		party: new Party(),
		players: [],
		currentView: "view-party",
		currentIndex: 0,
		rolledDuty: 0
	},
	created(){
		// Check to see if party in localstorage
		let lsData = localStorage.getItem("partyDuty");
		if(lsData !== undefined && lsData !== null){
			this.party.loadFromLS();
		}
		this.party.setRanges();
		this.players = this.party.members;
	},
	methods: {
		addScreen(){
			this.currentView = "duty-form";
		},
		rollDuty(){
			this.rolledDuty = rollD100();
		},
		showPartyInfo(){
			this.currentView = "view-party";
		}
	},
	components: {
		// For adding duties
		"duty-form": {
			template: `<div id="addForm">
				<h2>Add Player</h2>
				<div class="input-group">
					<label>Player Name</label>
					<input type="text" class="form-control" id="addPlayerName" v-model="playerName"/>
				</div>
				<div class="input-group">
					<label>Character Name</label>
					<input type="text" class="form-control" id="addCharName" v-model="charName"/>
				</div>
				<div class="input-group">
					<label>Duty Type</label>
					<input type="text" class="form-control" id="addDutyType" v-model="dutyType"/>
				</div>
				<div class="input-group">
					<label>Duty Amount</label>
					<input type="number" class="form-control" id="addDutyAmount" v-model="dutyAmount"/>
				</div>
				<button class="btn btn-default" id="addToParty" v-on:click="addToParty">Add</button>
			</div>`,
			prop: ["party"],
			data: function(){
				return {
					playerName: "",
					charName: "",
					dutyType: "",
					dutyAmount:0
				};
			},
			methods: {
				addToParty: function(){
					let newPlayer = new Player({
						playerName: this.playerName,
						charName: this.charName,
						dutyType: this.dutyType,
						dutyAmount: this.dutyAmount,
						id: app.party.members.length
					});

					// Save data to array and to localStorage
					app.party.addMember(newPlayer);
					app.party.setRanges();
					app.party.saveToLS();

					// Reinitialize form
					this.playerName = "";
					this.charName = "";
					this.dutyType = "";
					this.dutyAmount = "";
				}
			}
		}
	}
});
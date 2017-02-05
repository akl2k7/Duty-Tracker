



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

			// Check to see if it's on a mobile device
			let width = window.screen.width;
			if(width <= 768){
				$("#playerList").hide();
				$("#partyInfo").removeClass("hidden-xs");
				$("#partyInfo").show();
			}
		},
		rollDuty(){
			let rolled = rollD100();
			this.rolledDuty = rolled;

			// Add a class to whichever player rolled his duty
			for(let i = 0; i < this.players.length; i++){
				let player = this.players[i];

				if(player.max >= rolled && player.min <= rolled){
					player.rolled = true;
				}
				else 
					player.rolled = false;
			}
		},
		showPartyInfo(){
			this.currentView = "view-party";
		},
		showPlayerList(){
			$("#partyInfo").hide();
			$("#playerList").show();
		},
		showParty(){
			$("#playerList").hide();
			$("#partyInfo").removeClass("hidden-xs");
			$("#partyInfo").show();
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
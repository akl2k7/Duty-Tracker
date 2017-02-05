// For a list of players
Vue.component("duty-list", {
	template: `<li class="list-group-item" v-on:click="showPlayer">
		<div class="row">
			<div class="col-xs-6"><strong>Player:</strong>{{player.playerName}}</div> 
			<div class="col-xs-6"><strong>Character:</strong> {{player.charName}}</div>
		</div>
		<div class="row">
			<div class="col-xs-6">
				<strong>Min:</strong> {{player.min}}
			</div>
			<div class="col-xs-6">
				<strong>Max:</strong> {{player.max}}
			</div>
		</div>
	</li>`,
	props: ["player"],
	methods: {
		showPlayer(){
			app.currentIndex = this.player.id;
			app.currentView = "view-player";

			viewInfoOnMobile();
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
		<p><strong>Contribution Rank:</strong> {{party.contributionRank}}</p>
		<p><strong>Total Duty:</strong> {{party.totalDuty}}</p>
		<ol>
			<li v-for="player in party.members">
			<strong>{{player.playerName}}, {{player.charName}}:</strong> {{player.dutyAmount}}
			</li>
		</ol>
		<button class="btn btn-default" v-on:click="editParty">Edit Party Info</button>
	</div>`,
	props: ["party"],
	created(){
		this.party.setRanges();
	},
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
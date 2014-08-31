function calculateHouseholdNumbers (householdIncome) {
	var a = -1.1448557272986259E+05;
	var b = 1.7116920714503912E+00;
	var c = 9.9455703268775757E+00;
	var d = 1.2040212751162155E+01;
	var e = 1.2472883079280314E+03;
	var offset = 1.1854433036504488E+05;
	var totalHouseholds = 118682;
	var numberOfHouseholdsYouAreAbove = (a * Math.exp(-0.5 * Math.pow(Math.log((householdIncome-e)/b) / c, d))) + offset;
	console.log("My household makes more than " + numberOfHouseholdsYouAreAbove + " households in the U.S.");
	var integerPercentile = ((numberOfHouseholdsYouAreAbove/totalHouseholds)*100).toFixed();
	console.log("That puts us in the " + integerPercentile + " percentile.");
	var weAreThePercentile = 100 - integerPercentile;
	console.log("So we are the " + weAreThePercentile + " percent!");
}

function calculateIndividualNumbers (individualIncome) {
	var a = -1.9892619255504850E+05
	var b = 6.7959827660976259E+01
	var c = 5.6872503130798862E+00
	var d = 6.9490982052892383E+00
	var e = 1.1304017233883447E+02
	var offset = 2.4376788483628869E+05
	var totalIndividuals = 243954;
	var numberOfIndividualsYouAreAbove = (a * Math.exp(-0.5 * Math.pow(Math.log((individualIncome-e)/b) / c, d))) + offset;
	console.log("I make more than " + numberOfIndividualsYouAreAbove + " people in the U.S.");
	var integerPercentile = ((numberOfIndividualsYouAreAbove/totalIndividuals)*100).toFixed();
	console.log("That puts me in the " + integerPercentile + " percentile.");
	var iAmThePercentile = 100 - integerPercentile;
	console.log("So I am the " + iAmThePercentile + " percent!");
}
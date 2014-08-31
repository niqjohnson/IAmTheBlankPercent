var blankPercent = (function(){
	var incomeType = 'individualIncome';
	
	function adjustIncome (incomeValue, floor, ceiling) {
		$('body').attr('class', '')
		if (incomeValue < floor) {
			var sanitizedIncome = floor;
			 $('body').addClass('incomeLowerThanFloor');
		}
		else if (incomeValue > ceiling) {
			var sanitizedIncome = ceiling;
			$('body').addClass('incomeHigherThanCeiling');
		}
		else {
			var sanitizedIncome = incomeValue;
		}
		return sanitizedIncome;
	}
	
	function adjustExtremePercentiles (calculatedPercentile) {
		if (calculatedPercentile === 0) {var adjustedPercentile = 1; $('body').addClass('percentileSetTo1');}
		else if (calculatedPercentile === 100) {var adjustedPercentile = 99; $('body').addClass('percentileSetTo99');}
		else {var adjustedPercentile = calculatedPercentile;}
		return adjustedPercentile;
	}
	
	function generateOrdinalEnding (number) {
		if (10 < number && number < 14) return 'th';
		switch (number % 10) {
			case 1: return 'st';
			case 2: return 'nd';
			case 3: return 'rd';
			default: return 'th';
    	}
	}

	function calculateHouseholdNumbers (householdIncome) {
		var a = -1.1448557272986259E+05;
		var b = 1.7116920714503912E+00;
		var c = 9.9455703268775757E+00;
		var d = 1.2040212751162155E+01;
		var e = 1.2472883079280314E+03;
		var offset = 1.1854433036504488E+05;
		var totalHouseholds = 118682000;
		var meanIncome = 67530;
		var numberYouAreAbove = 1000*(Math.round((a * Math.exp(-0.5 * Math.pow(Math.log((householdIncome-e)/b) / c, d))) + offset));
		var integerPercentile = Math.round((numberYouAreAbove/totalHouseholds)*100);
		var integerPercentile = adjustExtremePercentiles(integerPercentile);
		var iAmThePercentile = 100 - integerPercentile;
		var numberYouAreBelow = totalHouseholds - numberYouAreAbove;
		var textSubstitutions = {
			adultOrHousehold: 'household',
			youIndividualOrHousehold: 'Your hosuehold'
		};
		return {meanIncome:meanIncome, numberYouAreAbove:numberYouAreAbove, integerPercentile:integerPercentile, iAmThePercentile:iAmThePercentile, numberYouAreBelow:numberYouAreBelow, textSubstitutions:textSubstitutions};
	}
	
	function calculateIndividualNumbers (individualIncome) {
		var a = 2.4180382432808139E+05
		var b = -8.1881193989106483E+04
		var c = 1.1142124215594478E+05
		var d = -4.4803720002887495E+00
		var offset = -3.4116571244660867E+04
		var totalIndividuals = 208023000;
		var meanIncome = 38913;
		var numberYouAreAbove = 1000*((a * Math.exp(-0.5 * Math.pow((individualIncome-b) / c, d))) + offset);
		var integerPercentile = Math.round((numberYouAreAbove/totalIndividuals)*100);
		var integerPercentile = adjustExtremePercentiles(integerPercentile);
		var iAmThePercentile = 100 - integerPercentile;
		var numberYouAreBelow = totalIndividuals - numberYouAreAbove;
		var textSubstitutions = {
			adultOrHousehold: 'adult',
			youIndividualOrHousehold: 'You'
		};
		return {meanIncome:meanIncome, numberYouAreAbove:numberYouAreAbove, integerPercentile:integerPercentile, iAmThePercentile:iAmThePercentile, numberYouAreBelow:numberYouAreBelow, textSubstitutions:textSubstitutions};
	}
	
	function addCommas (number)
	{
		number += '';
		x = number.split('.');
		x1 = x[0];
		x2 = x.length > 1 ? '.' + x[1] : '';
		var rgx = /(\d+)(\d{3})/;
		while (rgx.test(x1)) {
			x1 = x1.replace(rgx, '$1' + ',' + '$2');
		}
		return x1 + x2;
	}
	
	function prettifyIncomeDisplay (currentIncomeValue) {
		var prettyIncome = addCommas(currentIncomeValue.replace(/[^0-9.]/g, ''));
		return prettyIncome;
	}
	
	return {
		incomeType:incomeType,
		adjustIncome:adjustIncome,
		generateOrdinalEnding:generateOrdinalEnding,
		calculateHouseholdNumbers:calculateHouseholdNumbers,
		calculateIndividualNumbers:calculateIndividualNumbers,
		addCommas:addCommas,
		prettifyIncomeDisplay:prettifyIncomeDisplay
	};
}());

$(document).ready(function() {
	$('#income').focus();
	$('#incomeForm').on('submit', function(event) {
		var sanitizedIncome = Math.round($('#income').val().replace(/[^0-9.]/g,''));
		if (sanitizedIncome == '') {
			$('#income').focus();
			return false;
		}
		if (blankPercent.incomeType === 'individualIncome') {
			var adjustedIncome = blankPercent.adjustIncome(sanitizedIncome, 274, 2000000);
			var incomeHash = blankPercent.calculateIndividualNumbers (adjustedIncome);
		}
		else if (blankPercent.incomeType === 'householdIncome') {
			var adjustedIncome = blankPercent.adjustIncome(sanitizedIncome, 1249, 800000);
			var incomeHash = blankPercent.calculateHouseholdNumbers (adjustedIncome);
		}
		if ($('body').hasClass('incomeLowerThanFloor')) {
			incomeHash.numberYouAreAbove = 'very few';
			incomeHash.integerPercentile = 1;
			incomeHash.iAmThePercentile = 99;
			incomeHash.numberYouAreBelow = 'basically all';
		}
		else if ($('body').hasClass('incomeHigherThanCeiling')) {
			incomeHash.numberYouAreAbove = 'basically all';
			incomeHash.integerPercentile = 99;
			incomeHash.iAmThePercentile = 1;
			incomeHash.numberYouAreBelow = 'very few';
		}
		else {
			incomeHash.numberYouAreAbove = blankPercent.addCommas(Math.round(incomeHash.numberYouAreAbove));
			incomeHash.numberYouAreBelow = blankPercent.addCommas(Math.round(incomeHash.numberYouAreBelow));
		}
		$('#averageIncome').text(blankPercent.addCommas(incomeHash.meanIncome));
		$('.adultOrHousehold').text(incomeHash.textSubstitutions.adultOrHousehold);
		$('.youIndividualOrHousehold').text(incomeHash.textSubstitutions.youIndividualOrHousehold);
		if (sanitizedIncome > incomeHash.meanIncome) {
			var averageIncomeDifference = '$' + (sanitizedIncome - incomeHash.meanIncome) + ' more than';
		}
		else if (sanitizedIncome < incomeHash.meanIncome) {
			var averageIncomeDifference = '$' + (incomeHash.meanIncome - sanitizedIncome) + ' less than';
		}
		else {
			var averageIncomeDifference = 'exactly the same as';
		}
		$('#averageDifference').text(blankPercent.addCommas(averageIncomeDifference));
		$('#numberBelow').text(incomeHash.numberYouAreAbove);
		$('#percentile').text(incomeHash.integerPercentile).append(blankPercent.generateOrdinalEnding(incomeHash.integerPercentile));
		$('#numberAbove').text(incomeHash.numberYouAreBelow);
		$('#reversePercentile').text(incomeHash.iAmThePercentile);
		$('#incomeFormIntro, #incomeFormInstructions').fadeTo(300, 0);
		$('#detailsIntro').fadeIn(300);
		$('#details').fadeOut(0);
		$('#incomeForm').animate({'margin-top': -470, 'margin-bottom': 350, 'padding-left': 42}, 400, function () {
			$('#calculate').css('background-position', 'center -41px');
			var rollPercentileDelay = setTimeout(function() {
				var currentPercentile = 1;
				var rollUpInterval = setInterval(function() {
					$('#percentText').text(currentPercentile);
					if (currentPercentile === 1) {
						$('#percentText').attr('class', 'calculated');
					}
					if (currentPercentile < incomeHash.iAmThePercentile) {
						currentPercentile++;
					}
					else {
						clearInterval(rollUpInterval);
						var detailsFadeInDelay = setTimeout(function () {
							$('#details').fadeIn(400);
						}, 600);
					}
				}, 500/incomeHash.iAmThePercentile);
			}, 600);
		});
		event.preventDefault();
	});
	
	$('#income').on('keyup', function(event) {
		var keyPressed = event.which;
		if ((keyPressed >= 48 && keyPressed <= 57) || keyPressed === 8 || keyPressed === 188 || keyPressed === 190) {
			$(this).val(blankPercent.prettifyIncomeDisplay($(this).val()))
		}
		else {
			return false;
		}
	});
	
	$('#main').on('click', 'a.incomeTypeSelector', function (event) {
		var triggerPosition = $(this).offset(),
			triggerWidth = $(this).width();
		$('#selectIncomeType').css({
			display: 'block',
			left: triggerPosition.left-12,
			top: triggerPosition.top-5,
			width: triggerWidth});
		event.preventDefault();
	});
	
	$('#selectIncomeType').on('click', 'a', function (event) {
		var selectedIncomeType = $(this).attr('id');
		$(this).attr('class', 'selectedIncomeType').siblings('a').attr('class', '');
		blankPercent.incomeType = selectedIncomeType;
		$('#selectIncomeType').css({display: 'none'});
		if (selectedIncomeType === 'householdIncome') {
			$('#incomeFormIntro .incomeTypeSelector').text('your household earns in one year');
			$('.instructionsSubject').text('everyone in your household');
		}
		else {
			$('#incomeFormIntro .incomeTypeSelector').text('you earn in one year');
			$('.instructionsSubject').text('just you');
		}
		$('#income').focus();
		event.preventDefault();
	});
	
	$('#showCalculationDetails').on('click', function(event) {
		$(this).hide();
		$('#about-the-calculations').show();
		event.preventDefault();
	});
	
});
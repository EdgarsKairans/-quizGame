export default function pullOutSelectedRegion(menuSelected, allCountries) {
	let selectedRegionCountries = [];
	let countriesFilter;
	switch (menuSelected[0]) {
		case "All Countries":
			selectedRegionCountries = [...allCountries];
			break;
		case "Europe":
			countriesFilter = allCountries.filter((elem) => elem[2] == "Europe");
			selectedRegionCountries = [...countriesFilter];
			break;
		case "America":
			countriesFilter = allCountries.filter((elem) => elem[2] == "America");
			selectedRegionCountries = [...countriesFilter];
			break;
		case "Africa":
			countriesFilter = allCountries.filter((elem) => elem[2] == "Africa");
			selectedRegionCountries = [...countriesFilter];
			break;
		case "Asia":
			countriesFilter = allCountries.filter((elem) => elem[2] == "Asia");
			selectedRegionCountries = [...countriesFilter];
			break;
		case "Oceania":
			countriesFilter = allCountries.filter((elem) => elem[2] == "Oceania");
			selectedRegionCountries = [...countriesFilter];
			break;
		default:
			console.log("error");
	}

	return selectedRegionCountries;
}

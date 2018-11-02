class TestData {

	constructor(testdata) {
		this.testdata = testdata;
	}
//this is a generic method which is responsibe to find the actual dataset based on the identifier provided in step definition.(e.g basiccontacttest )
	getAsset(testDataObj) {
		const actualAsset = this.testdata.select('//Contact/*[@testidentifier="'+testDataObj+'"]');
		return actualAsset;
	}

	getAssetOrg(testDataObj) {
		const actualAsset = this.testdata.select('//Organisation/*[@testidentifier="'+testDataObj+'"]');
		return actualAsset;
	}

	getB2CObjectID(testDataObj) {
		const actualAsset = this.getAsset(testDataObj);
		return actualAsset.b2cobjectid;
	}

	getTitle(testDataObj) {
		const actualAsset = this.getAsset(testDataObj);
		return actualAsset.title;
	}

	
	getFirstName(testDataObj) {
		const actualAsset = this.getAsset(testDataObj);
		return actualAsset.firstname;
	}

	
	getMiddleName(testDataObj) {
		const actualAsset = this.getAsset(testDataObj);
		return actualAsset.middlename;
	}

	
	getLastName(testDataObj) {
		const actualAsset = this.getAsset(testDataObj);
		return actualAsset.lastname;
	}

	
	getDOB(testDataObj) {
		const actualAsset = this.getAsset(testDataObj);
		return actualAsset.dob;
	}

	
	getGender(testDataObj) {
		const actualAsset = this.getAsset(testDataObj);
		return actualAsset.gender;
	}

	
	getTelephone(testDataObj) {
		const actualAsset = this.getAsset(testDataObj);
		return actualAsset.telephone;
	}

	
	getType(testDataObj) {
		const actualAsset = this.getAsset(testDataObj);
		return actualAsset.type;
	}


	
	getUPRN(testDataObj) {
		const actualAsset = this.getAsset(testDataObj);
		return actualAsset.uprn;
	}

	
	getBuildingName(testDataObj) {
		const actualAsset = this.getAsset(testDataObj);
		return actualAsset.buildingname;
	}

	
	getBuildingNumber(testDataObj) {
		const actualAsset = this.getAsset(testDataObj);
		return actualAsset.buildingnumber;
	}

	
	getStreet(testDataObj) {
		const actualAsset = this.getAsset(testDataObj);
		return actualAsset.street;
	}

	
	getLocality(testDataObj) {
		const actualAsset = this.getAsset(testDataObj);
		return actualAsset.locality;
	}

	
	getTown(testDataObj) {
		const actualAsset = this.getAsset(testDataObj);
		return actualAsset.town;
	}

	
	getPostcode(testDataObj) {
		const actualAsset = this.getAsset(testDataObj);
		return actualAsset.postcode;
	}

	
	getCountry(testDataObj) {
		const actualAsset = this.getAsset(testDataObj);
		return actualAsset.country;
	}

	
	getFromCompaniesHouse(testDataObj) {
		const actualAsset = this.getAsset(testDataObj);
		return actualAsset.fromcompanieshouse;
	}

	getorgv1name(testDataObj) {
		const actualAsset = this.getAssetOrg(testDataObj);
		return actualAsset.orgv1name;
	}
	getorgv1type(testDataObj) {
		const actualAsset = this.getAssetOrg(testDataObj);
		return actualAsset.orgv1type;
	}
	getorgv1crn(testDataObj) {
		const actualAsset = this.getAssetOrg(testDataObj);
		return actualAsset.orgv1crn;
	}
	getorgv1email(testDataObj) {
		const actualAsset = this.getAssetOrg(testDataObj);
		return actualAsset.orgv1email;
	}
	getorgv1telephone(testDataObj) {
		const actualAsset = this.getAssetOrg(testDataObj);
		return actualAsset.orgv1telephone;
	}
	getorgv1valwithcompanieshouse(testDataObj) {
		const actualAsset = this.getAssetOrg(testDataObj);
		return actualAsset.orgv1valwithcompanieshouse;
	}
	getorgv1addtype(testDataObj) {
		const actualAsset = this.getAssetOrg(testDataObj);
		return actualAsset.orgv1addtype;
	}
	getorgv1adduprn(testDataObj) {
		const actualAsset = this.getAssetOrg(testDataObj);
		return actualAsset.orgv1adduprn;
	}
	getorgv1addbuildingname(testDataObj) {
		const actualAsset = this.getAssetOrg(testDataObj);
		return actualAsset.orgv1addbuildingname;
	}
	getorgv1addbuildingno(testDataObj) {
		const actualAsset = this.getAssetOrg(testDataObj);
		return actualAsset.orgv1addbuildingno;
	}
	getorgv1addstreet(testDataObj) {
		const actualAsset = this.getAssetOrg(testDataObj);
		return actualAsset.orgv1addstreet;
	}
	getorgv1addlocality(testDataObj) {
		const actualAsset = this.getAssetOrg(testDataObj);
		return actualAsset.orgv1addlocality;
	}
	getorgv1town(testDataObj) {
		const actualAsset = this.getAssetOrg(testDataObj);
		return actualAsset.orgv1town;
	}
	getorgv1county(testDataObj) {
		const actualAsset = this.getAssetOrg(testDataObj);
		return actualAsset.orgv1county;
	}
	getorgv1dependentlocality(testDataObj) {
		const actualAsset = this.getAssetOrg(testDataObj);
		return actualAsset.orgv1dependentlocality;
	}
	getorgv1subbuildingname(testDataObj) {
		const actualAsset = this.getAssetOrg(testDataObj);
		return actualAsset.orgv1subbuildingname;
	}
	getorgv1postcode(testDataObj) {
		const actualAsset = this.getAssetOrg(testDataObj);
		return actualAsset.orgv1postcode;
	}
	getorgv1country(testDataObj) {
		const actualAsset = this.getAssetOrg(testDataObj);
		return actualAsset.orgv1country;
	}
	getorgv1fromcompanieshouse(testDataObj) {
		const actualAsset = this.getAssetOrg(testDataObj);
		return actualAsset.orgv1fromcompanieshouse;
	}
	
}

module.exports.TestData = TestData;

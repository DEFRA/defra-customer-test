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

	getCustID(testDataObj) {
		const actualAsset = testDataObj;
		return actualAsset;
	}
	getIsCitizen(testDataObj) {
		const actualAsset = this.getAsset(testDataObj);
		return actualAsset.isCitizen;
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

	getSource(testDataObj) {
		const actualAsset = this.getAsset(testDataObj);
		return actualAsset.source;
	}

	getEmail(testDataObj) {
		const actualAsset = this.getAsset(testDataObj);
		return actualAsset.email;
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

	getTacsacceptedversion(testDataObj) {
		const actualAsset = this.getAsset(testDataObj);
		return actualAsset.tacsacceptedversion;
	}

	getTacsacceptedone(testDataObj) {
		const actualAsset = this.getAsset(testDataObj);
		return actualAsset.tacsacceptedon;
	}

	getPrivacypolicyacceptedversion(testDataObj) {
		const actualAsset = this.getAsset(testDataObj);
		return actualAsset.privacypolicyacceptedversion;
	}

	getPrivacypolicyacceptedon(testDataObj) {
		const actualAsset = this.getAsset(testDataObj);
		return actualAsset.privacypolicyacceptedon;
	}

	getCookiespolicyacceptedversion(testDataObj) {
		const actualAsset = this.getAsset(testDataObj);
		return actualAsset.cookiespolicyacceptedversion;
	}

	getCookiespolicyacceptedon(testDataObj) {
		const actualAsset = this.getAsset(testDataObj);
		return actualAsset.cookiespolicyacceptedon;
	}

	getCounty(testDataObj) {
		const actualAsset = this.getAsset(testDataObj);
		return actualAsset.county;
	}

	getDependentlocality(testDataObj) {
		const actualAsset = this.getAsset(testDataObj);
		return actualAsset.dependentlocality;
	}

	getSubbuildingname(testDataObj) {
		const actualAsset = this.getAsset(testDataObj);
		return actualAsset.subbuildingname;
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

	getLOBserviceID(testDataObj) {
		const actualAsset = this.getAsset(testDataObj);
		return actualAsset.lobserviceid;
	}

	getOrgIsUK(testDataObj) {
		const actualAsset = this.getAssetOrg(testDataObj);
		return actualAsset.orgIsUK;
}
	getOrgName(testDataObj) {
		const actualAsset = this.getAssetOrg(testDataObj);
		return actualAsset.orgName;
	}
	getOrgType(testDataObj) {
		const actualAsset = this.getAssetOrg(testDataObj);
		return actualAsset.orgType;
	}
	getCharityNo(testDataObj) {
		const actualAsset = this.getAssetOrg(testDataObj);
		return actualAsset.charityNo;
	}
	getCharityNoEnW(testDataObj) {
		const actualAsset = this.getAssetOrg(testDataObj);
		return actualAsset.charityNoEnW;
	}
	getCharityNoNI(testDataObj) {
		const actualAsset = this.getAssetOrg(testDataObj);
		return actualAsset.charityNoNI;
	}
	getCharityNoScot(testDataObj) {
		const actualAsset = this.getAssetOrg(testDataObj);
		return actualAsset.charityNoScot;
	}
	getOrgCRN(testDataObj) {
		const actualAsset = this.getAssetOrg(testDataObj);
		return actualAsset.orgCRN;
	}
	getOrgEmail(testDataObj) {
		const actualAsset = this.getAssetOrg(testDataObj);
		return actualAsset.orgEmail;
	}
	getOrgTelephone(testDataObj) {
		const actualAsset = this.getAssetOrg(testDataObj);
		return actualAsset.orgTelephone;
	}
	getOrgValWithCompaniesHouse(testDataObj) {
		const actualAsset = this.getAssetOrg(testDataObj);
		return actualAsset.orgValWithCompaniesHouse;
	}
	getOrgAddType(testDataObj) {
		const actualAsset = this.getAssetOrg(testDataObj);
		return actualAsset.orgAddType;
	}
	getOrgAdduprn(testDataObj) {
		const actualAsset = this.getAssetOrg(testDataObj);
		return actualAsset.orgAdduprn;
	}


	getOrgRegBuildingName(testDataObj) {
		const actualAsset = this.getAssetOrg(testDataObj);
		return actualAsset.orgRegaddbuildingname;
	}
	getOrgRegBuildingNo(testDataObj) {
		const actualAsset = this.getAssetOrg(testDataObj);
		return actualAsset.orgRegaddbuildingno;
	}
	getOrgRegSubBuildingName(testDataObj) {
		const actualAsset = this.getAssetOrg(testDataObj);
		return actualAsset.orgRegsubbuildingname;
	}
	getOrgRegStreet(testDataObj) {
		const actualAsset = this.getAssetOrg(testDataObj);
		return actualAsset.orgRegaddstreet;
	}
	getOrgRegLocality(testDataObj) {
		const actualAsset = this.getAssetOrg(testDataObj);
		return actualAsset.orgRegaddlocality;
	}
	getOrgRegCounty(testDataObj) {
		const actualAsset = this.getAssetOrg(testDataObj);
		return actualAsset.orgRegcounty;
	}
	getOrgRegTown(testDataObj) {
		const actualAsset = this.getAssetOrg(testDataObj);
		return actualAsset.orgRegtown;
	}
	getOrgRegCountry(testDataObj) {
		const actualAsset = this.getAssetOrg(testDataObj);
		return actualAsset.orgRegcountry;
	}
	getOrgRegPostcode(testDataObj) {
		const actualAsset = this.getAssetOrg(testDataObj);
		return actualAsset.orgRegpostcode;
	}

	getOrgCorBuildingName(testDataObj) {
		const actualAsset = this.getAssetOrg(testDataObj);
		return actualAsset.orgCoraddbuildingname;
	}
	getOrgCorBuildingNo(testDataObj) {
		const actualAsset = this.getAssetOrg(testDataObj);
		return actualAsset.orgCoraddbuildingno;
	}
	getOrgCorSubBuildingName(testDataObj) {
		const actualAsset = this.getAssetOrg(testDataObj);
		return actualAsset.orgCorsubbuildingname;
	}
	getOrgCorStreet(testDataObj) {
		const actualAsset = this.getAssetOrg(testDataObj);
		return actualAsset.orgCoraddstreet;
	}
	getOrgCorLocality(testDataObj) {
		const actualAsset = this.getAssetOrg(testDataObj);
		return actualAsset.orgCoraddlocality;
	}
	getOrgCorCounty(testDataObj) {
		const actualAsset = this.getAssetOrg(testDataObj);
		return actualAsset.orgCorcounty;
	}
	getOrgCorTown(testDataObj) {
		const actualAsset = this.getAssetOrg(testDataObj);
		return actualAsset.orgCortown;
	}
	getOrgCorCountry(testDataObj) {
		const actualAsset = this.getAssetOrg(testDataObj);
		return actualAsset.orgCorcountry;
	}
	getOrgCorPostcode(testDataObj) {
		const actualAsset = this.getAssetOrg(testDataObj);
		return actualAsset.orgCorpostcode;
	}



	getOrgDependentLocality(testDataObj) {
		const actualAsset = this.getAssetOrg(testDataObj);
		return actualAsset.orgDependentLocality;
	}
	
	getOrgFromCompaniesHouse(testDataObj) {
		const actualAsset = this.getAssetOrg(testDataObj);
		return actualAsset.fromcompanieshouse;
	}

	
}

module.exports.TestData = TestData;

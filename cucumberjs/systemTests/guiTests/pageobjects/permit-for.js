const webdriver = require("selenium-webdriver");
const By = webdriver.By;
const until = webdriver.until;

class PermitFor {

    constructor(browser, testdata) {
        this.browser = browser;
        this.testdata = testdata;
    }

    async waitUntilLoaded(title) {
        return this.browser.wait(until.elementLocated(By.id("page-heading")), 5 * 20000);
    }


    //Limited company
    async limitedCompanyRadio() {
        return this.browser.wait(until.elementLocated(By.id("chosen-holder-limited-company-input")), 5 * 20000);
    }


    //Individual or sole trader
    async individualTraderRadio() {
        return this.browser.wait(until.elementLocated(By.id("chosen-holder-individual-input")), 5 * 20000);
    }


    //Local authority or public body
    async localAuthorityRadio() {
        return this.browser.wait(until.elementLocated(By.id("chosen-holder-local-authority-input")), 5 * 20000);
    }


    //Partnership
    async partnershipRadio() {
        return this.browser.wait(until.elementLocated(By.id("chosen-holder-partnership-input")), 5 * 20000);
    }


    //Registered charity
    async registeredCharityRadio() {
        return this.browser.wait(until.elementLocated(By.id("chosen-holder-registered-charity-input")), 5 * 20000);
    }


    //Limited liability partnership
    async limitedLiabilityPartnershipRadio() {
        return this.browser.wait(until.elementLocated(By.id("chosen-holder-limited-liability-partnership-input")), 5 * 20000);
    }


    //Other organisation, for example a club or association
    async otherOrganisationRadio() {
        return this.browser.wait(until.elementLocated(By.id("chosen-holder-other-organisation-input")), 5 * 20000);
    }

    /////////

    //Anaerobic digestion including storing digestate
    async anaerobicDigestionRadio() {
        return this.browser.wait(until.elementLocated(By.id("chosen-category-anaerobic-input")), 5 * 20000);
    }


    //Car and vehicle dismantling
    async carDismantlingRadio() {
        return this.browser.wait(until.elementLocated(By.id("chosen-category-car-input")), 5 * 20000);
    }


    //Composting, sewage or sludge treatment, biogas
    async compostRadio() {
        return this.browser.wait(until.elementLocated(By.id("chosen-category-composting-input")), 5 * 20000);
    }


    //Deposit for recovery
    async depositOfRecoveryRadio() {
        return this.browser.wait(until.elementLocated(By.id("chosen-category-deposit-input")), 5 * 20000);
    }


    //Electrical insulating oil storage
    async electricalInsulatingRadio() {
        return this.browser.wait(until.elementLocated(By.id("chosen-category-electrical-input")), 5 * 20000);
    }


    //Metal recycling, scrap metal and WEEE not cars or vehicles
    async metalRecyclingRadio() {
        return this.browser.wait(until.elementLocated(By.id("chosen-category-metal-input")), 5 * 20000);
    }


    //Mining, oil and gas
    async miningRadio() {
        return this.browser.wait(until.elementLocated(By.id("chosen-category-mining-input")), 5 * 20000);
    }


    //Mobile plant for land-spreading or treatment
    async mobileLandSpreadingRadio() {
        return this.browser.wait(until.elementLocated(By.id("chosen-category-mobile-input")), 5 * 20000);
    }

    //---------------------------------


    //Storage or treatment of waste recycling, dredgings, clinical, soil or wood treatment
    async storageTreatmentRecyclingRadio() {
        return this.browser.wait(until.elementLocated(By.id("chosen-category-storage-input")), 5 * 20000);
    }

    //Waste transfer station or amenity site with or without treatment
    async wasteTransferStationRadio() {
        return this.browser.wait(until.elementLocated(By.id("chosen-category-transfer-input")), 5 * 20000);
    }

    async depositForRecoveryRadio() {
        return this.browser.wait(until.elementLocated(By.id("chosen-category-deposit-input")), 5 * 20000);
    }


    async dummyCategoryRadio() {
        return this.browser.wait(until.elementLocated(By.id("chosen-category-dummy-input")), 5 * 20000);
    }

    async dummyCategoryLabel() {
        return this.browser.wait(until.elementLocated(By.id("chosen-category-dummy-label")), 5 * 20000);
    }

    async floodRiskActivitiesRadio() {
        return this.browser.wait(until.elementLocated(By.id("chosen-category-flood-input")), 5 * 20000);
    }

    async floodRiskActivitiesLabel() {
        return this.browser.wait(until.elementLocated(By.id("chosen-category-flood-label")), 5 * 8000);
    }

    //Radioactive substances for non-nuclear sites
    async radioactiveSubstanceNonNuclearSiteRadio(title) {
        return this.browser.wait(until.elementLocated(By.id("chosen-category-radioactive-input")), 5 * 20000);
    }

    async radioactiveSubstanceNonNuclearSiteLabel() {
        return this.browser.wait(until.elementLocated(By.id("chosen-category-radioactive-label")), 5 * 20000);
    }

    async waterDischargesRadio() {
        return this.browser.wait(until.elementLocated(By.id("chosen-category-water-input")), 5 * 20000);
    }

    async waterDischargesLabel() {
        return this.browser.wait(until.elementLocated(By.id("chosen-category-water-label")), 5 * 8000);
    }

    async cantFindPermitLink() {
        return this.browser.wait(until.elementLocated(By.id("summary")), 5 * 8000);
    }

    async compostSewageBiogasRadio() {
        return this.browser.wait(until.elementLocated(By.id("chosen-category-composting-input")), 5 * 20000);
    }
  
    async electricalRadio() {
        return this.browser.wait(until.elementLocated(By.id("chosen-category-electrical-input")), 5 * 20000);
    }

}

module.exports.PermitFor = PermitFor;
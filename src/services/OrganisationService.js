const LS_ORG_KEY = 'LS_ORG';
const ORGANISATIONS = require('../data/organisations.json');

export class OrganisationService {
    constructor() {
        this.init();
    }

    getOrganisations() {
        try {
            const orgsStr = localStorage.getItem(LS_ORG_KEY);
            return JSON.parse(orgsStr);
        } catch {
            return [];
        }
    }

    init() {
        const orgsStr = localStorage.getItem(LS_ORG_KEY);
        if (orgsStr) return JSON.parse(orgsStr);

        localStorage.setItem(LS_ORG_KEY, JSON.stringify(ORGANISATIONS));
    }
}

export default new OrganisationService();
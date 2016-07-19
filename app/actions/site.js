export const SELECT_SITE = "SELECT_SITE";

export function selectSite (site) {
    return {
        type: SELECT_SITE,
        payload: site
    };
}

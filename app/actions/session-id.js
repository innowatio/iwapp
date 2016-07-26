export const GENERATE_SESSION_ID = "GENERATE_SESSION_ID";

export function generateSessionId (userId) {
    return {
        type: GENERATE_SESSION_ID,
        payload: `${userId}-${new Date().toISOString()}`
    };
}

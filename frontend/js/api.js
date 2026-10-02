
/**
 * CHUKA TOURNAMENT HUB API
 */


/**
 * Google Apps Script Web App URL.
 */
const API_URL =
    "https://script.google.com/macros/s/AKfycbzuwPWdVqPdc-mdqUyRoJmM_2JA0sLFperKtDfxuyET4bmR1YgwM5l9-yThkLTQnBAM/exec";


/**
 * Send a request to the Chuka backend.
 *
 * Authentication tokens are supplied
 * by the caller when an endpoint
 * requires Firebase authentication.
 */
export async function apiRequest(
    action,
    data = {}
) {

    const response =
        await fetch(
            API_URL,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "text/plain;charset=utf-8"
                },

                body:
                    JSON.stringify({

                        action,

                        ...data

                    })

            }
        );


    if (!response.ok) {

        throw new Error(
            `API request failed: ${response.status}`
        );

    }


    const result =
        await response.json();


    if (
        result &&
        result.success === false
    ) {

        throw new Error(
            result.error ||
            "Chuka API request failed."
        );

    }


    return result;

}

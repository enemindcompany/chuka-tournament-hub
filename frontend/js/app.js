
/**
 * CHUKA TOURNAMENT HUB
 *
 * Main frontend application.
 */


import {
    signInWithGoogle,
    logout,
    watchAuthState,
    getFirebaseIdToken
} from "./auth.js";


import {
    apiRequest
} from "./api.js";

const PUBLIC_DASHBOARD_API = "https://script.google.com/macros/s/AKfycbzuwPWdVqPdc-mdqUyRoJmM_2JA0sLFperKtDfxuyET4bmR1YgwM5l9-yThkLTQnBAM/exec";



/* =========================================================
   DOM ELEMENTS
   ========================================================= */


/* Auth */

const authScreen =
    document.getElementById(
        "auth-screen"
    );

const dashboardScreen =
    document.getElementById(
        "dashboard-screen"
    );

const googleSignInButton =
    document.getElementById(
        "google-sign-in"
    );

const logoutButton =
    document.getElementById(
        "logout-button"
    );

const authMessage =
    document.getElementById(
        "auth-message"
    );


/* Dashboard */

const dashboardPlayerName =
    document.getElementById(
        "dashboard-player-name"
    );

const welcomePlayerName =
    document.getElementById(
        "welcome-player-name"
    );


/* Tournament */

const tournamentName =
    document.getElementById(
        "tournament-name"
    );

const tournamentStatus =
    document.getElementById(
        "tournament-status"
    );

const registeredCount =
    document.getElementById(
        "registered-count"
    );

const slotsRemaining =
    document.getElementById(
        "slots-remaining"
    );

const registerButton =
    document.getElementById(
        "register-button"
    );

const tournamentImage =
    document.getElementById(
        "tournament-image"
    );


/* Registration */

const registrationSection =
    document.getElementById(
        "registration-section"
    );

const registrationForm =
    document.getElementById(
        "registration-form"
    );

const registrationGoogleAccount =
    document.getElementById(
        "registration-google-account"
    );

const registrationPlayerName =
    document.getElementById(
        "registration-player-name"
    );

const efootballUsername =
    document.getElementById(
        "efootball-username"
    );

const whatsappNumber =
    document.getElementById(
        "whatsapp-number"
    );

const mpesaName =
    document.getElementById(
        "mpesa-name"
    );

const registrationMessage =
    document.getElementById(
        "registration-message"
    );

const submitRegistrationButton =
    document.getElementById(
        "submit-registration"
    );

const cancelRegistrationButton =
    document.getElementById(
        "cancel-registration"
    );


/* Payment */

const paymentStatusSection =
    document.getElementById(
        "payment-status-section"
    );

const paymentStatusBadge =
    document.getElementById(
        "payment-status-badge"
    );

const paymentStatusText =
    document.getElementById(
        "payment-status-text"
    );

const claimPaymentButton =
    document.getElementById(
        "claim-payment-button"
    );

const paymentClaimMessage =
    document.getElementById(
        "payment-claim-message"
    );

/* Admin dashboard */
const adminSection = document.getElementById("admin-section");
const adminMessage = document.getElementById("admin-message");
const paymentClaimsList = document.getElementById("payment-claims-list");
const refreshPaymentClaimsButton = document.getElementById("refresh-payment-claims");
const adminRegisteredCount = document.getElementById("admin-registered-count");
const adminPendingCount = document.getElementById("admin-pending-count");
const adminActiveCount = document.getElementById("admin-active-count");
const adminSlotsCount = document.getElementById("admin-slots-count");
const adminPlayersList = document.getElementById("admin-players-list");
const adminTournamentImagePreview = document.getElementById("admin-tournament-image-preview");
const adminImageEmpty = document.getElementById("admin-image-empty");
const tournamentImageFile = document.getElementById("tournament-image-file");
const tournamentImageUrl = document.getElementById("tournament-image-url");
const uploadTournamentImageButton = document.getElementById("upload-tournament-image");
const saveTournamentImageUrlButton = document.getElementById("save-tournament-image-url");
const adminImageMessage = document.getElementById("admin-image-message");
const whatsappNormalUrl = document.getElementById("whatsapp-normal-url");
const whatsappResultsUrl = document.getElementById("whatsapp-results-url");
const whatsappAdminUpdatesUrl = document.getElementById("whatsapp-admin-updates-url");
const saveWhatsAppGroupsButton = document.getElementById("save-whatsapp-groups");
const whatsappGroupsMessage = document.getElementById("whatsapp-groups-message");
const whatsappNormalLink = document.getElementById("whatsapp-normal-link");
const whatsappResultsLink = document.getElementById("whatsapp-results-link");
const whatsappAdminUpdatesLink = document.getElementById("whatsapp-admin-updates-link");
const whatsappGroupsPublicMessage = document.getElementById("whatsapp-groups-public-message");
const generateFixturesButton = document.getElementById("generate-fixtures-button");
const refreshFixturesButton = document.getElementById("refresh-fixtures-button");
const refreshPublicFixturesButton = document.getElementById("refresh-public-fixtures");
const fixturesMessage = document.getElementById("fixtures-message");
const fixtureRounds = document.getElementById("fixture-rounds");
const ADMIN_EMAIL = "wayongohlaurence@gmail.com";



/* =========================================================
   APPLICATION STATE
   ========================================================= */


let currentUser =
    null;


let currentTournament =
    null;

let currentTournamentRegistration = null;
let isAdminUser = false;



/* =========================================================
   INITIALIZATION
   ========================================================= */


console.log(
    "Chuka Tournament Hub initialized."
);


/* =========================================================
   AUTHENTICATION
   ========================================================= */


/**
 * Google sign-in.
 */
if (googleSignInButton) {

    googleSignInButton.addEventListener(
        "click",
        async () => {

            try {

                authMessage.textContent =
                    "Signing in...";

                googleSignInButton.disabled =
                    true;


                const user =
                    await signInWithGoogle();


                console.log(
                    "Chuka Google user:",
                    {
                        uid:
                            user.uid,

                        email:
                            user.email,

                        displayName:
                            user.displayName
                    }
                );


                authMessage.textContent =
                    "";


            } catch (error) {

                console.error(
                    "Google sign-in failed:",
                    error
                );


                authMessage.textContent =
                    error.message ||
                    "Google sign-in failed.";


                googleSignInButton.disabled =
                    false;

            }

        }
    );

}


/**
 * Logout.
 */
if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        async () => {

            try {

                await logout();

            } catch (error) {

                console.error(
                    "Logout failed:",
                    error
                );

            }

        }
    );

}


/**
 * Firebase authentication state.
 */
watchAuthState(
    async (user) => {

        if (user) {

            currentUser =
                user;


            console.log(
                "Authenticated Chuka player:",
                {
                    uid:
                        user.uid,

                    email:
                        user.email,

                    displayName:
                        user.displayName
                }
            );


            showDashboard(
                user
            );


            /**
             * Confirm that the Firebase
             * ID token is accepted by
             * the backend.
             */
            const authResult = await testFirebaseBackendAuth();

            // Admin UI is a convenience only; the Apps Script backend independently
            // enforces the same admin email for every privileged action.
            const signedInEmail = String((authResult && authResult.user && authResult.user.email) || user.email || "")
                .trim().toLowerCase();
            const isAdmin = signedInEmail === ADMIN_EMAIL;
            isAdminUser = isAdmin;

            if (adminSection) {
                adminSection.classList.toggle("hidden", !isAdmin);
            }

            /**
             * Load the active tournament.
             */
            await loadCurrentTournament();

            if (isAdmin) {
                if (registerButton) registerButton.classList.add("hidden");
                if (paymentStatusSection) paymentStatusSection.classList.add("hidden");
                await loadAdminOverview();
                await loadPaymentClaims();
                await loadAdminTournamentPlayers();
                await loadTournamentFixtures();
            } else {
                if (registerButton) registerButton.classList.remove("hidden");
                await loadTournamentFixtures();
            }


        } else {

            currentUser =
                null;

            isAdminUser = false;
            if (registerButton) registerButton.classList.remove("hidden");
            if (adminSection) adminSection.classList.add("hidden");
            if (paymentClaimsList) paymentClaimsList.innerHTML = "";

            showAuthScreen();

        }

    }
);



/* =========================================================
   SCREEN MANAGEMENT
   ========================================================= */


/**
 * Show authentication screen.
 */
function showAuthScreen() {

    if (authScreen) {

        authScreen.classList.remove(
            "hidden"
        );

    }


    if (dashboardScreen) {

        dashboardScreen.classList.add(
            "hidden"
        );

    }

}


/**
 * Show dashboard.
 */
function showDashboard(
    user
) {

    if (authScreen) {

        authScreen.classList.add(
            "hidden"
        );

    }


    if (dashboardScreen) {

        dashboardScreen.classList.remove(
            "hidden"
        );

    }


    const displayName =
        user.displayName ||
        "Chuka Player";


    if (dashboardPlayerName) {

        dashboardPlayerName.textContent =
            displayName;

    }


    if (welcomePlayerName) {

        welcomePlayerName.textContent =
            displayName;

    }

}



/* =========================================================
   FIREBASE BACKEND AUTH TEST
   ========================================================= */


/**
 * Test the secure Firebase
 * authentication endpoint.
 */
async function testFirebaseBackendAuth() {

    try {

        const idToken =
            await getFirebaseIdToken();


        const result =
            await apiRequest(
                "testAuth",
                {
                    idToken:
                        idToken
                }
            );


        console.log(
            "Firebase backend authentication successful:",
            result.user
        );


        return result;


    } catch (error) {

        console.error(
            "Firebase backend authentication failed:",
            error
        );


        return null;

    }

}



/* =========================================================
   TOURNAMENT
   ========================================================= */


/**
 * Load current tournament.
 */
async function loadCurrentTournament() {

    try {

        const result =
            await apiRequest(
                "getCurrentTournament"
            );


        if (
            !result ||
            !result.success ||
            !result.tournament
        ) {

            throw new Error(
                "No current tournament is available."
            );

        }


        currentTournament =
            result.tournament;


        renderTournament(
            currentTournament
        );
        await loadMyTournamentRegistration();


    } catch (error) {

        console.error(
            "Unable to load current tournament:",
            error
        );


        if (tournamentName) {

            tournamentName.textContent =
                "Tournament unavailable";

        }


        if (slotsRemaining) {

            slotsRemaining.textContent =
                error.message;

        }

    }

}


/**
 * Render tournament information.
 */
function renderTournament(
    tournament
) {

    const name =
        tournament.name ||
        "Chuka Tournament";


    const maxPlayers =
        Number(
            tournament.max_players ||
            512
        );


    const count =
        Number(
            tournament.registered_count ||
            0
        );


    const remaining =
        Math.max(
            maxPlayers - count,
            0
        );


    if (tournamentName) {

        tournamentName.textContent =
            name;

    }


    if (registeredCount) {

        registeredCount.textContent =
            count;

    }


    if (slotsRemaining) {

        slotsRemaining.textContent =
            `${remaining} slots remaining`;

    }


    if (tournamentStatus) {

        tournamentStatus.textContent =
            tournament.status ||
            "REGISTRATION";

    }


    if (tournamentImage) {
        const imageUrl = String(tournament.image_url || "").trim();
        tournamentImage.src = imageUrl || "https://dbiol.chuka.ac.ke/wp-content/uploads/2025/04/chuka-uni-logo-HD-1-1.jpg";
        tournamentImage.alt = `${name} tournament image`;
    }

    if (adminTournamentImagePreview) {
        const imageUrl = String(tournament.image_url || "").trim();
        adminTournamentImagePreview.src = imageUrl || "https://dbiol.chuka.ac.ke/wp-content/uploads/2025/04/chuka-uni-logo-HD-1-1.jpg";
        adminTournamentImagePreview.classList.toggle("has-image", Boolean(imageUrl));
        if (adminImageEmpty) adminImageEmpty.classList.toggle("hidden", Boolean(imageUrl));
    }


    updateRegistrationButton(remaining, tournament);
}

async function saveTournamentImage(imageData, fileName, mimeType) {
    if (!isAdminUser || !currentUser || !currentTournament) return;
    const idToken = await getFirebaseIdToken();
    const result = await apiRequest("updateTournamentImage", {
        idToken,
        tournamentId: currentTournament.tournament_id,
        imageData,
        fileName: fileName || "tournament-image",
        mimeType: mimeType || "image/jpeg"
    });
    if (!result || !result.success || !result.image_url) {
        throw new Error(result?.error || "Could not replace tournament image.");
    }
    currentTournament.image_url = result.image_url;
    renderTournament(currentTournament);
    return result.image_url;
}

async function saveTournamentImageUrl() {
    if (!isAdminUser || !currentTournament || !tournamentImageUrl) return;
    const url = String(tournamentImageUrl.value || "").trim();
    if (!/^https:\/\//i.test(url)) {
        throw new Error("Use a public HTTPS image URL.");
    }
    const idToken = await getFirebaseIdToken();
    const result = await apiRequest("updateTournamentImage", {
        idToken,
        tournamentId: currentTournament.tournament_id,
        imageUrl: url
    });
    if (!result || !result.success) throw new Error(result?.error || "Could not save image URL.");
    currentTournament.image_url = result.image_url || url;
    renderTournament(currentTournament);
    if (adminImageMessage) adminImageMessage.textContent = "Tournament image updated successfully.";
}

if (saveTournamentImageUrlButton) {
    saveTournamentImageUrlButton.addEventListener("click", async () => {
        saveTournamentImageUrlButton.disabled = true;
        if (adminImageMessage) adminImageMessage.textContent = "Saving image URL…";
        try { await saveTournamentImageUrl(); }
        catch (error) { if (adminImageMessage) adminImageMessage.textContent = error.message || "Could not save image URL."; }
        finally { saveTournamentImageUrlButton.disabled = false; }
    });
}

if (tournamentImageFile) {
    tournamentImageFile.addEventListener("change", () => {
        const file = tournamentImageFile.files?.[0];
        if (!file || !adminTournamentImagePreview) return;
        const reader = new FileReader();
        reader.onload = () => {
            adminTournamentImagePreview.src = String(reader.result || "");
            adminTournamentImagePreview.classList.add("has-image");
            if (adminImageEmpty) adminImageEmpty.classList.add("hidden");
        };
        reader.readAsDataURL(file);
    });
}

if (uploadTournamentImageButton) {
    uploadTournamentImageButton.addEventListener("click", async () => {
        const file = tournamentImageFile?.files?.[0];
        if (!file) {
            if (adminImageMessage) adminImageMessage.textContent = "Choose an image first.";
            return;
        }
        if (file.size > 3 * 1024 * 1024) {
            if (adminImageMessage) adminImageMessage.textContent = "Image must be 3 MB or smaller.";
            return;
        }
        uploadTournamentImageButton.disabled = true;
        if (adminImageMessage) adminImageMessage.textContent = "Uploading image…";
        try {
            const imageData = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(String(reader.result || ""));
                reader.onerror = () => reject(new Error("Could not read the selected image."));
                reader.readAsDataURL(file);
            });
            await saveTournamentImage(imageData, file.name, file.type);
            if (adminImageMessage) adminImageMessage.textContent = "Tournament image replaced successfully.";
        } catch (error) {
            if (adminImageMessage) adminImageMessage.textContent = error.message || "Could not replace tournament image.";
        } finally {
            uploadTournamentImageButton.disabled = false;
        }
    });
}

async function loadMyTournamentRegistration() {
    if (!currentUser || !currentTournament) return;
    try {
        const idToken = await getFirebaseIdToken();
        const result = await apiRequest("getMyTournamentRegistration", {
            idToken,
            tournamentId: currentTournament.tournament_id
        });
        currentTournamentRegistration = result && result.success && result.registered
            ? (result.registration || null) : null;
        if (result && result.active && currentTournamentRegistration) {
            currentTournamentRegistration.payment_status = "VERIFIED";
        }
    } catch (error) {
        console.error("Unable to check existing registration:", error);
        // Do not let a failed status check encourage duplicate registration.
        currentTournamentRegistration = currentTournamentRegistration || null;
    }

    if (currentTournamentRegistration) {
        const status = String(currentTournamentRegistration.payment_status || "UNVERIFIED").toUpperCase();
        if (paymentStatusSection && !isAdminUser) paymentStatusSection.classList.remove("hidden");
        updatePaymentStatus(status);
    } else if (paymentStatusSection) {
        paymentStatusSection.classList.add("hidden");
    }
    updateRegistrationButton();
}

function updateRegistrationButton(remaining, tournament) {
    if (!registerButton || isAdminUser) return;
    const status = String(currentTournamentRegistration?.payment_status || "").toUpperCase();
    if (currentTournamentRegistration && status === "VERIFIED") {
        registerButton.textContent = "ACTIVE — PAYMENT VERIFIED";
        registerButton.disabled = true;
        return;
    }
    if (currentTournamentRegistration && status === "CLAIMED") {
        registerButton.textContent = "PAYMENT PENDING — AWAITING ADMIN";
        registerButton.disabled = true;
        return;
    }
    if (currentTournamentRegistration) {
        registerButton.textContent = "COMPLETE PAYMENT";
        registerButton.disabled = false;
        return;
    }
    registerButton.textContent = "REGISTER FOR TOURNAMENT";
    const t = tournament || currentTournament;
    let slots = remaining;
    if (typeof slots !== "number" && t) {
        slots = Math.max(Number(t.max_players || 512) - Number(t.registered_count || 0), 0);
    }
    registerButton.disabled = Boolean(t && (slots <= 0 || t.status !== "REGISTRATION"));
}



/* =========================================================
   REGISTRATION UI
   ========================================================= */


/**
 * Open registration form.
 */
if (registerButton) {

    registerButton.addEventListener(
        "click",
        () => {
            if (isAdminUser) return;
            if (currentTournamentRegistration) {
                if (paymentStatusSection) {
                    paymentStatusSection.classList.remove("hidden");
                    paymentStatusSection.scrollIntoView({ behavior: "smooth", block: "center" });
                }
                return;
            }
            openRegistrationForm(currentUser);
        }
    );

}


/**
 * Cancel registration.
 */
if (cancelRegistrationButton) {

    cancelRegistrationButton.addEventListener(
        "click",
        () => {

            closeRegistrationForm();

        }
    );

}


/**
 * Registration form submission.
 */
if (registrationForm) {
    registrationForm.addEventListener(
        "submit",
        async (event) => {
            event.preventDefault();

            console.log(
                "Registration form submitted."
            );

            if (!currentUser) {
                showRegistrationMessage(
                    "Please sign in with Google first."
                );
                return;
            }

            if (!currentTournament) {
                showRegistrationMessage(
                    "No current tournament is loaded. Please refresh the page."
                );
                return;
            }

            if (!registrationForm.reportValidity()) {
                return;
            }

            await submitRegistration();
        }
    );
} else {
    console.error(
        "Registration form was not found in the HTML."
    );
}


/**
 * Open registration form
 * and populate authenticated
 * Google information.
 */
function openRegistrationForm(
    user
) {

    if (!user) {

        return;

    }


    if (!currentTournament) {

        showRegistrationMessage(
            "No active tournament is available."
        );

        return;

    }


    if (registrationGoogleAccount) {

        registrationGoogleAccount.value =
            user.email ||
            "";

    }


    if (registrationPlayerName) {

        registrationPlayerName.value =
            user.displayName ||
            "";

    }


    if (registrationMessage) {

        registrationMessage.textContent =
            "";

    }


    if (paymentClaimMessage) {

        paymentClaimMessage.textContent =
            "";

    }


    if (paymentStatusSection) {

        paymentStatusSection.classList.add(
            "hidden"
        );

    }


    if (registrationSection) {

        registrationSection.classList.remove(
            "hidden"
        );


        registrationSection.scrollIntoView({
            behavior:
                "smooth",

            block:
                "start"
        });

    }

}


/**
 * Close registration form.
 */
function closeRegistrationForm() {

    if (registrationSection) {

        registrationSection.classList.add(
            "hidden"
        );

    }

}


/**
 * Show registration message.
 */
function showRegistrationMessage(
    message
) {

    if (registrationMessage) {

        registrationMessage.textContent =
            message;

    }

}



/* =========================================================
   REGISTRATION SUBMISSION
   ========================================================= */


/**
 * Submit player registration.
 */
async function submitRegistration() {

    try {

        if (!currentUser) {

            throw new Error(
                "Please sign in with Google first."
            );

        }


        if (!currentTournament) {

            throw new Error(
                "No active tournament found."
            );

        }


        const cleanEfootballUsername =
            String(
                efootballUsername.value ||
                ""
            ).trim();


        const cleanWhatsappNumber =
            String(
                whatsappNumber.value ||
                ""
            ).trim();


        const cleanMpesaName =
            String(
                mpesaName.value ||
                ""
            ).trim();


        if (!cleanEfootballUsername) {

            throw new Error(
                "Please enter your eFootball username."
            );

        }


        if (!cleanWhatsappNumber) {

            throw new Error(
                "Please enter your WhatsApp number."
            );

        }


        if (!cleanMpesaName) {

            throw new Error(
                "Please enter your M-Pesa name."
            );

        }


        submitRegistrationButton.disabled =
            true;


        showRegistrationMessage(
            "Submitting your registration..."
        );


        /**
         * Get a fresh Firebase ID token.
         */
        const idToken =
            await getFirebaseIdToken();


        /**
         * IMPORTANT:
         *
         * The browser sends the Firebase
         * token, not a Chuka user_id.
         *
         * The backend derives the user
         * from the verified token.
         */
        const result =
            await apiRequest(
                "registerPlayer",
                {

                    idToken:
                        idToken,

                    tournamentId:
                        currentTournament
                            .tournament_id,

                    efootballUsername:
                        cleanEfootballUsername,

                    whatsappNumber:
                        cleanWhatsappNumber,

                    mpesaName:
                        cleanMpesaName

                }
            );


        console.log(
            "Chuka registration successful:",
            result.registration
        );


        showRegistrationMessage(
            "Registration successful!"
        );


        /**
         * Refresh tournament count.
         */
        await loadCurrentTournament();


        /**
         * Keep the registration visible
         * briefly so the player sees
         * the success state.
         */
        setTimeout(
            () => {

                closeRegistrationForm();

            },
            1500
        );


    } catch (error) {

        console.error(
            "Chuka registration failed:",
            error
        );


        showRegistrationMessage(
            error.message ||
            "Registration failed."
        );

        if (/already registered/i.test(String(error.message || ""))) {
            await loadMyTournamentRegistration();
            if (currentTournamentRegistration) {
                showRegistrationMessage("You are already registered. Your current payment status is shown on the tournament page.");
                closeRegistrationForm();
            }
        }

        submitRegistrationButton.disabled = false;

    }

}



/* =========================================================
   PAYMENT CLAIM
   ========================================================= */


/**
 * Connect the payment button.
 */
if (claimPaymentButton) {

    claimPaymentButton.addEventListener(
        "click",
        async () => {

            await handleClaimPayment();

        }
    );

}


/**
 * Claim M-Pesa payment.
 *
 * IMPORTANT:
 *
 * The browser does NOT send a
 * Chuka user_id.
 *
 * The backend receives the Firebase
 * ID token and determines the player
 * from the verified Firebase UID.
 */
async function handleClaimPayment() {

    try {

        if (!currentUser) {

            throw new Error(
                "Please sign in with Google first."
            );

        }


        if (!currentTournament) {

            throw new Error(
                "No active tournament found."
            );

        }


        claimPaymentButton.disabled =
            true;


        paymentClaimMessage.textContent =
            "Submitting your payment claim...";


        /**
         * Get the current Firebase
         * authentication token.
         */
        const idToken =
            await getFirebaseIdToken();


        /**
         * Send only the Firebase token
         * and tournament ID.
         *
         * Never send user_id from
         * the browser.
         */
        const result =
            await apiRequest(
                "claimPayment",
                {

                    idToken:
                        idToken,

                    tournamentId:
                        currentTournament
                            .tournament_id

                }
            );


        console.log(
            "Chuka payment claim successful:",
            result.payment
        );


        updatePaymentStatus(result.payment.payment_status);
        if (currentTournamentRegistration) {
            currentTournamentRegistration.payment_status = result.payment.payment_status;
            currentTournamentRegistration.payment_claimed = true;
        }
        updateRegistrationButton();

        paymentClaimMessage.textContent =
            "Payment claim submitted successfully. Please wait for admin verification.";


    } catch (error) {

        console.error(
            "Chuka payment claim failed:",
            error
        );


        paymentClaimMessage.textContent =
            error.message ||
            "Unable to claim payment.";


        claimPaymentButton.disabled =
            false;

    }

}


/**
 * Update payment status UI.
 */
function updatePaymentStatus(
    status
) {

    if (!paymentStatusBadge) {

        return;

    }


    const normalizedStatus =
        String(
            status ||
            "UNVERIFIED"
        ).toUpperCase();


    paymentStatusBadge.textContent =
        normalizedStatus;


    paymentStatusBadge.classList.remove(
        "claimed",
        "verified",
        "rejected"
    );


    if (paymentStatusSection) {

        paymentStatusSection.classList.remove(
            "hidden"
        );

    }


    if (
        normalizedStatus ===
        "CLAIMED"
    ) {

        paymentStatusBadge.classList.add(
            "claimed"
        );


        paymentStatusText.textContent =
            "Payment claim submitted. Waiting for admin verification.";


        claimPaymentButton.disabled =
            true;


        return;

    }


    if (
        normalizedStatus ===
        "VERIFIED"
    ) {

        paymentStatusBadge.classList.add(
            "verified"
        );


        paymentStatusText.textContent =
            "Your payment has been verified by the Chuka admin.";


        claimPaymentButton.disabled =
            true;


        return;

    }


    if (
        normalizedStatus ===
        "REJECTED"
    ) {

        paymentStatusBadge.classList.add(
            "rejected"
        );


        paymentStatusText.textContent =
            "Your payment claim was rejected. Please check your payment details and contact the admin.";


        claimPaymentButton.disabled =
            false;


        return;

    }


    /**
     * Default / UNVERIFIED.
     */
    paymentStatusText.textContent =
        "Make your tournament payment, then click I HAVE PAID.";


    claimPaymentButton.disabled =
        false;

}




/* =========================================================
   ADMIN PAYMENT CLAIMS
   ========================================================= */

if (refreshPaymentClaimsButton) {
    refreshPaymentClaimsButton.addEventListener("click", async () => {
        await loadAdminOverview();
        await loadPaymentClaims();
    });
}

async function loadAdminOverview() {
    if (!currentUser || !currentTournament || !isAdminUser) return;
    try {
        const idToken = await getFirebaseIdToken();
        const result = await apiRequest("getAdminTournamentOverview", {
            idToken,
            tournamentId: currentTournament.tournament_id
        });
        if (!result || !result.success || !result.overview) {
            throw new Error((result && result.error) || "Could not load tournament overview.");
        }
        const o = result.overview;
        if (adminRegisteredCount) adminRegisteredCount.textContent = String(o.registered || 0);
        if (adminPendingCount) adminPendingCount.textContent = String(o.pending || 0);
        if (adminActiveCount) adminActiveCount.textContent = String(o.active || 0);
        if (adminSlotsCount) adminSlotsCount.textContent = String(o.slots_remaining || 0);
    } catch (error) {
        console.error("Unable to load admin overview:", error);
        if (adminMessage) adminMessage.textContent = "Tournament overview could not load: " + (error.message || "unknown error");
    }
}

async function loadPaymentClaims() {
    if (!currentUser || !currentTournament || !paymentClaimsList) return;
    try {
        if (adminMessage) adminMessage.textContent = "Loading payment claims...";
        paymentClaimsList.innerHTML = '<tr><td colspan="5">Loading...</td></tr>';
        const idToken = await getFirebaseIdToken();
        const result = await apiRequest("listPaymentClaims", {
            idToken,
            tournamentId: currentTournament.tournament_id
        });
        if (!result || !result.success) {
            throw new Error((result && result.error) || "Could not load payment claims.");
        }

        const claims = Array.isArray(result.claims) ? result.claims : [];
        if (!claims.length) {
            paymentClaimsList.innerHTML = '<tr><td colspan="5">No payment claims awaiting verification.</td></tr>';
            if (adminMessage) adminMessage.textContent = "No pending payment claims.";
            return;
        }

        paymentClaimsList.innerHTML = "";
        for (const claim of claims) {
            const tr = document.createElement("tr");
            const playerCell = document.createElement("td");
            playerCell.textContent = claim.mpesa_name || claim.user_id || "Player";
            const registrationCell = document.createElement("td");
            registrationCell.textContent = claim.registration_id || "";
            const statusCell = document.createElement("td");
            const pill = document.createElement("span");
            pill.className = "status-pill";
            pill.textContent = String(claim.payment_status || "CLAIMED").toUpperCase();
            statusCell.appendChild(pill);
            const dateCell = document.createElement("td");
            dateCell.textContent = claim.registered_at || "—";
            const actionCell = document.createElement("td");
            if (String(claim.payment_status || "").toUpperCase() === "CLAIMED") {
                const button = document.createElement("button");
                button.type = "button";
                button.className = "primary-button verify-payment-button";
                button.textContent = "Verify payment";
                button.addEventListener("click", async () => {
                    const confirmed = window.confirm(
                        "Confirm you have checked the M-Pesa payment for " +
                        (claim.mpesa_name || claim.registration_id) + "?"
                    );
                    if (!confirmed) return;
                    button.disabled = true;
                    button.textContent = "Verifying...";
                    try {
                        const token = await getFirebaseIdToken();
                        const verified = await apiRequest("verifyPayment", {
                            idToken: token,
                            registrationId: claim.registration_id
                        });
                        if (!verified || !verified.success) {
                            throw new Error((verified && verified.error) || "Verification failed.");
                        }
                        if (adminMessage) adminMessage.textContent = "Payment verified. Player is now ACTIVE.";
                        await loadAdminOverview();
                        await loadPaymentClaims();
                    } catch (error) {
                        if (adminMessage) adminMessage.textContent = error.message || "Could not verify payment.";
                        button.disabled = false;
                        button.textContent = "Verify payment";
                    }
                });
                actionCell.appendChild(button);
            } else {
                actionCell.textContent = "No action";
            }
            tr.append(playerCell, registrationCell, statusCell, dateCell, actionCell);
            paymentClaimsList.appendChild(tr);
        }
        if (adminMessage) adminMessage.textContent = claims.length + " payment claim(s) loaded.";
    } catch (error) {
        console.error("Unable to load admin payment claims:", error);
        paymentClaimsList.innerHTML = '<tr><td colspan="5">Could not load claims. Check the Apps Script deployment and admin permissions.</td></tr>';
        if (adminMessage) adminMessage.textContent = error.message || "Unable to load payment claims.";
    }
}

/* =========================================================
   KNOCKOUT FIXTURES AND PLAYER MANAGEMENT
   ========================================================= */
if (refreshFixturesButton) refreshFixturesButton.addEventListener("click", loadTournamentFixtures);
if (refreshPublicFixturesButton) refreshPublicFixturesButton.addEventListener("click", loadTournamentFixtures);
if (generateFixturesButton) generateFixturesButton.addEventListener("click", async () => {
    if (!currentTournament || !currentTournament.tournament_id) return;
    const confirmed = window.confirm("Generate a randomized knockout draw using only payment-verified players? This can only be done once for this tournament.");
    if (!confirmed) return;
    generateFixturesButton.disabled = true;
    generateFixturesButton.textContent = "Generating draw…";
    try {
        const idToken = await getFirebaseIdToken();
        const result = await apiRequest("generateKnockoutFixtures", { idToken, tournamentId: currentTournament.tournament_id });
        if (!result || !result.success) throw new Error((result && result.error) || "Could not generate fixtures.");
        if (fixturesMessage) fixturesMessage.textContent = "Knockout draw generated successfully.";
        await loadTournamentFixtures();
        await loadAdminTournamentPlayers();
    } catch (error) {
        if (fixturesMessage) fixturesMessage.textContent = error.message || "Unable to generate fixtures.";
        console.error("Fixture generation failed:", error);
    } finally {
        generateFixturesButton.disabled = false;
        generateFixturesButton.textContent = "Generate knockout fixtures";
    }
});

async function loadAdminTournamentPlayers() {
    if (!isAdminUser || !currentTournament || !adminPlayersList) return;
    try {
        const idToken = await getFirebaseIdToken();
        const result = await apiRequest("getAdminTournamentPlayers", { idToken, tournamentId: currentTournament.tournament_id });
        if (!result || !result.success) throw new Error((result && result.error) || "Could not load players.");
        const players = Array.isArray(result.players) ? result.players : [];
        adminPlayersList.innerHTML = "";
        if (!players.length) { adminPlayersList.innerHTML = '<tr><td colspan="4">No registered players yet.</td></tr>'; return; }
        players.forEach(player => {
            const tr = document.createElement("tr");
            const name = document.createElement("td"); name.textContent = player.player_name || player.mpesa_name || "Player";
            const registration = document.createElement("td"); registration.textContent = player.registration_id || "—";
            const status = document.createElement("td"); status.textContent = player.payment_status || "UNVERIFIED";
            const eligibility = document.createElement("td"); eligibility.textContent = player.eligible ? "Eligible for draw" : "Not eligible";
            tr.append(name, registration, status, eligibility); adminPlayersList.appendChild(tr);
        });
    } catch (error) {
        adminPlayersList.innerHTML = '<tr><td colspan="4">Could not load player list.</td></tr>';
        if (adminMessage) adminMessage.textContent = error.message || "Could not load player list.";
    }
}

async function loadTournamentFixtures() {
    if (!currentTournament || !currentTournament.tournament_id || !fixtureRounds) return;
    try {
        if (fixturesMessage) fixturesMessage.textContent = "Loading fixtures…";
        const idToken = await getFirebaseIdToken();
        const result = await apiRequest("getTournamentFixtures", { idToken, tournamentId: currentTournament.tournament_id });
        if (!result || !result.success) throw new Error((result && result.error) || "Could not load fixtures.");
        renderTournamentFixtures(Array.isArray(result.fixtures) ? result.fixtures : []);
    } catch (error) {
        console.error("Unable to load tournament fixtures:", error);
        if (fixturesMessage) fixturesMessage.textContent = error.message || "Could not load tournament fixtures.";
    }
}

function renderTournamentFixtures(matches) {
    fixtureRounds.innerHTML = "";
    if (!matches.length) {
        if (fixturesMessage) fixturesMessage.textContent = "Fixtures have not been generated yet. The admin will create the draw after at least two payments are verified.";
        fixtureRounds.innerHTML = '<p>No fixtures yet.</p>';
        return;
    }
    const rounds = new Map();
    matches.forEach(match => { const key = Number(match.round_number); if (!rounds.has(key)) rounds.set(key, []); rounds.get(key).push(match); });
    [...rounds.keys()].sort((a,b) => a-b).forEach(roundNo => {
        const section = document.createElement("section"); section.className = "fixture-round";
        const heading = document.createElement("h3"); heading.textContent = (rounds.get(roundNo)[0].round_name || ("Round " + roundNo)); section.appendChild(heading);
        rounds.get(roundNo).sort((a,b) => Number(a.match_number)-Number(b.match_number)).forEach(match => {
            const card = document.createElement("article"); card.className = "fixture-match";
            const meta = document.createElement("div"); meta.className = "fixture-meta"; meta.textContent = "Match " + match.match_number + " · " + (match.status || "SCHEDULED"); card.appendChild(meta);
            const winner = String(match.winner_registration_id || "");
            const p1 = document.createElement("div"); p1.className = "fixture-player" + (winner && winner === String(match.player1_registration_id) ? " winner" : "");
            const p1name = document.createElement("span"); p1name.textContent = match.player1_name || "TBD"; const p1score = document.createElement("span"); p1score.className = "score"; p1score.textContent = match.player1_score === "" || match.player1_score == null ? "—" : match.player1_score; p1.append(p1name,p1score);
            const p2 = document.createElement("div"); p2.className = "fixture-player" + (winner && winner === String(match.player2_registration_id) ? " winner" : "");
            const p2name = document.createElement("span"); p2name.textContent = match.player2_name || "TBD"; const p2score = document.createElement("span"); p2score.className = "score"; p2score.textContent = match.player2_score === "" || match.player2_score == null ? "—" : match.player2_score; p2.append(p2name,p2score);
            card.append(p1,p2);
            if (isAdminUser && match.status === "SCHEDULED" && match.player1_registration_id && match.player2_registration_id) {
                const controls = document.createElement("div"); controls.className = "fixture-actions";
                const score1 = document.createElement("input"); score1.type = "number"; score1.min = "0"; score1.step = "1"; score1.className = "fixture-score-input"; score1.placeholder = "P1"; score1.setAttribute("aria-label", "Player 1 score");
                const score2 = document.createElement("input"); score2.type = "number"; score2.min = "0"; score2.step = "1"; score2.className = "fixture-score-input"; score2.placeholder = "P2"; score2.setAttribute("aria-label", "Player 2 score");
                const save = document.createElement("button"); save.type = "button"; save.className = "primary-button"; save.textContent = "Save result";
                save.addEventListener("click", async () => {
                    if (score1.value === "" || score2.value === "") { if (fixturesMessage) fixturesMessage.textContent = "Enter both player scores."; return; }
                    if (score1.value === score2.value) { if (fixturesMessage) fixturesMessage.textContent = "Knockout matches cannot end in a draw. Enter the score after any tie-break."; return; }
                    save.disabled = true; save.textContent = "Saving…";
                    try {
                        const idToken = await getFirebaseIdToken();
                        const saved = await apiRequest("recordMatchResult", { idToken, matchId: match.match_id, player1Score: Number(score1.value), player2Score: Number(score2.value) });
                        if (!saved || !saved.success) throw new Error((saved && saved.error) || "Could not save match result.");
                        if (fixturesMessage) fixturesMessage.textContent = "Result saved and winner advanced.";
                        await loadTournamentFixtures();
                    } catch (error) { if (fixturesMessage) fixturesMessage.textContent = error.message || "Could not save result."; save.disabled = false; save.textContent = "Save result"; }
                });
                controls.append(score1,score2,save); card.appendChild(controls);
            }
            section.appendChild(card);
        });
        fixtureRounds.appendChild(section);
    });
    if (fixturesMessage) {
        const completed = matches.filter(m => m.status === "COMPLETED").length;
        const bye = matches.filter(m => m.status === "BYE").length;
        const final = matches.find(m => m.round_name === "Final" && m.status === "COMPLETED");
        fixturesMessage.textContent = final ? "Tournament champion: " + (final.winner_registration_id === final.player1_registration_id ? final.player1_name : final.player2_name) : matches.length + " bracket match(es) · " + completed + " completed · " + bye + " bye(s).";
    }
}

/* =========================================================
   END
   ========================================================= */



/* =========================================================
   WHATSAPP GROUPS
   ========================================================= */
function applyWhatsAppGroups(groups) {
    const data = groups || {};
    const setLink = (el, url) => {
        if (!el) return;
        const clean = String(url || "").trim();
        el.href = clean || "#";
        el.classList.toggle("is-disabled", !clean);
        el.setAttribute("aria-disabled", clean ? "false" : "true");
    };
    setLink(whatsappNormalLink, data.normal);
    setLink(whatsappResultsLink, data.results);
    setLink(whatsappAdminUpdatesLink, data.admin_updates);
    const count = [data.normal, data.results, data.admin_updates].filter(Boolean).length;
    if (whatsappGroupsPublicMessage) whatsappGroupsPublicMessage.textContent = count ? `${count} official WhatsApp group${count === 1 ? "" : "s"} available.` : "WhatsApp group links will appear here once the admin adds them.";
    if (whatsappNormalUrl) whatsappNormalUrl.value = data.normal || "";
    if (whatsappResultsUrl) whatsappResultsUrl.value = data.results || "";
    if (whatsappAdminUpdatesUrl) whatsappAdminUpdatesUrl.value = data.admin_updates || "";
}

async function loadWhatsAppGroups() {
    try {
        const response = await fetch(PUBLIC_DASHBOARD_API, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify({ action: "getPublicTournamentDashboard" }) });
        if (!response.ok) throw new Error("Could not load WhatsApp groups.");
        const result = await response.json();
        if (!result || result.success !== true) throw new Error(result?.error || "Could not load WhatsApp groups.");
        applyWhatsAppGroups(result.dashboard?.tournament?.whatsapp_groups || {});
    } catch (error) {
        console.error("Unable to load WhatsApp groups:", error);
        if (whatsappGroupsPublicMessage) whatsappGroupsPublicMessage.textContent = "WhatsApp group links could not be loaded right now.";
    }
}

if (saveWhatsAppGroupsButton) {
    saveWhatsAppGroupsButton.addEventListener("click", async () => {
        if (!isAdminUser || !currentTournament) return;
        saveWhatsAppGroupsButton.disabled = true;
        if (whatsappGroupsMessage) whatsappGroupsMessage.textContent = "Saving WhatsApp groups…";
        try {
            const idToken = await getFirebaseIdToken();
            const result = await apiRequest("updateWhatsAppGroups", {
                idToken,
                tournamentId: currentTournament.tournament_id,
                normal: whatsappNormalUrl?.value || "",
                results: whatsappResultsUrl?.value || "",
                admin_updates: whatsappAdminUpdatesUrl?.value || ""
            });
            applyWhatsAppGroups(result.whatsapp_groups || {});
            if (whatsappGroupsMessage) whatsappGroupsMessage.textContent = "WhatsApp groups saved successfully.";
        } catch (error) {
            console.error("Unable to save WhatsApp groups:", error);
            if (whatsappGroupsMessage) whatsappGroupsMessage.textContent = error.message || "Could not save WhatsApp groups.";
        } finally {
            saveWhatsAppGroupsButton.disabled = false;
        }
    });
}

loadWhatsAppGroups();

/* =========================================================
   VERIFIED MEMBERS
   ========================================================= */
const verifiedMembersList = document.getElementById("verified-members-list");
const verifiedMembersMessage = document.getElementById("verified-members-message");

async function loadVerifiedMembers() {
    if (!verifiedMembersList) return;
    try {
        const response = await fetch(PUBLIC_DASHBOARD_API, {
            method: "POST",
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify({ action: "getPublicVerifiedMembers" })
        });
        if (!response.ok) throw new Error("Could not load verified members.");
        const result = await response.json();
        if (!result || result.success !== true || !Array.isArray(result.members)) {
            throw new Error(result?.error || "Could not load verified members.");
        }
        const members = result.members;
        verifiedMembersList.innerHTML = "";
        if (!members.length) {
            if (verifiedMembersMessage) verifiedMembersMessage.textContent = "No verified members have been recorded for the current tournament yet.";
            return;
        }
        if (verifiedMembersMessage) verifiedMembersMessage.textContent = `${members.length} verified member${members.length === 1 ? "" : "s"} in the current tournament.`;
        members.forEach((member, index) => {
            const row = document.createElement("div"); row.className = "verified-member-row";
            const number = document.createElement("span"); number.className = "verified-member-number"; number.textContent = String(index + 1);
            const name = document.createElement("span"); name.className = "verified-member-name"; name.textContent = member.player_name || "Player";
            const status = document.createElement("span"); status.className = "verified-member-status"; status.textContent = "✓ VERIFIED";
            row.append(number, name, status); verifiedMembersList.appendChild(row);
        });
    } catch (error) {
        console.error("Unable to load verified members:", error);
        if (verifiedMembersMessage) verifiedMembersMessage.textContent = "Verified member list could not be loaded right now.";
        verifiedMembersList.innerHTML = "";
    }
}

loadVerifiedMembers();

/* =========================================================
   HALL OF CHAMPIONS
   ========================================================= */
const championsList = document.getElementById("champions-list");


async function loadHallOfChampions() {
    if (!championsList) return;
    try {
        const response = await fetch(PUBLIC_DASHBOARD_API, {
            method: "POST",
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify({ action: "getPublicTournamentDashboard" })
        });
        if (!response.ok) throw new Error("Could not load tournament history.");
        const result = await response.json();
        if (!result || result.success !== true || !result.dashboard) throw new Error(result?.error || "Could not load tournament history.");
        const history = Array.isArray(result.dashboard.history) ? result.dashboard.history : [];
        const completed = history.filter(item => item.champion);
        if (!completed.length) {
            championsList.innerHTML = '<p class="hub-muted">No champion has been recorded yet. Complete a tournament final to create the first Hall of Champions entry.</p>';
            return;
        }
        championsList.innerHTML = "";
        completed.forEach(item => {
            const row = document.createElement("div");
            row.className = "champion-row";
            const name = document.createElement("span");
            name.textContent = item.name || "Chuka Tournament";
            const champion = document.createElement("strong");
            champion.textContent = "🏆 " + item.champion;
            row.append(name, champion);
            championsList.appendChild(row);
        });
    } catch (error) {
        console.error("Unable to load Hall of Champions:", error);
        championsList.innerHTML = '<p class="hub-muted">Tournament history could not be loaded right now. The public live dashboard remains available from the Fixtures section.</p>';
    }
}

loadHallOfChampions();


/* =========================================================
   WHATSAPP TOURNAMENT SHARE
   ========================================================= */
const whatsappShareButton = document.getElementById("whatsapp-share-button");
const whatsappShareMessage = document.getElementById("whatsapp-share-message");

function setupWhatsAppTournamentShare() {
    if (!whatsappShareButton) return;

    const publicUrl = new URL("./public.html", window.location.href).href;
    const tournamentTitle = currentTournament?.name || "Chuka Tournament";
    const message = `🏆 ${tournamentTitle}\n\nView the live Chuka Tournament fixtures, verified members, scores and champions:\n${publicUrl}`;
    whatsappShareButton.href = `https://wa.me/?text=${encodeURIComponent(message)}`;

    whatsappShareButton.addEventListener("click", () => {
        if (whatsappShareMessage) whatsappShareMessage.textContent = "Opening WhatsApp with the tournament link…";
    });
}

setupWhatsAppTournamentShare();

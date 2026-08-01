import { Landing } from "./landing.js";
import { Reader } from "./reader.js";
import {
    getAuthState,
    subscribeAuth
} from "../auth/session.js";
import {
    startRouter,
    navigate,
    safeNext
} from "../router/router.js";
import {
    bookmarksView,
    loadingView,
    loginView,
    notFoundView,
    profileView,
    settingsView,
    subscriptionView
} from "../account/views.js";
import {
    fetchAccess,
    pollForPremium
} from "../account/subscription.js";

let currentRoute;
let generation = 0;

const root = () => document.getElementById("reader-container");

const focusHeading = () =>
    requestAnimationFrame(() =>
        root()?.querySelector("h1")?.focus()
    );

const premiumRequiredFor = route =>
    [
        "account-profile",
        "account-bookmarks",
        "account-settings"
    ].includes(route.kind);

async function render(route) {
    const renderId = ++generation;

    document.body.classList.remove("reader-active");

    console.info("[router] rendering", {
        route,
        authStatus: getAuthState().status,
        href: location.href
    });

    if (route.kind === "redirect") {
        return navigate(route.to, { replace: true });
    }

    if (
        route.kind === "account-not-found" ||
        route.kind === "not-found"
    ) {
        notFoundView(
            root(),
            route.kind === "account-not-found"
        );
        focusHeading();
        return;
    }

    const state = getAuthState();

    if (route.private && state.status === "loading") {
        return loadingView(root());
    }

    if (
        route.private &&
        state.status !== "authenticated"
    ) {
        const callback = new URLSearchParams(location.search);
        const error = callback.get("error");
        const description = callback.get("error_description");

        const failure = description
            ? `&error=${encodeURIComponent(
                  error || "oauth_error"
              )}&error_description=${encodeURIComponent(
                  description
              )}`
            : "";

        return navigate(
            `/login?next=${encodeURIComponent(
                safeNext(
                    location.pathname +
                        location.search +
                        location.hash
                )
            )}${failure}`,
            { replace: true }
        );
    }

    if (
        [
            "login",
            "signup",
            "forgot-password",
            "reset-password"
        ].includes(route.kind)
    ) {
        if (
            state.status === "authenticated" &&
            route.kind !== "reset-password"
        ) {
            return navigate(
                safeNext(
                    new URLSearchParams(
                        location.search
                    ).get("next")
                ),
                { replace: true }
            );
        }

        loginView(root(), route.kind);
        focusHeading();
        return;
    }

    let access = null;
    const needsPremium = premiumRequiredFor(route);

    /*
     * Important:
     * Public pages such as the homepage and reader are no longer
     * replaced by the Stripe trial screen merely because a visitor
     * is signed in.
     *
     * Premium access is checked only for account pages.
     */
    if (
        state.status === "authenticated" &&
        needsPremium
    ) {
        const checkoutReturn =
            new URLSearchParams(location.search).get(
                "checkout"
            ) === "success";

        subscriptionView(root(), {
            verifying: checkoutReturn
        });

        try {
            access = checkoutReturn
                ? await pollForPremium()
                : await fetchAccess();
        } catch (error) {
            console.error(
                "[access] verification failed",
                error
            );

            if (renderId === generation) {
                const status = root().querySelector(
                    ".subscription-status"
                );

                if (status) {
                    status.textContent =
                        error?.message ||
                        "Access could not be verified. Please reload and try again.";
                }
            }

            return;
        }

        console.info("[access] result", access);

        if (!access?.hasPremiumAccess) {
            if (renderId === generation) {
                subscriptionView(root());
            }

            return;
        }

        if (checkoutReturn) {
            return navigate(location.pathname, {
                replace: true
            });
        }
    }

    if (route.kind === "legacy-reader") {
        const params = new URLSearchParams(
            location.search
        );

        return Reader.start(
            params.get("work"),
            params.get("chapter")
        );
    }

    if (route.kind === "home") {
        return Landing.start();
    }

    if (route.kind === "account-profile") {
        profileView(root(), state.user, access);
    }

    if (route.kind === "account-bookmarks") {
        await bookmarksView(root(), state.user);
    }

    if (route.kind === "account-settings") {
        settingsView(root(), state.user);
    }

    if (renderId === generation) {
        focusHeading();
    }
}

const rerender = () =>
    currentRoute && render(currentRoute);

export class Page {
    static async start() {
        subscribeAuth((_state, detail) => {
            if (detail.identityChanged) {
                rerender();
            }
        });

        startRouter(route => {
            currentRoute = route;
            return render(route);
        });
    }
}

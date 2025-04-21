import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";

export const setToken = (access_token: string) => {
    if (access_token) {
        localStorage.setItem("access_token", access_token);
    }
};

export const setData = (data) => {
    localStorage.setItem("data", JSON.stringify(data));
};

export const deleteToken = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("data");
};

export const getToken = () => {
    return localStorage.getItem("access_token");
};

export const getData = () => {
    const storedData = localStorage.getItem("data");
    return storedData ? JSON.parse(storedData) : null;
};

export const saveImage = () => {
    let image = import.meta.env.VITE_APP_BASE_URL_IMAGE;
    localStorage.setItem("image", JSON.stringify(image));
};

export const getUserImage = () => {
    const storedImage = localStorage.getItem("image");
    return storedImage ? JSON.parse(storedImage) : null;
};

export const hasUserImage = () => {
    return !!localStorage.getItem("image");
};


let intervalId;

export const checkTokenExpiration = () => {
    // If intervalId is already defined, return to avoid creating a new interval
    if (intervalId) {
        return;
    }
    const token = getToken();
    let hasWarningDisplayed = false;

    intervalId = setInterval(() => {
        if (token) {
            const decodedToken = jwtDecode(token);
            const currentTime = Date.now();
            const isTokenExpired = currentTime > decodedToken.exp * 1000;

            if (isTokenExpired) {
                deleteToken();
                window.location.href = "/";
            } else {
                // Check if the token will expire within the next 5 minutes
                const expirationTime = decodedToken.exp * 1000;
                const timeDifference = expirationTime - currentTime;
                const fiveMinutesInMilliseconds = 5 * 60 * 1000;
                const fourMinutesAndFiftySixSecondsInMilliseconds =
                    (4 * 60 + 56) * 1000;
                const withinFiveMinutes =
                    timeDifference >= fourMinutesAndFiftySixSecondsInMilliseconds &&
                    timeDifference <= fiveMinutesInMilliseconds;

                if (withinFiveMinutes && !hasWarningDisplayed) {
                    hasWarningDisplayed = true;
                    toast.warning("Your session will expire soon in 5 minutes.");
                    clearInterval(intervalId);
                    intervalId = null;
                }
            }
        } else {
            clearInterval(intervalId);
            intervalId = null;
        }
    }, 3000);
};
export const showToast = (message, type = "error") => {
    window.dispatchEvent(new CustomEvent("show-toast", {
        detail: { message, type }
    }));
};
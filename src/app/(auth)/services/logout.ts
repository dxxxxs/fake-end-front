import Cookies from 'js-cookie';

export const logout = async (): Promise<boolean> => {
    try {
        Cookies.remove("token");
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("user_id");
        localStorage.removeItem("username");
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
};

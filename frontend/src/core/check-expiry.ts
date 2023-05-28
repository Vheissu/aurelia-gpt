export const checkTokenExpiry = () => {
    const token = localStorage.getItem('token');
    const loginTime = localStorage.getItem('loginTime');

    if (!token || !loginTime) return;

    // Calculate the time difference
    const currentTime = new Date();
    const timeDifference = currentTime.getTime() - Number(loginTime);
    const hoursDifference = timeDifference / (1000 * 60 * 60);

    // If the difference is more than 4 hours, remove the token
    if (hoursDifference >= 4) {
        localStorage.removeItem('token');
        localStorage.removeItem('loginTime');
    }
};

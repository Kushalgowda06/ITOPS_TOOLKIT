
export const isValidIpAddress = (ipAddress) => {
    // For IPv4
    var ipformat = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if (ipformat.test(ipAddress)) {
        return true;
    }

 return { isValid: false, message: 'Please enter a valid IP address (e.g., 192.168.1.1).' };
}

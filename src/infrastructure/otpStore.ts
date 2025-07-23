const otpStorage = new Map<string, string>();

export function saveOtp(phone: string, otp: string) {
    otpStorage.set(phone, otp);
}

export function useOtp(phone: string, otp: string): boolean {
    if (codeExists(phone, otp)) {
        deleteOtp(phone);
        return true;
    }
    return false;     
}

function codeExists(phone: string, otp: string) {
    return otpStorage.has(phone) && otpStorage.get(phone) === otp;
}

function deleteOtp(phone: string) {
    otpStorage.delete(phone);
}
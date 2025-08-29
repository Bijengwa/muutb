export function encodeFullName(first, second, third) {
    return [first, second, third].filter(Boolean).join(' ').trim()
}

export function decodeFullName(fullName) {
    const parts = fullName.trim().split(" ");
    return {
        firstname: parts[0] || "",
        secondname: parts[1] || "",
        thirdname: parts[2] || "",
    };
}

export function fullNameHelper({ firstName, secondName, thirdName, fullName }) {
    if (fullName) {
        return decodeFullName(fullName);
    }

    if (firstName || secondName || thirdName) {
        return {
            fullName: encodeFullName(firstName, secondName, thirdName),
            firstName,
            secondName,
            thirdName
        };
    }

return {};

}
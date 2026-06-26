export function formatMessageTime(date) {
    return new Date(date).toLocaleTimeString(["en-US"], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    })
}

export function toTitleCase(str) {
    if (!str) return "";
    return str
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}
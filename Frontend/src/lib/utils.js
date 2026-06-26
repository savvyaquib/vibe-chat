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

export function getEmojiInfo(str) {
    if (!str) return { isOnlyEmojis: false, count: 0 };
    
    const trimmed = str.trim();
    if (!trimmed) return { isOnlyEmojis: false, count: 0 };
    
    let graphemes = [];
    if (typeof Intl !== 'undefined' && Intl.Segmenter) {
        const segmenter = new Intl.Segmenter();
        graphemes = Array.from(segmenter.segment(trimmed)).map(s => s.segment);
    } else {
        graphemes = Array.from(trimmed);
    }
    
    const nonSpaceGraphemes = graphemes.filter(g => g.trim() !== "");
    if (nonSpaceGraphemes.length === 0) return { isOnlyEmojis: false, count: 0 };
    
    const emojiRegex = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/;
    const allEmojis = nonSpaceGraphemes.every(g => emojiRegex.test(g));
    
    return {
        isOnlyEmojis: allEmojis,
        count: allEmojis ? nonSpaceGraphemes.length : 0
    };
}
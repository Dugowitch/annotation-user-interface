import { Word } from "../features/transcript/types/Word";

export const segmentWords2String = (words: Word[]|string|null): string => {
    if (typeof words === "string")
        return words
    let text = ""
    if (words){
        words.forEach(word => text = `${text} ${word.label}`)
    }
    return text.trim()
}

export const string2SegmentWords = (text: string): Word[] => {
    const tokens = text.trim().split(" ")
    return tokens.map(token => ({
        label: token,
        text_tags: [],
    }))
}

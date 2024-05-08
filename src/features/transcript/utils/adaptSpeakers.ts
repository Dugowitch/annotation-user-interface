import { speakerColors } from "../../../style/tagColors"
import { SpeakerTag } from "../types/Tag"


export const adaptSpeakers = (speaker_tags: SpeakerTag[]|null|undefined) => {
    if (!speaker_tags)
        return []

    const transformedSpeakers: SpeakerTag[] = []
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    let possible_keys = alphabet.split("")
    for (const [_, tag] of speaker_tags.entries()){
        if (!tag.label)
            continue

        possible_keys = possible_keys.filter(k => k !== tag.id)
        
        if (!tag.color){
            tag.color = speakerColors[alphabet.indexOf(tag.id) % speakerColors.length]
        }
        transformedSpeakers.push(tag)
    }
    
    transformedSpeakers.push({
        id: possible_keys[0],
        label: "",
        color: speakerColors[alphabet.indexOf(possible_keys[0]) % speakerColors.length],
    })
    
    return transformedSpeakers
}

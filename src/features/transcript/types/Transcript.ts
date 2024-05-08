import { SpeakerTag } from "./Tag"
import { SegmentTag, TextTag } from "./Tag";
import { Segment, SegmentLoadingParams } from "./Segment";
import { Lookup } from "../../../types/Lookup";
import { GroupLoadingParams } from "../../grouping/types/Group";
import { APIErrorResponse } from "../../../types/APIErrorResponse";


interface TranscriptCommon {
    id: string,
    status?: string,
    source: string,
    created_at: string,
    segment_tags?: SegmentTag[] | null,
    text_tags?: TextTag[] | null,
    groups?: GroupLoadingParams[] | null,
}

export interface TranscriptLoadingParams extends TranscriptCommon {
    speaker_tags?: SpeakerTag[] | null,
    segments?: SegmentLoadingParams[] | null,
}

export interface Transcript extends TranscriptCommon {
    speakerTags: SpeakerTag[],
    segments: Lookup<Segment>,
    region2ID: Record<string, string>,
    specialChar: string,
    lastFocusedSegment: string,
    error?: APIErrorResponse,
}

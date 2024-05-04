import { useEffect, useState } from "react";
import axios from "axios";

// redux
import { useSelector } from "react-redux";
import { selectWaveformURL } from "../../workspace/redux/workspaceSlice";


interface waveformDataResponse {
    version?: number,
    channels?: number,
    sample_rate?: number,
    samples_per_pixel?: number,
    bits?: number,
    length?: number,
    data: number[],
}

export const useFetchWaveformPeaks = () => {
    const url = useSelector(selectWaveformURL)
    const [peaks, setPeaks] = useState<number[][]|undefined>(undefined)

    useEffect(() => {
        if (!url) // wait for job to load
            return

        const fetchWaveformPeaks = async () => {
            try {
                const { data } = await axios.get<waveformDataResponse>(url)
                setPeaks([data.data])
            } catch (err) {
                setPeaks(undefined)
            }
        }
        fetchWaveformPeaks()
    }, [url])

    return peaks
}

import Papa from "papaparse";
import { UrlResource } from "../Resources/UrlResource";
import { SurahModel } from "../Models/SurahModel";
import { AyahModel } from "../Models/AyahModel";

export class DataService {

    private static surahsCache: SurahModel[] | null = null;
    private static ayahsCache: AyahModel[] | null = null;

    // Get Data as Text
    private static async GetData(url: string): Promise<string> {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        return await response.text(); // ✅ correct
    }

    //Get List of Surah
    static async GetSurahsData(): Promise<SurahModel[]> {
        if (this.surahsCache) return this.surahsCache;

        const csv = await this.GetData(UrlResource.SurahsList_CSV_Url);

        const parsed = Papa.parse<SurahModel>(csv, {
            header: true,
            skipEmptyLines: true,
            dynamicTyping: true
        });

        this.surahsCache = parsed.data;
        return this.surahsCache;
    }

    //Get List of Surah
    static async GetAyasData(): Promise<AyahModel[]> {
        if (this.ayahsCache) return this.ayahsCache;

        const csv = await this.GetData(UrlResource.AyahsList_CSV_Url);

        const parsed = Papa.parse<AyahModel>(csv, {
            header: true,
            skipEmptyLines: true,
            dynamicTyping: true
        });

        this.ayahsCache = parsed.data;
        return this.ayahsCache;
    }

}

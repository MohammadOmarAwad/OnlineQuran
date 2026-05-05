import Papa from "papaparse";
import { UrlResource } from "../Resources/UrlResource";
import { SurahModel } from "../Models/SurahModel";
import { AyahModel } from "../Models/AyahModel";

export class DataService {

    private static surahsCache: SurahModel[] | null = null;
    private static ayahsCache: AyahModel[] | null = null;

    //Get List of SurahList
    static async GetSurahsData(): Promise<SurahModel[]> {
        if (this.surahsCache) return this.surahsCache;

        const csv = await this.GetData(UrlResource.SurahsList_CSV_Url);
        const parsed = this.parseCsv<SurahModel>(csv);

        this.surahsCache = parsed.data;
        return this.surahsCache;
    }

    //Get List of AyahList
    static async GetAyasData(): Promise<AyahModel[]> {
        if (this.ayahsCache) return this.ayahsCache;

        const csv = await this.GetData(UrlResource.AyahsList_CSV_Url);
        const parsed = this.parseCsv<AyahModel>(csv);

        this.ayahsCache = parsed.data;
        return this.ayahsCache;
    }

    //Parse the CSV Rows
    private static parseCsv<T>(csv: string) {
        return Papa.parse<T>(csv, {
            header: true,
            skipEmptyLines: true,
            dynamicTyping: true
        });
    }

    // Get Data as Text
    private static async GetData(url: string): Promise<string> {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        return await response.text(); // ✅ correct
    }

}

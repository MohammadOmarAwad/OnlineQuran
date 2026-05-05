import Papa from "papaparse";
import { UrlResource } from "../Resources/UrlResource";
import { SurahModel } from "../Models/SurahModel";
import { AyahModel } from "../Models/AyahModel";
import { ReciterModel } from "../Models/ReciterModel";
import { TafserModel } from "../Models/TafserModel";

export class DataService {

    private static surahsCache: SurahModel[] | null = null;
    private static ayahsCache: AyahModel[] | null = null;
    private static RecitersCache: ReciterModel[] | null = null;
    private static tafsersCache: TafserModel[] | null = null;

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

    //Get List of Reciter
    static async GetRecitersData(): Promise<ReciterModel[]> {
        if (this.RecitersCache) return this.RecitersCache;

        const csv = await this.GetData(UrlResource.RecitersList_Url);
        const parsed = this.parseCsv<ReciterModel>(csv);

        this.RecitersCache = parsed.data;
        return this.RecitersCache;
    }

    //Get List of Ayahs Tafser
    static async GetTafsersData(): Promise<TafserModel[]> {
        if (this.tafsersCache) return this.tafsersCache;

        const csv = await this.GetData(UrlResource.TafserAyahList_Url);
        const parsed = this.parseCsv<TafserModel>(csv);

        this.tafsersCache = parsed.data;
        return this.tafsersCache;
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

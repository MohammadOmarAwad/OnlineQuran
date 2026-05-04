import { SurahModel } from "../Models/SurahModel";
import Papa from "papaparse";
import { UrlResource } from "../Resources/UrlResource";

export class DataService {

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
        const csv = await this.GetData(UrlResource.SurahsList_CSV_Url);

        const parsed = Papa.parse<SurahModel>(csv, {
            header: true,
            skipEmptyLines: true,
            dynamicTyping: true
        });

        return parsed.data;
    }

}
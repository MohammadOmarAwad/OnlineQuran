export class QuranPage {
  SurahNames: String = "";
  Ayas: Aya[] = [];
}


export interface Aya {
  index: string
  sura: string
  aya: String
  text: string
  simple: string
  juz: string
  hizb: string
  page: String
  word: string
  text_uthmani: string
  rub: string
  verse_key: string
  theletter: number
  nim: string
  verse_Id?: string
  surah_Infos: any
}
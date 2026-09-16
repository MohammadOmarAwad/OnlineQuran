import { Injectable } from "@angular/core";
import { StringResource } from "../Resources/StringResource";
import { AyahModel } from "../Models/AyahModel";
import { UrlResource } from "../Resources/UrlResource";
import { TextService } from "./Text.Service";
import { ToastrService } from "ngx-toastr";
import { Clipboard } from '@angular/cdk/clipboard';
import { DataService } from "./Data.Service";

@Injectable({
    providedIn: 'root'
})

export class UtiltitiesService {
    AyahsList: AyahModel[] = [];

    // Dependency Injection constructor setup
    constructor(
        private clipboard: Clipboard,
        private toastr: ToastrService
    ) { }

    // Show the MenuList
    public async ShowMenuList(x: number, y: number, targetSpan: HTMLSpanElement): Promise<void> {
        // Remove any previously opened menus
        const existingMenu = document.querySelector('.custom-menu-list');
        if (existingMenu) existingMenu.remove();

        const menu = document.createElement('div');
        menu.className = 'custom-menu-list';

        menu.style.position = 'fixed';
        menu.style.top = `${y}px`;
        menu.style.left = `${x}px`;
        menu.style.zIndex = '1000';

        const options = [
            StringResource.Copy,
            StringResource.RunSound
        ];

        options.forEach((optionText) => {
            const item = document.createElement('div');
            item.className = 'menu-item';
            item.textContent = optionText;

            item.addEventListener('click', () => {
                this.DoActionMenu(optionText, targetSpan);
                menu.remove();
            });

            menu.appendChild(item);
        });

        document.body.appendChild(menu);

        // Close the menu if the user left-clicks anywhere else on the screen
        const closeMenu = () => {
            menu.remove();
            window.removeEventListener('click', closeMenu);
        };
        window.addEventListener('click', closeMenu);
    }

    // Excute Action of Menu
    private DoActionMenu(menuOption: string, targetSpan: HTMLSpanElement): void {

        console.log(`Action Type : ${menuOption} on:`, targetSpan);

        const clickedAyaId = targetSpan.dataset['ayaId']?.toString();
        const clickedSurahId = targetSpan.dataset['surahId']?.toString();

        switch (menuOption) {
            case StringResource.Copy:
                this.CopyAya(Number(clickedSurahId), Number(clickedAyaId));
                break;
            case StringResource.RunSound:
                this.Run_Audio(Number(clickedSurahId), Number(clickedAyaId));
                break;
        }
    }

    // Copy Ayah to ClipBoard
    private async CopyAya(sura: number, aya: number): Promise<void> {
        let AyaInfo: AyahModel | undefined;

        this.AyahsList = await DataService.GetAyasData();

        AyaInfo = this.AyahsList.find(a => a.SuraNr === sura && a.AyaNr === aya);
        if (AyaInfo != undefined) {
            //string interpolation in TypeScript (like C#’s $"..." syntax).
            let textToCopy = `
            ${AyaInfo.Text_Uthmani} (${AyaInfo.AyaNr}) [${AyaInfo.surah_Infos.AName}]

            ${UrlResource.OnlineQuran_Url}/quran/${AyaInfo.PageNr}`;

            this.clipboard.copy(textToCopy);

            this.toastr.success(TextService.FormatMessage(StringResource.QuranPage_CopyMessage, AyaInfo.AyaNr, AyaInfo.surah_Infos.AName));
        }
    }


    // Run Ayah Sound
    public async Run_Audio(sura: number, aya: number): Promise<void> {

        const audio = document.getElementById("quranAudioPlayer") as HTMLAudioElement;
        audio.src = "";

        if (sura == 0 && aya == 0)
            return;

        const _sura = sura.toString().padStart(3, '0');
        const _aya = aya.toString().padStart(3, '0');
        const verse_Id = `${_sura}${_aya}.mp3`;

        const selectElement = document.getElementById('reciter') as HTMLSelectElement;
        const selectedRecitor = selectElement.value;

        const divElement = document.getElementById('SoundPlayerId') as HTMLDivElement;
        divElement.style.display = "block";

        if (audio) {
            audio.pause();
            audio.src = selectedRecitor + verse_Id;
            audio.currentTime = 0;
            audio.play();
        }
    }

}
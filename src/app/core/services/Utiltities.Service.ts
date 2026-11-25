import { Injectable } from "@angular/core";
import { StringResource } from "../resources/StringResource";
import { UrlResource } from "../resources/UrlResource";
import { TextService } from "./Text.Service";
import { ToastrService } from "ngx-toastr";
import { Clipboard } from '@angular/cdk/clipboard';
import { DataService } from "./Data.Service";
import { AyahModel } from "../models/AyahModel";

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
        menu.style.zIndex = '1000';

        document.body.appendChild(menu);

        // Get menu dimensions and viewport boundaries
        const rect = menu.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const padding = 8; // Small margin from screen edge

        let adjustedX = x;

        // Flip/shift left if overflowing the right edge
        if (x + rect.width > viewportWidth) {
            adjustedX = Math.max(padding, x - rect.width);
        }

        menu.style.left = `${adjustedX}px`;
        menu.style.top = `${y - 15}px`;

        const options = [
            StringResource.Copy,
            StringResource.RunSound,
            StringResource.Text_to_Letters
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
            case StringResource.Text_to_Letters:
                this.Text_To_Letter(Number(clickedSurahId), Number(clickedAyaId));
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

    // Show text as letters
    public async Text_To_Letter(sura: number, aya: number): Promise<void> {
        let AyaInfo: AyahModel | undefined;

        this.AyahsList = await DataService.GetAyasData();

        AyaInfo = this.AyahsList.find(a => a.SuraNr === sura && a.AyaNr === aya);

        if (AyaInfo?.Text_Uthmani == null) return;
        const segmenter = new Intl.Segmenter('ar', { granularity: 'grapheme' });
        const graphemes = Array.from(segmenter.segment(AyaInfo?.Text_Uthmani), s => s.segment);

        let result = '';

        let span = "<span class='cls'>";
        for (const grapheme of graphemes) {
            if (grapheme === ' ') {
                span += "</span>";
                result += span;
                result += ' \u00A0\u00A0\u00A0\u00A0 ';
                span = "<span class='cls'>";
            }
            span += ' ' + grapheme;

            await new Promise(resolve => setTimeout(resolve));
        }
        result += span;

        result += ` <span class='cls'> (${aya})</span>`;
        console.log(result);

        this.toastr.show(result, '', {
            enableHtml: true,
            toastClass: 'ngx-toastr custom-ayah-toast',
            positionClass: 'toast-top-center',
            timeOut: 80000
        });
    }

    //Set CssStyle to Element
    public async SetElementStyle(id: string, property: keyof CSSStyleDeclaration, value: string): Promise<void> {
        const element = document.getElementById(id);
        if (element) {
            (element.style as any)[property] = value;
        }
    }

}
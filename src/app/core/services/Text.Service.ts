export class TextService {

    //Is the Device Mobile
    static isMobile(): Boolean { return window.matchMedia('(pointer: coarse)').matches };

    //Replace Brackets 
    static bracketsReplacer(val: String): String {
        let output: String = "";
        output = val;

        if (this.isMobile()) {
            output = val.replaceAll('﴿', '(').replaceAll('﴾', ')');
        }

        return output;
    }

    //Remove Brackets
    static bracketsRemover(val: String): String {
        let output: String = "";
        output = val;

        output = val.replaceAll('﴿', '').replaceAll('﴾', '').replaceAll('(', '').replaceAll(')', '');

        return output;
    }

    //Replace Alef
    static ReplaceAlef(input: string): string {
        const chars: string[] = ['ٱ', 'إ', 'أ', 'آ'];

        let result = input;

        for (const ch of chars) {
            result = result.replace(new RegExp(ch, 'g'), 'ا');
        }

        return result;
    }

    //Add Texts Pieces to Sentence
    static FormatMessage(message: string, ...args: any[]): string {
        return message.replace(/{(\d+)}/g, (match, index) => {
            return typeof args[index] !== 'undefined' ? args[index] : match;
        });
    }
}
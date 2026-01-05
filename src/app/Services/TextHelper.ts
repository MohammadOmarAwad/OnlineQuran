export class TextHelper {

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
}
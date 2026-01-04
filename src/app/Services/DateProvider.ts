import moment from 'moment-hijri';


export default class DateProvider {

    //Get Current Date
    static GetDate() { return this.formatDateDMY(new Date); }

    //Date Formating
    static formatDateDMY(date: Date): string {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        return `${day}-${month}-${year}`;
    }

    //Get Hirjri Date
    static GetHijriDate() { return moment().format('iD iMMMM iYYYY هـ'); }

    //Get Hirjri Year
    static GetHijriDateYear() { return moment(this.GetDate(), 'DD-MM-YYYY').iYear() }

    //Get Hirjri Month
    static GetHijriDateMonth() { return moment().iMonth() + 1; }
}
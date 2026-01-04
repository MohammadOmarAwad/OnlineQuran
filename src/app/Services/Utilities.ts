import moment from 'moment-hijri';


export default class Utilities {

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
    static GrtHijriDate() { return moment().format('iD iMMMM iYYYY هـ'); }

    //Get Hirjri Year
    static GrtHijriDateYear() { return moment(this.GetDate(), 'DD-MM-YYYY').iYear() }

    //Get Hirjri Month
    static GrtHijriDateMonth() { return moment().iMonth() + 1; }

    //Get Location 
    static getLocation(): Promise<[string, string]> {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject('Geolocation not supported');
                return;
            }

            navigator.geolocation.getCurrentPosition(
                pos => {
                    resolve([
                        pos.coords.latitude.toString(),
                        pos.coords.longitude.toString()
                    ]);
                },
                err => reject(err)
            );
        });
    }
    
    //Get City Name by geolocation
    static async getCityName(): Promise<string> {
        const [lat, lng] = await this.getLocation();

        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;

        const res = await fetch(url, {
            headers: {
                'User-Agent': 'Angular-App'
            }
        });

        const data = await res.json();

        return (
            data.address.city ||
            data.address.town ||
            data.address.village ||
            data.address.state
        );
    }
}
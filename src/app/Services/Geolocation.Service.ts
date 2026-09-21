import { UrlResource } from "../Resources/UrlResource";

export class GeolocationService {

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

        const url = `${UrlResource.OpenStreetMap}?format=json&lat=${lat}&lon=${lng}`;

        const res = await fetch(url, {
            headers: {
                'User-Agent': 'Angular-App',
                'accept-language': 'en-US,en;q=0.9,ar-JO;q=0.8,ar;q=0.7,en-GB;q=0.6,tr-TR;q=0.5,tr;q=0.4,de-DE;q=0.3,de;q=0.2'
            }
        });

        const data = await res.json();
        const city = data.address.city || data.address.town || data.address.village || data.address.state;
        const country = data.address.country;
        const output=`${city}, ${country}`;
        
        return  output;
    }
}
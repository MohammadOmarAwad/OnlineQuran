

export default class GeolocationProvider {

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
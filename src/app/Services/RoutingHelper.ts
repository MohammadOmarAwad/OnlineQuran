export class RoutingHelper {

    //Open New Tab
    static OpenTab(url: string): void {
        if (!url) return;

        window.open(url, "_blank");
    }
}
import { CalculationMethod } from "../Models/CalculationMethodModel";

export class PrayerCalculationMethods {


    public static readonly school: CalculationMethod[] = [
        { id: 0, name: "شافعي / مالكي / حنبلي" },
        { id: 1, name: "حنفي" }
    ];

    public static readonly latitudeAdjustmentMethod: CalculationMethod[] = [
        { id: 1, name: "Middle of the Night" },
        { id: 2, name: "One Seventh" },
        { id: 3, name: "Angle Based" },
    ];

    public static readonly method: CalculationMethod[] = [
        { id: 0, name: "جعفري / شيعة إثنا عشرية" },
        { id: 1, name: "جامعة العلوم الإسلامية بكراتشي" },
        { id: 2, name: "الجمعية الإسلامية لأمريكا الشمالية (ISNA)" },
        { id: 3, name: "رابطة العالم الإسلامي" },
        { id: 4, name: "جامعة أم القرى، مكة المكرمة" },
        { id: 5, name: "الهيئة المصرية العامة للمساحة" },
        { id: 7, name: "معهد الجيوفيزياء بجامعة طهران" },
        { id: 8, name: "منطقة الخليج العربي" },
        { id: 9, name: "الكويت" },
        { id: 10, name: "قطر" },
        { id: 11, name: "المجلس الإسلامي السنغافوري" },
        { id: 12, name: "اتحاد المنظمات الإسلامية في فرنسا" },
        { id: 13, name: "رئاسة الشؤون الدينية التركية (ديانت)" },
        { id: 14, name: "الإدارة الدينية لمسلمي روسيا" },
        { id: 15, name: "لجنة رصد الأهلة العالمية (تتطلب معامل الشفق)" },
        { id: 16, name: "دبي (تجريبي)" },
        { id: 17, name: "دائرة التطوير الإسلامي الماليزية (JAKIM)" },
        { id: 18, name: "تونس" },
        { id: 19, name: "الجزائر" },
        { id: 20, name: "وزارة الشؤون الدينية الإندونيسية (KEMENAG)" },
        { id: 21, name: "المغرب" },
        { id: 22, name: "المركز الإسلامي في لشبونة" },
        { id: 23, name: "وزارة الأوقاف والشؤون والمقدسات الإسلامية، الأردن" },
        { id: 99, name: " 99 طريقة مخصصة" }
    ];

    public static getMethodName(id: number): string {
        const found = this.method.find(m => m.id === id);
        return found ? found.name : 'Unknown Method';
    }

    public static getSchoolName(id: number): string {
        const found = this.school.find(m => m.id === id);
        return found ? found.name : 'Unknown school';
    }
}

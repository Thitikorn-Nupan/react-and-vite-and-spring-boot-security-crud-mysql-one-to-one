export class UtcService {
    static convertUTCToLocalTimeForShowOnCustomerTable = (utcTimestamp: string) => {
        // Create a Date object from the UTC timestamp
        const utcDate = new Date(utcTimestamp);
        // Calculate the local time by adding the time zone offset
        utcDate.setTime(utcDate.getTime());
        // Format the local date and time as desired
        // const localDate = new Intl.DateTimeFormat('en-US', {
        //     year: 'numeric',
        //     month: '2-digit',
        //     day: '2-digit',
        //     hour: '2-digit',
        //     minute: '2-digit',
        //     second: '2-digit'
        // }).format(utcDate);
        // return localDate;
        let mount, day, hour, minute = ""
        const mountAsInt = utcDate.getMonth() + 1;
        if (mountAsInt - 1 < 9) {
            mount = "0" + mountAsInt;
        } else {
            mount = "" + mountAsInt
        }

        if (utcDate.getDate() < 9) {
            day = "0" + utcDate.getDate();
        } else {
            day = "" + utcDate.getDate();
        }

        if (utcDate.getHours() < 10) {
            hour = "0" + utcDate.getHours();
        } else {
            hour = "" + utcDate.getHours();
        }

        if (utcDate.getMinutes() < 10) {
            minute = "0" + utcDate.getMinutes();
        } else {
            minute = "" + utcDate.getMinutes();
        }


        return `${day}/${mount}/${utcDate.getFullYear()} ${hour}:${minute}`;
    }
    static convertUTCToLocalTimeForInputTypeDate = (utcTimestamp: string) => {
        const utcDate = new Date(utcTimestamp);
        utcDate.setTime(utcDate.getTime());
        let mount, day = ""
        const mountAsInt = utcDate.getMonth() + 1;
        if (mountAsInt - 1 < 9) {
            mount = "0" + mountAsInt;
        } else {
            mount = "" + mountAsInt
        }

        if (utcDate.getDate() < 9) {
            day = "0" + utcDate.getDate();
        } else {
            day = "" + utcDate.getDate();
        }

        return `${utcDate.getFullYear()}-${mount}-${day}`; // need format like this
    }
    static convertUTCToLocalTimeForShowOnDetailTable = (utcTimestamp: string) => {
        const utcDate = new Date(utcTimestamp);
        utcDate.setTime(utcDate.getTime());
        let mount, day = ""
        const mountAsInt = utcDate.getMonth() + 1;
        if (mountAsInt - 1 < 9) {
            mount = "0" + mountAsInt;
        } else {
            mount = "" + mountAsInt
        }

        if (utcDate.getDate() < 9) {
            day = "0" + utcDate.getDate();
        } else {
            day = "" + utcDate.getDate();
        }

        return `${day}/${mount}/${utcDate.getFullYear()}`;
    }
}
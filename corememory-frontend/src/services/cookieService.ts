class CookieService {
    async getCookie(name: string): Promise<string | null> {
        // console.log("Checking cookie for:", name); // for debug
        return new Promise((resolve) => {
            const nameEQ = encodeURIComponent(name) + "=";
            const cookies = document.cookie.split(";");

            // console.log("Cookies in document:", document.cookie); // for debug

            for (const cookie of cookies) {
                const trimmedCookie = cookie.trim();
                if (trimmedCookie.startsWith(nameEQ)) {
                    // console.log("Found cookie:", trimmedCookie); // for debug
                    resolve(
                        decodeURIComponent(
                            trimmedCookie.substring(nameEQ.length)
                        )
                    );
                    return;
                }
            }
            resolve(null);
        });
    }

    async addCookie(
        name: string,
        value: string,
        expiresInHours: number = 1
    ): Promise<void> {
        const expires = this.getExpiresString(expiresInHours);
        const encodedName = encodeURIComponent(name);
        const encodedValue = encodeURIComponent(value);
        document.cookie = `${encodedName}=${encodedValue}${expires}; path=/`;
    }

    async destroyCookie(name: string): Promise<void> {
        const encodedName = encodeURIComponent(name);
        document.cookie = `${encodedName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    }

    private getExpiresString(hours: number): string {
        const date = new Date();
        date.setTime(date.getTime() + hours * 60 * 60 * 1000);
        return "; expires=" + date.toUTCString();
    }
}

export default CookieService;

//* create
// await cookieService.addCookie("username", "JohnDoe", 2); // Expires in 2 hours

//* get
// const cookieValue = await cookieService.getCookie("username");

//* delete
// await cookieService.destroyCookie("username");

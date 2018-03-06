// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
    production: false,
    firebase: {
        apiKey: "AIzaSyC1G21T3g-hOO4oc-yeoZUjh8VgmXUzYN8",
        authDomain: "ritualspadev.firebaseapp.com",
        databaseURL: "https://ritualspadev.firebaseio.com",
        projectId: "ritualspadev",
        storageBucket: "ritualspadev.appspot.com",
        messagingSenderId: "1055911073424"
    }
};

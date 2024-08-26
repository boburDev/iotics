// error_code: "hatoliklarni code X.XXX.XXX",
// error_operation: "Qayerdan chiqvoti",
// error_message: "Clientga chiqib keladigan habar",
// error_body: "Har qanday hatolikni butunligicha",
// code_user: "Client koradigan hatolik",
// recommendations: "Hatolikni client koradigan description",
// error_description: "Hatolikni hech kim kormaydigan description",



/* 
    0 = Serverdagi hamma cache dagi hatolar
    1 = Hamma serverdagi hatolar (Masalan json file topilmay qolishi)
    2 = Loop da chiqishi mumkun bolgan barcha hatolar hatto catchlar ham
    3 = Request journalidagi barcha holatlar
    4 = 
*/

/* (0)
    0 = Vasheee kutilmagan hato
    1 - 10 = Bad Request
    11 - 29 = auth log
    30 - 59 = admin log
    60 - 89 = copy log
    90 - 119 = 
*/

/* (3)
    0 - 199.999 = Stop ichidagi
    200.000 - 399.999 = Successful ichidagi
    400.000 - 699.999 = Error ichidagi
    700.000 - 999.999 = Missed ichidagi
    ex: 3.199.999
*/

/* 
    device_id: "66a0e9dd1522ea20b86baede",
    month: 0,
    data: {
        1: {
            full: true,
            day: [
                {
                    time: new Date("2024-07-24T13:10:56.005Z"),
                    values: {
                        "parameter_short_name": 12000,
                        "parameter_short_name": 12000,
                        "parameter_short_name": 12000,
                        "parameter_short_name": 12000,
                    }
                },
                {
                    time: new Date("2024-07-24T13:10:56.005Z"),
                    values: {
                        "parameter_short_name": 12000,
                        "parameter_short_name": 12000,
                        "parameter_short_name": 12000,
                        "parameter_short_name": 12000,
                    }
                }
            ]
        },
        2: {
            full: true,
            day: [
                {
                    time: new Date("2024-07-24T13:10:56.005Z"),
                    values: {
                        "parameter_short_name": 12000,
                        "parameter_short_name": 12000,
                        "parameter_short_name": 12000,
                        "parameter_short_name": 12000,
                    }
                },
                {
                    time: new Date("2024-07-24T13:10:56.005Z"),
                    values: {
                        "parameter_short_name": 12000,
                        "parameter_short_name": 12000,
                        "parameter_short_name": 12000,
                        "parameter_short_name": 12000,
                    }
                }
            ]
        }
    }
*/

/* 
    device_id: "66a0e9dd1522ea20b86baede",
    month: new Date("2024-07-24T13:10:56.005Z"),
    data: {
        1: {
            "parameter_A+": 12000,
            "parameter_A-": 12000,
            "parameter_R+": 12000,
            "parameter_R-": 12000,

            "parameter_A+_tarif1": 12000,
            "parameter_A-_tarif1": 12000,
            "parameter_R+_tarif1": 12000,
            "parameter_R-_tarif1": 12000,

            "parameter_A+_tarif2": 12000,
            "parameter_A-_tarif2": 12000,
            "parameter_R+_tarif2": 12000,
            "parameter_R-_tarif2": 12000,

            "parameter_A+_tarif3": 12000,
            "parameter_A-_tarif3": 12000,
            "parameter_R+_tarif3": 12000,
            "parameter_R-_tarif3": 12000,

            "parameter_A+_tarif4": 12000,
            "parameter_A-_tarif4": 12000,
            "parameter_R+_tarif4": 12000,
            "parameter_R-_tarif4": 12000,
        },
    }
*/
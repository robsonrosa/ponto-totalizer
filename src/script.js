new PontoTotalizerPlus({
    fields: ['FirstIn', 'FirstOut', 'SecondIn', 'SecondOut', 'ThirdIn', 'ThirdOut', 'ForthIn', 'ForthOut'],
    rules: [
        new MaxWorkTurnDurationValidationRule({ limitInHours: 6 }),
        new MaxWorkDayDurationValidationRule({ limitInHours: 10 }),
        new MinLunchIntervalValidationRule({ limitInHours: 1 }),
    ]
}).start();
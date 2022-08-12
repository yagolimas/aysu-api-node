import Session from './domain/Session'
import Patient from './domain/Patient'

test("Creating a session and calculating the average heart rate", function() {
    // dado que 
    const session = new Session()
    session.addHeartRate({ time: '00:00:05', value: 60 })
    session.addHeartRate({ time: '00:00:10', value: 62 })
    session.addHeartRate({ time: '00:00:15', value: 60 })
    session.addHeartRate({ time: '00:00:20', value: 80 })
    // quando
    const avgHeartRate = session.getAvgHeartRate()
    // espera-se que
    expect(avgHeartRate).toBe(65.5)
});

test("Creating a session and calculating the maximum heart rate", function() {
    const session = new Session()
    session.addHeartRate({ time: '00:00:05', value: 60 })
    session.addHeartRate({ time: '00:00:10', value: 62 })
    session.addHeartRate({ time: '00:00:15', value: 60 })
    session.addHeartRate({ time: '00:00:20', value: 80 })
    const maxHeartRate = session.getMaxHeartRate()
    expect(maxHeartRate).toBe(80)
});

test("Creating a session and calculating the maximum heart rate VO2", function() {
    const session = new Session()
    session.addHeartRate({ time: '00:00:05', value: 60 })
    session.addHeartRate({ time: '00:00:10', value: 62 })
    session.addHeartRate({ time: '00:00:15', value: 60 })
    session.addHeartRate({ time: '00:00:20', value: 80 })
    const maxVO2Result = session.getMaxVO2Result()
    expect(maxVO2Result).toBe(3.03)
});

test("Creating a session and calculating the average VO2", function() {
    const session = new Session()
    session.addHeartRate({ time: '00:00:05', value: 60 })
    session.addHeartRate({ time: '00:00:10', value: 62 })
    session.addHeartRate({ time: '00:00:15', value: 60 })
    session.addHeartRate({ time: '00:00:20', value: 80 })
    const avgVO2Result = session.getAvgVO2Result()
    expect(avgVO2Result).toBe(1.56)
});

test("Creating a session and calculating the total hours", function() {
    const session = new Session()
    session.addHeartRate({ time: '00:00:60', value: 130 })
    session.addHeartRate({ time: '00:01:10', value: 120 })
    session.addHeartRate({ time: '00:05:15', value: 120 })
    session.addHeartRate({ time: '01:10:20', value: 125 })
    const totalHoursSessionResult = session.getTimeHoursTotal()
    expect(totalHoursSessionResult).toBe(1.17)
});

test("Creating a session and calculating the total minutes", function() {
    const session = new Session()
    session.addHeartRate({ time: '00:00:60', value: 130 })
    session.addHeartRate({ time: '00:01:10', value: 120 })
    session.addHeartRate({ time: '00:05:15', value: 120 })
    session.addHeartRate({ time: '01:10:00', value: 125 })
    const totalHoursSessionResult1 = session.getTimeMinutesTotal()
    expect(totalHoursSessionResult1).toBe(70)
    const totalHoursSessionResult2 = session.getTimeMinutesTotal()
    expect(totalHoursSessionResult2).toBe(70)
});

test("Creating a session and calculating the total calories", function() {
    const session = new Session()
    session.addHeartRate({ time: '00:00:10', value: 130 })
    session.addHeartRate({ time: '00:20:10', value: 120 })
    session.addHeartRate({ time: '00:40:10', value: 120 })
    session.addHeartRate({ time: '01:00:10', value: 125 })
    session.setPatient(new Patient('1', 85, 29, 'M' ))
    const totalCaloriesResult = session.getTotalCaloriesResult()
    expect(totalCaloriesResult).toBe(353)
});

test("Creating a session and calculating the TRIMP", function() {
    const session = new Session()
    session.addHeartRate({ time: '00:10:00', value: 130 })
    session.addHeartRate({ time: '00:20:00', value: 120 })
    session.addHeartRate({ time: '00:30:00', value: 220 })
    session.addHeartRate({ time: '00:40:00', value: 125 })
    session.setPatient(new Patient('1', 85, 29, 'M' ))
    const trimpResult = session.getTrimpResult()
    expect(trimpResult).toBe(40)
});

test("Creating a Session and Calculating the RMSSD", function() {
    const session = new Session()
    session.addHeartRate({ time: '00:10:00', value: 70, rrInterval: 700 })
    session.addHeartRate({ time: '00:20:00', value: 90, rrInterval: 740 })
    session.addHeartRate({ time: '00:30:00', value: 98, rrInterval: 800 })
    session.addHeartRate({ time: '00:40:00', value: 110, rrInterval: 820 })
    session.addHeartRate({ time: '00:50:00', value: 115, rrInterval: 810 })
    session.addHeartRate({ time: '01:00:00', value: 113, rrInterval: 800 })
    session.addHeartRate({ time: '01:10:00', value: 118, rrInterval: 830 })
    session.addHeartRate({ time: '01:20:00', value: 104, rrInterval: 850 })
    session.addHeartRate({ time: '01:30:00', value: 120, rrInterval: 910 })
    session.addHeartRate({ time: '01:40:00', value: 118, rrInterval: 900 })
    session.addHeartRate({ time: '01:40:00', value: 110, rrInterval: 840 })
    const rmssdResult = session.getRootMeanSquareSuccesiveDifferences()
    expect(rmssdResult).toBe(37.95)
})

test("Creating a Session and Calculating the SDNN", function() {
    const session = new Session()
    session.addHeartRate({ time: '00:01:00', value: 70, rrInterval: 760 })
    session.addHeartRate({ time: '00:02:00', value: 90, rrInterval: 780 })
    session.addHeartRate({ time: '00:03:00', value: 98, rrInterval: 720 })
    session.addHeartRate({ time: '00:04:00', value: 110, rrInterval: 770 })
    session.addHeartRate({ time: '00:05:00', value: 115, rrInterval: 750 })

    session.addHeartRate({ time: '00:06:00', value: 113, rrInterval: 720 })
    session.addHeartRate({ time: '00:07:00', value: 118, rrInterval: 750 })
    session.addHeartRate({ time: '00:08:00', value: 104, rrInterval: 780 })
    session.addHeartRate({ time: '00:09:00', value: 120, rrInterval: 720 })
    session.addHeartRate({ time: '00:10:00', value: 118, rrInterval: 750 })
    
    session.addHeartRate({ time: '00:11:00', value: 113, rrInterval: 820 })
    session.addHeartRate({ time: '00:12:00', value: 118, rrInterval: 760 })
    session.addHeartRate({ time: '00:13:00', value: 104, rrInterval: 790 })
    session.addHeartRate({ time: '00:14:00', value: 120, rrInterval: 830 })
    session.addHeartRate({ time: '00:15:00', value: 118, rrInterval: 770 })

    session.addHeartRate({ time: '00:16:00', value: 113, rrInterval: 840 })
    session.addHeartRate({ time: '00:17:00', value: 118, rrInterval: 800 })
    session.addHeartRate({ time: '00:18:00', value: 104, rrInterval: 850 })
    session.addHeartRate({ time: '00:19:00', value: 120, rrInterval: 880 })
    session.addHeartRate({ time: '00:20:00', value: 118, rrInterval: 920 })
    
    session.addHeartRate({ time: '00:21:00', value: 113, rrInterval: 980 })
    session.addHeartRate({ time: '00:22:00', value: 118, rrInterval: 830 })
    session.addHeartRate({ time: '00:23:00', value: 104, rrInterval: 850 })
    session.addHeartRate({ time: '00:24:00', value: 120, rrInterval: 920 })
    session.addHeartRate({ time: '00:25:00', value: 118, rrInterval: 1000 })
    
    session.addHeartRate({ time: '00:26:00', value: 113, rrInterval: 1040 })
    session.addHeartRate({ time: '00:27:00', value: 118, rrInterval: 980 })
    session.addHeartRate({ time: '00:28:00', value: 104, rrInterval: 900 })
    session.addHeartRate({ time: '00:29:00', value: 120, rrInterval: 1000 })
    session.addHeartRate({ time: '00:30:00', value: 118, rrInterval: 1130 })

    const sdnnResult = session.getStandardDeviationOfNN()
    expect(sdnnResult).toBe(103)
})
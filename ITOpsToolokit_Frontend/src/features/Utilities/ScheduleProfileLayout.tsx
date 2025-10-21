import { useState, useEffect } from "react";
import * as React from "react";
import { PatchPopup } from "../Components/KubernetesPopUp/PatchPopup"
import {
  Container, TextField, FormControl, FormLabel, RadioGroup, Radio,
  FormControlLabel, Checkbox, MenuItem, Button, Box, InputLabel
} from '@mui/material';
// import DateTimePicker from '@mui/lab/DateTimePicker';
import moment from "moment";
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import FormGroup from '@mui/material/FormGroup';
import dayjs, { Dayjs } from "dayjs";



export const ScheduleProfileLayout = (props) => {
  const Today = new Date()
  const [date, setDate] = useState(new Date());
  const [startDate, setStartDate] = React.useState<Dayjs | null>(
    dayjs(new Date())
  );
  const [endDate, setEndDate] = React.useState<Dayjs | null>(
    dayjs(new Date())
  );
  // const [days, setDays] = useState([]);
  const [weekly, setWeekly] = useState(true);
  const [monthly, setMonthly] = useState(false);
  const [quarterly, setQuarterly] = useState(false);
  const [yearly, setYearly] = useState(false);
  const [monthly1, setMonthly1] = useState(false);
  const [monthly2, setMonthly2] = useState(true);
  const [qut1, setQut1] = useState(false);
  const [qut2, setQut2] = useState(true);
  const Day = moment(Today).format('dddd')
  const Year = moment(Today).format('MMMM')
  const [end, setEnd] = useState(true);
  const [endAfter, setEndAfter] = useState(false);
  const [endAfterValue, setEndAfterValue] = useState<number>(1);
  const [noDate, setNoDate] = useState(true);
  let roundedDate = roundUpToNearestHalfHour(Today);
  const roundedNearestHalfHour = moment(roundedDate).format('HH:mm')
  const [startTime, setStartTime] = useState(roundedNearestHalfHour);
  const [everyWeek, setEveryWeek] = useState<number>(1);
  const [everyMonth, setEveryMonth] = useState<number>(1);
  const [everyDay, setEveryDay] = useState<number>(1);
  const [everyDay1, setEveryDay1] = useState<number>(1);
  const [everyYear, setEveryYear] = useState<number>(1);
  const [year, setYear] = useState<number>(1);
  const defaultNames = [Day];
  const [checkedValues, setCheckedValues] = useState(defaultNames);

  const [dayOf, setDayOf] = useState(Day)
  const [mon, setMon] = useState(Year)

  const [yer1, setYer1] = useState("first")
  const [yer2, setYer2] = useState(Day)
  const [yer3, setYer3] = useState(Year)

  const names = [
    'first', 'second', 'third', 'fourth', 'last'
  ];
  const weeks = [
    'day', 'weekday', 'weekend day', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
  ];
  const durationn = [
    '10 minutes', '15 minutes', '30 minutes', '1 hour', '2 hours', '3 hours', '4 hours', '5 hours', '6 hours', '7 hours', '8 hours', '9 hours', '10 hours', '11 hours',
    '12 hours', '18 hours', '1 day ', '2 days', '3 days', '4 days', '1 week', '2 weeks'
  ];
  const durat = [
    '00:00', '00:30', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00', '04:30', '05:00', '05:30', '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30',
    '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
    '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30', '24:00'
  ];
  const Weekly = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
  ];
  const Months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'];

  // const handleChange = (type) => {
  //   setWeekly(type === 'weekly');
  //   setMonthly(type === 'monthly');
  //   setQuarterly(type === 'quarterly');
  //   setYearly(type === 'yearly');
  // }

  // const onWeeklyChange = () => handleChange('weekly');
  // const onMonthlyChange = () => handleChange('monthly');
  // const onQuarterlyChange = () => handleChange('quarterly');
  // const onYearlyChange = () => handleChange('yearly');

  const onWeeklyChange = () => {
    setWeekly(!weekly)
    setMonthly(false)
    setQuarterly(false)
    setYearly(false)
  }
  const onMonthlyChange = () => {
    setWeekly(false)
    setMonthly(true)
    setQuarterly(false)
    setYearly(false)
  }
  const onQuarterlyChange = () => {
    setWeekly(false)
    setMonthly(false)
    setQuarterly(true)
    setYearly(false)
  }
  const onYearlyChange = () => {
    setWeekly(false)
    setMonthly(false)
    setQuarterly(false)
    setYearly(true)
  }
  const onMonthlyChange1 = () => {
    setMonthly1(false)
    setMonthly2(true)
  }
  const onQuarterlyChange1 = () => {
    setQut1(false)
    setQut2(true)
  }
  const onMonthlyChange2 = () => {
    setMonthly1(true)
    setMonthly2(false)
  }
  const onQuarterlyChange2 = () => {
    setQut1(true)
    setQut2(false)
  }

  // const handleChange1 = (type, value) => {
  //   if (type === 'monthly') {
  //     setMonthly1(value);
  //     setMonthly2(!value);
  //   } else if (type === 'quarterly') {
  //     setQut1(value);
  //     setQut2(!value);
  //   }
  // }

  // const onMonthlyChange1 = () => handleChange1('monthly', false);
  // const onMonthlyChange2 = () => handleChange1('monthly', true);
  // const onQuarterlyChange1 = () => handleChange1('quarterly', false);
  // const onQuarterlyChange2 = () => handleChange1('quarterly', true);

  const onChangeEnd = () => {
    setEnd(true)
    setEndAfter(false)
    setNoDate(false)
  }
  const onChangeEndAfter = () => {
    setEnd(false)
    setEndAfter(true)
    setNoDate(false)
  }
  const onChangeNoDate = () => {
    setEnd(false)
    setEndAfter(false)
    setNoDate(true)
  }


  const handleEndAfter = (e: any) => {
    setEndAfterValue(e.target.value);
  };
  const handleEveryWeek = (e: any) => {
    setEveryWeek(e.target.value);
  };
  const handleEveryMonth = (e: any) => {
    setEveryMonth(e.target.value);
  };
  const handleEveryDay = (e: any) => {
    setEveryDay(e.target.value);
  };
  const handleEveryDay1 = (e: any) => {
    setEveryDay1(e.target.value);
  };
  const handleEveryYear = (e: any) => {
    setEveryYear(e.target.value);
  };
  const handleChangeYear = (e: any) => {
    setYear(e.target.value);
  };

  const handleChangeStart = (event: any) => {
    setStartTime(event.target.value);
  };

  const handleChangeEnd = (event: any) => {
    setEndTime(event.target.value);
  };

  const handleChangeDuration = (event: any) => {
    setDuration(event.target.value);
  };


  const handleInputStart = (event: any) => {
    setStartTime(event.target.value);
  }

  const handleInputEnd = (event: any) => {
    setEndTime(event.target.value);
  }

  const handleInputDuration = (event: any) => {
    setDuration(event.target.value);
  }


  const handleInputFocusOut = (event: any) => {
    const fomateAfterEnteredValue = formatTo24HourTime(event.target.value);
    setStartTime(fomateAfterEnteredValue);
  }


  const [month, setMonth] = useState('first')
  const [qut, setQut] = useState('first')

  const handleChangeMonth = (event: SelectChangeEvent) => {
    setMonth(event.target.value);
  };

  const handleChangeQuarterly = (event: SelectChangeEvent) => {
    setQut(event.target.value);
  };

  const handleChangeDayOf = (event: SelectChangeEvent) => {
    setDayOf(event.target.value);
  };
  const handleChangeM = (event: SelectChangeEvent) => {
    setMon(event.target.value);
  };

  const handleChangeYer1 = (event: SelectChangeEvent) => {
    setYer1(event.target.value);
  };
  const handleChangeYer2 = (event: SelectChangeEvent) => {
    setYer2(event.target.value);
  };

  const handleChangeYer3 = (event: SelectChangeEvent) => {
    setYer3(event.target.value);
  };

  // const handleDaysChange = (event) => {
  //   const value = event.target.value;
  //   setDays(typeof value === 'string' ? value.split(',') : value);
  // };


  function dateFormatter(value) {
    const date = value?.toDate(); // Convert Day.js to Date object
    date?.setDate(date.getDate()); // Add one day
    const formattedDate = date?.toISOString().slice(0, 10);
    return formattedDate;
  }

  function handleSelect(checkedName) {
    const newNames = checkedValues?.includes(checkedName)
      ? checkedValues?.filter(name => name !== checkedName)
      : [...(checkedValues ?? []), checkedName];
    setCheckedValues(newNames);
    return newNames;
  }

  function convertTimeToMinutes(time, additionalMinutes) {
    // Split the time string into hours and minutes
    const [hours, minutes] = time.split(':').map(Number);
    // Convert hours to minutes and add the remaining minutes
    const totalMinutes = (hours * 60) + minutes;
    const newTotalMinutes = totalMinutes + additionalMinutes;

    return newTotalMinutes;
  }

  const additionalMinutes = 30; // need to set startTime here for dynamic
  const minutes = convertTimeToMinutes(startTime, additionalMinutes);

  function convertMinutesToTime(totalMinutes) {
    // Calculate hours and minutes
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    // Format hours and minutes to be two digits
    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');

    // Combine hours and minutes into HH:MM format
    return `${formattedHours}:${formattedMinutes}`;
  }

  function generateTimesUpTo24Hours(startTime, intervalMinutes) {
    const times = [];
    let [hours, minutes] = startTime.split(':').map(Number);
    let totalMinutes = (hours * 60) + minutes;

    while (totalMinutes < 24 * 60) {
      // Convert total minutes back to HH:MM format
      const currentHours = Math.floor(totalMinutes / 60);
      const currentMinutes = totalMinutes % 60;
      const formattedHours = String(currentHours).padStart(2, '0');
      const formattedMinutes = String(currentMinutes).padStart(2, '0');
      times.push(`${formattedHours}:${formattedMinutes}`);

      // Add the interval
      totalMinutes += intervalMinutes;
    }

    return times;
  }

  const time = convertMinutesToTime(minutes);
  const intervalMinutes = 30
  const times = generateTimesUpTo24Hours(time, intervalMinutes);
  const endtime = times[0]
  const [endTime, setEndTime] = useState(endtime);



  useEffect(() => {
    setEndTime(endtime)
  }, [])

  function roundUpToNearestHalfHour(date) {
    let minutes = date.getMinutes();
    let hours = date.getHours();

    if (minutes === 0) {
      minutes = 30;
    } else if (minutes <= 30) {
      minutes = 30;
    } else {
      minutes = 0;
      hours += 1;
    }

    date.setMinutes(minutes);
    date.setHours(hours);

    return date;
  }


  function formatTo24HourTime(input) {
    input = input.toString();
    let [hours, minutes] = input.split(':').map(Number);
    if (isNaN(minutes)) {
      minutes = 0;
    }
    let formattedHours = hours.toString().padStart(2, '0');
    let formattedMinutes = minutes.toString().padStart(2, '0');
    return `${formattedHours}:${formattedMinutes}`;
  }

  const fomateAfterEnteredValue = formatTo24HourTime(startTime);

  function timeDifference(startTime, endTime) {
    // Parse the start and end times
    let [startHours, startMinutes] = startTime.split(':').map(Number);
    let [endHours, endMinutes] = endTime.split(':').map(Number);

    // Create Date objects for the start and end times
    let startDate: any = new Date();
    startDate.setHours(startHours, startMinutes, 0, 0);

    let endDate: any = new Date();
    endDate.setHours(endHours, endMinutes, 0, 0);

    // Calculate the difference in milliseconds
    let diff = endDate - startDate;

    // Handle negative differences (if end time is before start time)
    if (diff < 0) {
      diff += 24 * 60 * 60 * 1000; // Add 24 hours in milliseconds
    }

    // Convert the difference to hours and minutes
    let diffHours = Math.floor(diff / (1000 * 60 * 60));
    let diffMinutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    let convertedMinutes = Math.floor(diffMinutes / 6);

    const onlyHours = convertedMinutes > 0 ? `${diffHours}.${convertedMinutes} hours` : diffHours === 1 ? `${diffHours} hour` : `${diffHours} hours`
    const min = `${diffMinutes} minutes`

    return diffHours > 0 ? onlyHours : min
  }
  const TimeDuration = `${timeDifference(startTime, endTime)}`
  const [duration, setDuration] = useState(TimeDuration)


  useEffect(() => {
    setDuration(TimeDuration)
  }, [TimeDuration])

  useEffect(() => {
    setEndTime(calculateEnd)
  }, [duration])

  function calculateEndTime(startTime, duration) {
    // Convert inputs to strings if they're not already
    startTime = startTime.toString();
    duration = duration.toString();

    // Parse the start time and duration
    let [startHours, startMinutes] = startTime.split(':').map(Number);
    let [durationHours, durationMinutes] = duration.split(':').map(Number);

    // Create a Date object for the start time
    let startDate = new Date();
    startDate.setHours(startHours, startMinutes, 0, 0);

    // Add the duration to the start time
    startDate.setHours(startDate.getHours() + durationHours);
    startDate.setMinutes(startDate.getMinutes() + durationMinutes);

    // Format the new end time
    let endHours = startDate.getHours().toString().padStart(2, '0');
    let endMinutes = startDate.getMinutes().toString().padStart(2, '0');

    return `${endHours}:${endMinutes}`;
  }


  function calculateEndTim(startTime, duration) {
    startTime = startTime.toString();

    // Parse the start time
    let [startHours, startMinutes] = startTime.split(':').map(Number);

    // Create a Date object for the start time
    let startDate = new Date();
    startDate.setHours(startHours, startMinutes, 0, 0);

    // Parse the duration
    let [amount, unit] = duration.split(' ');
    amount = parseInt(amount, 10);

    // Adjust the end time based on the duration unit
    switch (unit) {
      case 'minute':
      case 'minutes':
        startDate.setMinutes(startDate.getMinutes() + amount);
        break;
      case 'hour':
      case 'hours':
        startDate.setHours(startDate.getHours() + amount);
        break;
      case 'day':
      case 'days':
        startDate.setDate(startDate.getDate() + amount);
        break;
      case 'week':
      case 'weeks':
        startDate.setDate(startDate.getDate() + amount * 7);
        break;
      default:
        throw new Error('Invalid duration unit');
    }

    // Format the new end time
    let endHours = startDate.getHours().toString().padStart(2, '0');
    let endMinutes = startDate.getMinutes().toString().padStart(2, '0');

    return `${endHours}:${endMinutes}`;
  }
  const calculateEnd = ` ${calculateEndTim(startTime, duration)}`

  const fomatedstartDate = dateFormatter(startDate)
  const fomatedendDate = dateFormatter(endDate)

  const Recur = `Occurs every ${everyWeek > 1 ? `${everyWeek} weeks on` : `${checkedValues}`}  effective ${fomatedstartDate} until ${fomatedendDate} from ${startTime} to ${endTime}`
  //Occurs every Thursday effective 07-11-2024 until 24-04-2025 from 17:00 to 17:30  
  const handleSubmit = (e) => {
    e.preventDefault();
    props.onData(Recur);
    props.handleClose()
    props.handleStrDateFromChild(startDate)
    props.handleEndDateFromChild(endDate)
  };

  return <>
    <PatchPopup
      height={"43px"}
      width={"90px"}
      title="Schedule Profile"
      handleSave={props.handlePopUpSave}
      handleClose={props.handleClose}
      handleSubmit={handleSubmit}
      onData={props.onData}
      fromChildData={props.fromChildData}
    >
      <Container>
        <form className=" main patch_fnt" >
          <div className="row border_radius">
            <small className="borderText">Recurrence</small>
            <div className=" col-lg-6 d-flex ">
              <small className="patchhh_fnt">Start : </small>
              <div>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={['DatePicker']}>
                    <DatePicker
                      value={startDate}
                      onChange={(newValue) => {
                        setStartDate(newValue);
                      }}

                    />
                  </DemoContainer>
                </LocalizationProvider>
              </div>
            </div>
            <div className="d-flex col-lg-6">
              <div className="row">
                <div className="col-1">
                  <FormControl>
                    <RadioGroup
                      aria-labelledby="demo-radio-buttons-group-label"
                      defaultValue="Weekly"
                      name="radio-buttons-group"

                    >
                      <FormControlLabel value="End" onChange={onChangeEnd} control={<Radio size="small" />} label="" />
                      <FormControlLabel value="EndAfter" onChange={onChangeEndAfter} control={<Radio size="small" />} label="" />
                      <FormControlLabel value="NoDate" onChange={onChangeNoDate} control={<Radio size="small" />} label="" />
                    </RadioGroup>
                  </FormControl>
                </div>
                <div className="col-11 ">
                  <small>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={['DatePicker']}>
                        <small className="">  End: </small>
                        <DatePicker disabled={(endAfter || noDate) === true ? true : false}
                          value={endDate}
                          onChange={(newValue) => {
                            setEndDate(newValue);
                          }}


                        />
                      </DemoContainer>
                    </LocalizationProvider>
                    <small className="">
                      End after:
                      <input className="patch_input ptch" value={endAfterValue} onChange={handleEndAfter} disabled={(end || noDate) === true ? true : false} type="Number" name="other_reason" /> Occurrences </small><br />
                    <small className=""> No end date:</small>
                  </small>
                </div>

              </div>
            </div>
          </div>
          <div className="row border_radius marginTop">
            <small className="borderText1 borderText">Time</small>
            <div className="col-lg-6 d-flex">
              <small className="patchhh_fnt">Start : </small>
              <div>
                <input className="patch_input patch_border  " value={startTime} onBlur={handleInputFocusOut} onChange={handleInputStart} style={{ width: "100px", marginRight: "0" }} />
                <FormControl style={{ width: "25px" }} className="patch_select_border" fullWidth>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    onChange={handleChangeStart}
                  >
                    {durat.map((name) => (
                      <MenuItem
                        key={name}
                        value={name}
                      >
                        {name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

              </div>
            </div>

            <div className=" col-lg-6 d-flex">
              <small className="patchhh_fnt">Duration : </small>
              <div>
                <input className="patch_input patch_border  " value={duration} onChange={handleInputDuration} style={{ width: "100px", marginRight: "0" }} />
                <FormControl style={{ width: "25px" }} className="patch_select_border" fullWidth>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    onChange={handleChangeDuration}
                  >
                    {durationn.map((name) => (
                      <MenuItem
                        key={name}
                        value={name}
                      >
                        {name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

              </div>
            </div>
            <div className=" col-lg-6 d-flex">
              <small className="end_input">End : </small>
              <div>
                <input className="patch_input end_input" value={endTime} onChange={handleInputEnd} style={{ width: "100px", marginRight: "0" }} />

                <FormControl style={{ width: "25px" }} className="patch_select_border" fullWidth>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    onChange={handleChangeEnd}
                  >
                    {times.map((name) => (
                      <MenuItem
                        // style={{ display: "none" }} 
                        key={name}
                        value={name}
                      >
                        {name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

              </div>
            </div>
          </div>
          <div className="row border_radius ">
            <small className="borderText2 borderText">Pattern</small>
            <div className=" col-lg-2 d-flex mt-2 ">
              <div>
                <FormControl>
                  <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    defaultValue="Weekly"
                    name="radio-buttons-group"
                  >


                    <FormControlLabel value="Weekly" onChange={onWeeklyChange} control={<Radio size="small" />} label="Weekly" />
                    <FormControlLabel value="Monthly" onChange={onMonthlyChange} control={<Radio size="small" />} label="Monthly" />
                    <FormControlLabel value="Quarterly" onChange={onQuarterlyChange} control={<Radio size="small" />} label="Quarterly" />
                    <FormControlLabel value="Yearly" onChange={onYearlyChange} control={<Radio size="small" />} label="Yearly" />

                  </RadioGroup>
                </FormControl>
              </div>
            </div>
            <div className="my-4 col-lg-10 patch_pop">
              {weekly && <>
                <div>
                  <small>Recur every <input className="patch_input" value={everyWeek} onChange={handleEveryWeek} type="Number" name="other_reason" /> Weeks on:</small>
                </div>
                <div className="d-flex weekly_top">
                  <FormGroup
                    style={{ flexDirection: "row" }}
                  >
                    {Weekly.map(name => (
                      <FormControlLabel
                        control={
                          <Checkbox />}
                        checked={checkedValues.includes(name)}
                        name="names"
                        onChange={() => handleSelect(name)}
                        key={name}
                        label={name}
                      />
                    ))}
                  </FormGroup>

                </div>
              </>}
              {monthly && <>

                <div className="row">
                  <div className="col-1">
                    <FormControl>
                      <RadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        defaultValue="Weekly"
                        name="radio-buttons-group"
                      >
                        <FormControlLabel value="Weekly" onChange={onMonthlyChange1} control={<Radio size="small" />} label="" />
                        <FormControlLabel value="Monthly" onChange={onMonthlyChange2} control={<Radio size="small" />} label="" />
                      </RadioGroup>
                    </FormControl>
                  </div>
                  <div className="col-11 ">
                    <small>
                      Day <input type="Number" value={everyDay} onChange={handleEveryDay} disabled={monthly1 === true ? true : false} className="patch_input" name="other_reason" /> of every <input className="patch_input" disabled={monthly1 === true ? true : false} type="Numbers" name="other_reason" value={everyMonth} onChange={handleEveryMonth} /> months<br />
                      The  <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                        <Select
                          labelId="demo-select-small-label"
                          id="demo-select-small"
                          value={month}
                          onChange={handleChangeMonth}
                          disabled={monthly2 === true ? true : false}
                        >
                          {names.map((name, index) => (
                            <MenuItem
                              key={index}
                              value={name}
                            >
                              {name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                        <Select
                          labelId="demo-select-small-label"
                          id="demo-select-small"
                          value={dayOf}
                          onChange={handleChangeDayOf}
                          disabled={monthly2 === true ? true : false}
                        >

                          {weeks.map((week) => (
                            <MenuItem
                              key={week}
                              value={week}
                            >
                              {week}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      of every <input className="patch_input" value={everyDay1} onChange={handleEveryDay1} disabled={monthly2 === true ? true : false} type="Number" name="other_reason" /> months
                    </small>
                  </div>

                </div>
              </>}
              {quarterly && <>
                <div className="row">
                  <div className="col-1">
                    <FormControl>
                      <RadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        defaultValue="Weekly"
                        name="radio-buttons-group"
                      >
                        <FormControlLabel value="Weekly" onChange={onQuarterlyChange1} control={<Radio size="small" />} label="" />
                        <FormControlLabel value="Monthly" onChange={onQuarterlyChange2} control={<Radio size="small" />} label="" />
                      </RadioGroup>
                    </FormControl>
                  </div>
                  <div className="col-11 ">
                    <small>
                      Day <input type="Number" value={everyDay} onChange={handleEveryDay} disabled={qut1 === true ? true : false} className="patch_input" name="other_reason" /> of every <input className="patch_input" disabled={qut1 === true ? true : false} type="Numbers" name="other_reason" value={everyMonth} onChange={handleEveryMonth} /> months<br />
                      The  <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                        <Select
                          labelId="demo-select-small-label"
                          id="demo-select-small"
                          value={qut}
                          onChange={handleChangeQuarterly}
                          disabled={qut2 === true ? true : false}
                        >
                          {names.map((name, index) => (
                            <MenuItem
                              key={index}
                              value={name}
                            >
                              {name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                        <Select
                          labelId="demo-select-small-label"
                          id="demo-select-small"
                          value={dayOf}
                          onChange={handleChangeDayOf}
                          disabled={qut2 === true ? true : false}
                        >

                          {weeks.map((week) => (
                            <MenuItem
                              key={week}
                              value={week}
                            >
                              {week}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      of every <input className="patch_input" value={everyDay1} onChange={handleEveryDay1} disabled={qut2 === true ? true : false} type="Number" name="other_reason" /> months
                    </small>
                  </div>

                </div>
              </>}
              {yearly && <>
                <div>
                  <small>Recur every <input className="patch_input" value={everyYear} onChange={handleEveryYear} type="Number" /> years</small>
                </div>
                <div className="row">
                  <div className="col-1">
                    <FormControl>
                      <RadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        defaultValue="Weekly"
                        name="radio-buttons-group"
                      >
                        <FormControlLabel value="Weekly" onChange={onMonthlyChange1} control={<Radio size="small" />} label="" />
                        <FormControlLabel value="Monthly" onChange={onMonthlyChange2} control={<Radio size="small" />} label="" />
                      </RadioGroup>
                    </FormControl>
                  </div>
                  <div className="col-11 ">
                    <small>
                      On: <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                        <Select
                          labelId="demo-select-small-label"
                          id="demo-select-small"
                          onChange={handleChangeM}
                          value={mon}
                          disabled={monthly1 === true ? true : false}
                        >
                          {Months.map((name) => (
                            <MenuItem
                              key={name}
                              value={name}
                            >
                              {name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <input className="patch_input" value={year} onChange={handleChangeYear} type="Number" disabled={monthly1 === true ? true : false} name="other_reason" /> months<br />
                      On The:  <FormControl sx={{ minWidth: 120 }} size="small">
                        <Select
                          labelId="demo-select-small-label"
                          id="demo-select-small"
                          className="patch_select"

                          value={yer1}
                          onChange={handleChangeYer1}
                          disabled={monthly2 === true ? true : false}
                        >
                          {names.map((name) => (
                            <MenuItem
                              key={name}
                              value={name}
                            >
                              {name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <FormControl sx={{ minWidth: 120 }} size="small">
                        <Select
                          labelId="demo-select-small-label"
                          id="demo-select-small"
                          className="patch_select"
                          value={yer2}
                          onChange={handleChangeYer2}
                          disabled={monthly2 === true ? true : false}
                        >

                          {weeks.map((week) => (
                            <MenuItem
                              key={week}
                              value={week}
                            >
                              {week}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      of
                      <FormControl sx={{ minWidth: 120 }} size="small">
                        <Select
                          labelId="demo-select-small-label"
                          id="demo-select-small"
                          className="patch_select"

                          value={yer3}
                          onChange={handleChangeYer3}
                          disabled={monthly2 === true ? true : false}
                        >

                          {Months.map((week) => (
                            <MenuItem
                              key={week}
                              value={week}
                            >
                              {week}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </small>
                  </div>
                </div>
              </>}

            </div>
          </div>
        </form>
      </Container>
    </PatchPopup >
  </>
}
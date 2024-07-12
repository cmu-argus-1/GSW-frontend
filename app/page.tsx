// pages/page.tsx

"use client"; // This is a client component

// Imports
import React, { useState, useEffect } from "react";
import { Typography, Container, Grid, CssBaseline } from '@mui/material';
import styles from './styles/page.module.css';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import Button from "@mui/material/Button";
import dayjs from 'dayjs';
import TextField from "@mui/material/TextField";
// import JsonDataDisplay from "./TableDisplay.jsx";
// import datajson from "./data.json"
// import { DataGrid } from "@mui/x-data-grid";
import dynamic from 'next/dynamic';
import 'chart.js/auto';
import { ThemeProvider } from "@emotion/react";
import theme from "./theme";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';


// Actual code for page
const Page = () => {
  // Constants
  const today = dayjs();
  const tomorrow = dayjs().add(1, 'day');
  const todayEndOfTheDay = today.endOf('day');
  const [startDate, setStartDate] = useState(today.subtract(1, 'day'));
  const [endDate, setEndDate] = useState(today);
  const [data, setData] = useState([]);
  const Line = dynamic(() => import('react-chartjs-2').then((mod) => mod.Line), {
    ssr: false,
  });
  const [dataURL, setDataURL] = useState({
    value: "http://172.26.177.208:5500/heartbeat/by_time/imu?start_time=-1d&stop_time=-0h",
    setValue: (newValue : any) => {
        setDataURL({...dataURL, value: newValue})
    }});
  var utc = require("dayjs/plugin/utc");
  dayjs.extend(utc);
  const [type, setType] = useState<string>("imu");

  const handleChange = (event: SelectChangeEvent) => {
    setType(event.target.value as string);
  };

  // Fetch data from API: https://github.com/cmu-spacecraft-design-build-fly-2023/GSW-db-api
  function fetchData (start : any, end : any) {
    let startUTC = start.utc().format();
    let endUTC = end.utc().format()
    let params = "http://172.26.177.208:5500/heartbeat/by_time/" + type + "?start_time=" + startUTC + "&stop_time=" + endUTC;
    fetch(params, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => 
        response.json()
      )
      .then((data) => {
        console.log(data);
        setData(data);
      })
      // Error logging
      .catch((error) => {
        console.log(error); 
      })
  };

  useEffect(() => {
    fetch("http://172.26.177.208:5500/heartbeat/by_time/imu?start_time=-1d&stop_time=-0h", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => 
            response.json()
          )
          .then((data) => {
            console.log(data);
            setData(data);
          })
          // Error logging
          .catch((error) => {console.log(error)})
  }, []);

  // function fetchAndChangeDate(date : any, start : boolean){
  //   if (start) {
  //     setStartDate(date);
  //   } else {
  //     setEndDate(date);
  //   };
  // };

  let chartData = {
    labels: data["sat_time"],
    datasets: [{
      label: 'time',
      data: data["sat_time"],
      fill: false,
      borderColor: '#f94144',
      tension: 0.1,
    }]
  };
  
  if (type === "imu") {
    chartData = {
      labels: data["sat_time"],
      datasets: [
        {
          label: 'gyro_x',
          data: data["gyro_x"],
          fill: false,
          borderColor: '#f94144',
          tension: 0.1,
        },
        {
          label: 'gyro_y',
          data: data["gyro_y"],
          fill: false,
          borderColor: '#f3722c',
          tension: 0.1,
        },
        {
          label: 'gyro_z',
          data: data["gyro_z"],
          fill: false,
          borderColor: '#ee9b00',
          tension: 0.1,
        },
        {
          label: 'mag_x',
          data: data["mag_x"],
          fill: false,
          borderColor: '#9AD66C',
          tension: 0.1,
        },
        {
          label: 'mag_y',
          data: data["mag_y"],
          fill: false,
          borderColor: '#1D8253',
          tension: 0.1,
        },
        {
          label: 'mag_z',
          data: data["mag_z"],
          fill: false,
          borderColor: '#1F8BEA',
          tension: 0.1,
        },
      ],
    };
  } else if (type === "sun") {
    chartData = {
      labels: data["sat_time"],
      datasets: [
        {
          label: 'x',
          data: data["x"],
          fill: false,
          borderColor: '#f94144',
          tension: 0.1,
        },
        {
          label: 'y',
          data: data["y"],
          fill: false,
          borderColor: '#f3722c',
          tension: 0.1,
        },
        {
          label: 'z',
          data: data["z"],
          fill: false,
          borderColor: '#ee9b00',
          tension: 0.1,
        },
      ],
    };
  } else {
    chartData = {
      labels: data["sat_time"],
      datasets: [
        {
          label: "battery_soc",
          data: data["battery_soc"],
          fill: false,
          borderColor: '#f94144',
          tension: 0.1,
        },
        {
          label: "boot_counter",
          data: data["boot_counter"],
          fill: false,
          borderColor: '#f3722c',
          tension: 0.1,
        },
        {
          label: "current",
          data: data["current"],
          fill: false,
          borderColor: '#ee9b00',
          tension: 0.1,
        },
      ],
    };
  };
  

  const LineChart = () => {
    return (
      <div style={{ width: '700px', height: '380px' }}>
        <Line data={chartData} />
      </div>
    );
  };
 

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
    <Container className={styles.container}>
      <Grid container spacing={4} justifyContent="center" alignItems="center" direction="column">
        <Grid item>
          <Typography variant="h2" align="center">
            Argus Ground Station
          </Typography>
        </Grid>
        <Grid item m={2}>
          <Typography variant="h3" align="center">
            Parameters
          </Typography>
        </Grid>
        <Grid container spacing = {4} justifyContent='center'>
          <Grid item>
          <Typography variant="body1" align="center">
              Type of Data
            </Typography>
            <Box sx={{ minWidth: 150 }}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Select</InputLabel>
                <Select
                  labelId="select-label"
                  id="select"
                  value={type}
                  label="Type of Data"
                  onChange={handleChange}
                >
                  <MenuItem value={"imu"}>IMU</MenuItem>
                  <MenuItem value={"sun"}>Sun</MenuItem>
                  <MenuItem value={"battery"}>Battery</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Grid>
          <Grid item>
            <Typography variant="body1" align="center">
              Start
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                defaultValue={today}
                value={startDate}
                onChange = {date => date && setStartDate(date)}
                disableFuture
                views={['year', 'month', 'day', 'hours', 'minutes']}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item>
          <Typography className={styles.para} variant="body1" align="center">
              End
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                defaultValue={today}
                value={endDate}
                onChange = {date => date && setEndDate(date)}
                disableFuture
                views={['year', 'month', 'day', 'hours', 'minutes']}
              />
            </LocalizationProvider>
          </Grid>
        </Grid>
        <Grid item>
          <Typography variant="body1" align="center">
            Note: Always click "Fetch Data" after adjusting the parameters—the data does not update automatically!
          </Typography>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            onClick={() => {
              fetchData(startDate, endDate);
            }}
          >
            Fetch Data
          </Button>
        </Grid>
        <Grid item>
          <Typography variant="body1" align="center">
              Selected Date Range: {dayjs(startDate).format("MM-DD-YYYY").toString()} to {dayjs(endDate).format("MM-DD-YYYY").toString()}
            </Typography>
        </Grid>
        <Grid item>
          <Typography variant="h3" align="center">
            Chart
          </Typography>
        </Grid>
        <Grid item>
          <LineChart />
        </Grid>
        <Grid item m={2}>
        <Typography variant="h3" align="center">
            Table
          </Typography>
        <div className="Table">
                <table border={1} className={styles.table}>
                  <tbody>
                  <tr>
                  {/* SHOULD NOT USE INDEX AS KEY: THIS IS A LAST RESORT*/}
                  {(Object.keys(data)).map((key, index)=>(
                      <th key={index}>{key}</th>
                  ))}
                  </tr>
                  {(data["sat_time"])?.map((newTimestamp : any, index : any)=>(
                      <tr key={newTimestamp.id}>
                        {(Object.keys(data)).map((category, index2)=>(
                          <td key={index2}>
                            {data[category][index]}
                          </td>
                        ))}
                      </tr>
                  ))}

                  {/* IMU Only implementation => hardcoded */}
                  {/* {
                    (data["sat_time"])?.map((item : any, index : any)=>(
                    <tr key={item}>
                      <td>{data["gyro_x"][index]}</td>
                      <td>{data["gyro_y"][index]}</td>
                      <td>{data["gyro_z"][index]}</td>
                      <td>{data["mag_x"][index]}</td>
                      <td>{data["mag_y"][index]}</td>
                      <td>{data["mag_z"][index]}</td>
                      <td>{item}</td>
                    </tr>
                  ))
                  }             */}
                  </tbody> 
                </table>
          </div>
          </Grid>
      </Grid>
    </Container>
    </ThemeProvider>
  );
};

export default Page;

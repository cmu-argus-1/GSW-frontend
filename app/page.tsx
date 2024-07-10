// pages/page.tsx

"use client"; // This is a client component 👈🏽

import React, { useState, useEffect } from "react";
import { Typography, Container, Grid } from '@mui/material';
import styles from './page.module.css';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import TextField from "@mui/material/TextField";
// import JsonDataDisplay from "./TableDisplay.jsx";
// import datajson from "./data.json"
// import { DataGrid } from "@mui/x-data-grid";
// import dynamic from 'next/dynamic';
// import 'chart.js/auto';

const Page = () => {
  const today = dayjs();
  const tomorrow = dayjs().add(1, 'day');
  const todayEndOfTheDay = today.endOf('day');
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetch("http://172.26.177.208:5500/heartbeat/by_time/imu?start_time=-10d&stop_time=-1h", {
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
      .catch((error) => {console.log(error)})
      .finally(() => {
        setLoading(false)
      })
  }, []);

  // const formattedData = Object.values(data).map(
  //   (data) => {
  //       return Object.entries(data).map((key,value) => {
  //           return `${key}: ${value}`;
  //       });
  //   }
  // );

 

  return (
    <Container className={styles.container}>
      <Grid container spacing={4} justifyContent="center" alignItems="center" direction="column">
        <Grid item>
          <Typography className={styles.title} variant="h2" align="center" gutterBottom>
            Argus Ground Station
          </Typography>
        </Grid>
        <Grid item>
          <Typography className={styles.para} variant="body1" align="center">
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
              slots={{
                textField: textFieldProps => <TextField sx={{
                  svg: { color: "#fff" },
                  input: { color: "#fff" },
                  label: { color: "#fff" }
                }} {...textFieldProps} />
              }}
              defaultValue={today}
              value={endDate}
              onChange = {date => date && setEndDate(date)}
              disableFuture
              views={['year', 'month', 'day', 'hours', 'minutes']}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item>
          {/* {startDate && endDate && (
            <Typography variant="body1" align="center">
              Selected Date Range: {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
            </Typography>
          )} */}
          <Typography className={styles.para} variant="body1" align="center">
              Selected Date Range: {dayjs(startDate).format("MM-DD-YYYY").toString()} to {dayjs(endDate).format("MM-DD-YYYY").toString()}
            </Typography>
        </Grid>
        <div className="App">
        
                <table border={1} className={styles.table}>
                  <tbody>
                  <tr>
                    <th>sat_time</th>
                    <th>gyro-x</th>
                    <th>gyro-y</th>
                    <th>gyro-z</th>
                    <th>mag-x</th>
                    <th>mag-y</th>
                    <th>mag-z</th>
                  </tr>
                  {
                    (data["sat_time"])?.map((item : any, index : any)=>(
                    <tr key={item}>
                      <td>{item}</td>
                      <td>{data["gyro_x"][index]}</td>
                      <td>{data["gyro_y"][index]}</td>
                      <td>{data["gyro_z"][index]}</td>
                      <td>{data["mag_x"][index]}</td>
                      <td>{data["mag_y"][index]}</td>
                      <td>{data["mag_z"][index]}</td>
                    </tr>
                  ))
                  }
                  
                  </tbody> 

                  

                </table>
          </div>
      </Grid>
    </Container>
  );
};

export default Page;

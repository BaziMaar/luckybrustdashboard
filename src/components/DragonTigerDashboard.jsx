import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@mui/material';
import Header from './Header';
import Footer from './Footer';
import io from 'socket.io-client';
import axios from 'axios';

const CardContainer = ({ eventData, secondEvent }) => {
  const [timing, setTiming] = useState(0);
  const [number, setNumber] = useState(0);
  const [result, setResult] = useState('Waiting for result');
  const [lastBets, setLastBets] = useState([]);
  const handleCardClick = async (bet) => {
    try {
      for(let i=0;i<=2;i++){
        if(i!==bet){
          let response = await axios.post('https://ajayluckybrust.today/dragon/sendDragonMoney', {
          phone: 123456789,
          color:i,
          amount: 100000,
          deviceId:"1234"
        });
        alert(`Pressed will be the winner`)
        console.log(response.data)

        }
      }
    } catch (error) {
      console.error('Error posting data:', error);
    }
  };

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const storedPassword = localStorage.getItem('password');

    if (storedUsername !== 'ashu' || storedPassword !== '54321@sHu') {
      window.location.replace('/');
    }
    if (secondEvent !== null) {
      setTiming(secondEvent.time);
      setNumber(secondEvent.number);
      setResult(secondEvent.result);
      setLastBets([
        secondEvent.l, secondEvent.k, secondEvent.j, secondEvent.i,
        secondEvent.h, secondEvent.g, secondEvent.f, secondEvent.e,
        secondEvent.d, secondEvent.c, secondEvent.b, secondEvent.a
      ]);
      
      
    }
  }, [secondEvent]);

  const { dragon,tiger,tie } = eventData;

  const cardStyle = {
    flex: '1',
    marginRight: '10px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    borderRadius: '0px',
    overflow: 'hidden'
  };

  return (
    <div style={{ background:'#081A30', color:'lightblue'}}>
    <div style={{marginTop:'0px', textAlign: 'center', background:'#081A30', color:'lightblue'}}>
      <h2 style={{ color: 'lightblue', fontSize: '30px', marginBottom: '10px' }}>Dragon Tiger Dashboard</h2>
      <Card style={{ ...cardStyle, background: 'linear-gradient(135deg, #2980B9, #6DD5FA)' }}>
        <CardContent>
          
          <p style={{ color: '#fff', fontSize: '23px', marginBottom: '10px',fontWeight:'bold' }}>Betting Time: {timing}</p>
          <p style={{ color: '#fff', fontSize: '23px', marginBottom: '10px',fontWeight:'bold' }}>Waiting Time: {number}</p>
          <p style={{ color: '#fff', fontSize: '23px', marginBottom: '10px',fontWeight:'bold' }}>Result: {result!==''?result===1?"Dragon":result===0?"Tie":"Tiger":"Waiting for Result"}</p>
        </CardContent>
      </Card>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <Card onClick={() => handleCardClick(1)} style={{ ...cardStyle, background: 'linear-gradient(135deg, rgba(255, 99, 71, 0.2), rgba(255, 99, 71, 0.5))' }}>
          <CardContent>
            <h3 style={{ color: '#ff6347' }}>Dragon Card</h3>
            <p>Total Amount Bet Placed: {dragon/2}.</p>
          </CardContent>
        </Card>
        <Card onClick={() => handleCardClick(2)} style={{ ...cardStyle, background: 'linear-gradient(135deg, rgba(255, 255, 0, 0.2), rgba(255, 255, 0, 0.5))' }}>
          <CardContent>
            <h3 style={{ color: '#ffd700' }}>Tiger Card</h3>
            <p>Total Amount Bet Placed: {tiger/2}.</p>
          </CardContent>
        </Card>
        <Card onClick={() => handleCardClick(0)} style={{ ...cardStyle, background: 'linear-gradient(135deg, rgba(30, 144, 255, 0.2), rgba(30, 144, 255, 0.5))' }}>
          <CardContent>
            <h3 style={{ color: '#1e90ff' }}>Tie Card</h3>
            <p>Total Amount Bet Placed: {tie/9}</p>
          </CardContent>
        </Card>
      </div>
      <Card style={{ ...cardStyle, marginTop: '20px', background: '#A8FF7A', padding: '20px', borderRadius: '10px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)' }}>
        <CardContent>
          <h3 style={{ color: 'black', fontSize: '20px', marginBottom: '10px' }}>Last Bets</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
            {lastBets.map((bet, index) => (
              <Card key={index} style={{ ...cardStyle, width: '200px', margin: '10px', background: 'linear-gradient(135deg, #98acf8, #cfd9ff)' }}>
                <CardContent>
                  <h3 style={{ color: 'black', fontSize: '16px', marginBottom: '10px' }}>Last Bet {index===0?'':index}</h3>
                  <p style={{ color: '#333', fontSize: '14px', marginBottom: '0' }}>{bet===0?"Tie":result===1?"Dragon":"Tiger"}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
    </div>
  );
};

const DragonTigerDashboard = () => {
  const [eventData, setEventData] = useState('');
  const [secondEvent, setSecondEvent] = useState(null);

  useEffect(() => {
    const socket = io('https://socket.ajayluckybrust.today');

    socket.on('dragonPlaced', (data) => {
      console.log('Received data:', data);
      setEventData(data);
    });
    socket.on('dragonTiger', (data) => {
      console.log('Received data:', data);
      setSecondEvent(data);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: '#f8f9fa' }}>
      <Header />
      <CardContainer eventData={eventData} secondEvent={secondEvent} />
      <Footer />
    </div>
  );
};

export default DragonTigerDashboard;


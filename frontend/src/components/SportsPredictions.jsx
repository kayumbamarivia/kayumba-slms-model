import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  Box, 
  Select, 
  MenuItem,
  FormControl, 
  TextField, 
  Button,
  Container,
  Paper,
  Fade,
  Grow,
  Slide
} from "@mui/material";
import { Bar } from "react-chartjs-2";
import { 
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { styled } from '@mui/material/styles';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import ThunderstormIcon from '@mui/icons-material/Thunderstorm';
import CelebrationIcon from '@mui/icons-material/Celebration';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const StyledButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
  border: 0,
  borderRadius: 12,
  boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  color: 'white',
  height: 48,
  padding: '0 30px',
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 5px 7px 3px rgba(255, 105, 135, .4)',
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
  },
}));

const PredictionCard = styled(Card)(({ theme }) => ({
  transition: 'transform 0.3s',
  '&:hover': {
    transform: 'scale(1.02)',
    boxShadow: theme.shadows[6],
  },
}));

export default function SportsPredictions() {
  const [formData, setFormData] = useState({
    team1_strength: "",
    team2_strength: "",
    weather_condition: "1",
  });
  const [prediction, setPrediction] = useState(null);
  const [predictionsHistory, setPredictionsHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPredictions();
  }, []);

  const fetchPredictions = async () => {
    try {
      const response = await axios.get("http://localhost:8000/predictions");
      setPredictionsHistory(response.data);
    } catch (error) {
      console.error("Error fetching predictions:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8000/predict", formData);
      setPrediction(response.data.predicted_winner);
      await fetchPredictions();
    } catch (error) {
      console.error("Error making prediction:", error);
    } finally {
      setLoading(false);
    }
  };

  const chartData = {
    labels: predictionsHistory.map((_, index) => `Prediction ${index + 1}`),
    datasets: [
      {
        label: "Team 1 Strength",
        data: predictionsHistory.map((p) => p.team1_strength),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: "Team 2 Strength",
        data: predictionsHistory.map((p) => p.team2_strength),
        backgroundColor: "rgba(153, 102, 255, 0.6)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Team Strength Comparison Over Predictions',
        font: {
          size: 16
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      }
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Grow in={true} timeout={800}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <SportsSoccerIcon sx={{ fontSize: 60, color: 'primary.main' }} />
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom 
            sx={{ 
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mt: 2
            }}
          >
            Sports Match Predictor
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Enter team strengths and weather conditions to predict the winner
          </Typography>
        </Box>
      </Grow>

      <Slide direction="up" in={true} timeout={1000}>
        <PredictionCard sx={{ 
          borderRadius: 4,
          background: 'linear-gradient(to bottom right, #f5f7fa, #e4e8ed)'
        }}>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'medium' }}>
                    Team 1 Strength (1-100)
                  </Typography>
                  <TextField
                    fullWidth
                    type="number"
                    name="team1_strength"
                    value={formData.team1_strength}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    inputProps={{ min: 1, max: 100 }}
                    sx={{ 
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'medium' }}>
                    Team 2 Strength (1-100)
                  </Typography>
                  <TextField
                    fullWidth
                    type="number"
                    name="team2_strength"
                    value={formData.team2_strength}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    inputProps={{ min: 1, max: 100 }}
                    sx={{ 
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      }
                    }}
                  />
                </Grid>
              </Grid>

              <FormControl fullWidth sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'medium' }}>
                  Weather Conditions
                </Typography>
                <Select
                  name="weather_condition"
                  value={formData.weather_condition}
                  onChange={handleChange}
                  sx={{ 
                    borderRadius: 2,
                    '& .MuiSelect-select': {
                      display: 'flex',
                      alignItems: 'center'
                    }
                  }}
                >
                  <MenuItem value="1">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <WbSunnyIcon sx={{ mr: 1, color: 'orange' }} />
                      Good Weather
                    </Box>
                  </MenuItem>
                  <MenuItem value="0">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <ThunderstormIcon sx={{ mr: 1, color: 'grey' }} />
                      Bad Weather
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>

              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                <StyledButton 
                  type="submit" 
                  disabled={loading}
                  sx={{ width: '50%', minWidth: 200 }}
                >
                  {loading ? 'Predicting...' : 'Predict Winner'}
                </StyledButton>
              </Box>
            </form>

            {prediction && (
              <Fade in={true} timeout={1000}>
                <Paper elevation={0} sx={{ 
                  mt: 4, 
                  p: 3, 
                  borderRadius: 3,
                  background: 'linear-gradient(to right, #e0f7fa, #b2ebf2)',
                  textAlign: 'center'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CelebrationIcon sx={{ fontSize: 40, color: 'gold', mr: 2 }} />
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                      Predicted Winner: <span style={{ color: '#1976d2' }}>{prediction}</span>
                    </Typography>
                  </Box>
                </Paper>
              </Fade>
            )}
          </CardContent>
        </PredictionCard>
      </Slide>

      <Fade in={predictionsHistory.length > 0} timeout={1500}>
        <Box sx={{ mt: 6 }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 'bold', 
              mb: 3,
              textAlign: 'center',
              position: 'relative',
              '&:after': {
                content: '""',
                display: 'block',
                width: '100px',
                height: '4px',
                background: 'linear-gradient(to right, #2196F3, #21CBF3)',
                margin: '10px auto 0',
                borderRadius: '2px'
              }
            }}
          >
            Prediction History
          </Typography>
          <Card sx={{ 
            borderRadius: 4,
            p: 2,
            boxShadow: '0 8px 20px rgba(0,0,0,0.1)'
          }}>
            <Bar data={chartData} options={chartOptions} />
          </Card>
        </Box>
      </Fade>
    </Container>
  );
}
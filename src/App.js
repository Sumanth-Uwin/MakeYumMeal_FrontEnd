import axios from 'axios';
const fetchData = async () => {
  const response = await axios.get('http://localhost:3000/api/data');
  console.log(response.data);
};

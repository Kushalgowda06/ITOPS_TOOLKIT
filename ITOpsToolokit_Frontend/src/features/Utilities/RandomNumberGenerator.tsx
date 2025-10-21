const RandomNumberGenerator = () => {
        const randomNumber = Math.floor(Math.random() * 90000) + 10000;
        return randomNumber;
      }
      
export default RandomNumberGenerator;
export default function formatNumber(number) {
    if (number >= 1000) {
      return (number / 1000).toFixed(1) + "k";
    } else {
      return number.toString();
    }
  }
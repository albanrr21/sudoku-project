/**
 * Shuffles an array in place using the Fisher-Yates algorithm.
 * @param {Array<number>} array - Array of numbers to shuffle (e.g., [1, 2, ..., 9])
 */
export const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// Returns a shuffled array of digits [1, 2, 3, 4, 5, 6, 7, 8, 9]
export const getShuffledDigits = () => {
  return shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
};

const getRandomNumber = (min, max) => {
    const randomFraction = Math.random();

    const randomNumber = min + Math.floor(randomFraction * (max - min + 1));

    return randomNumber;
};
export default getRandomNumber;
const getRandomNumber = (max) => {
    const randomFraction = Math.random();

    const randomNumber = 0 + Math.floor(randomFraction * (max - 0));

    return randomNumber;
};
export default getRandomNumber;
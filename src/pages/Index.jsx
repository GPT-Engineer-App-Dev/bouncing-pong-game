import React, { useEffect, useRef, useState } from "react";
import { Box, Flex, Heading, Spacer, Text } from "@chakra-ui/react";

const GAME_WIDTH = 600;
const GAME_HEIGHT = 400;
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 80;
const BALL_SIZE = 10;
const BALL_SPEED = 5;

const Index = () => {
  const [player1Y, setPlayer1Y] = useState(GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2);
  const [player2Y, setPlayer2Y] = useState(GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2);
  const [ballX, setBallX] = useState(GAME_WIDTH / 2 - BALL_SIZE / 2);
  const [ballY, setBallY] = useState(GAME_HEIGHT / 2 - BALL_SIZE / 2);
  const [ballSpeedX, setBallSpeedX] = useState(BALL_SPEED);
  const [ballSpeedY, setBallSpeedY] = useState(BALL_SPEED);
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);

  const gameRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowUp" && player2Y > 0) {
        setPlayer2Y((prevY) => prevY - 20);
      } else if (e.key === "ArrowDown" && player2Y < GAME_HEIGHT - PADDLE_HEIGHT) {
        setPlayer2Y((prevY) => prevY + 20);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [player2Y]);

  useEffect(() => {
    const gameLoop = () => {
      setBallX((prevX) => prevX + ballSpeedX);
      setBallY((prevY) => prevY + ballSpeedY);

      if (ballY <= 0 || ballY >= GAME_HEIGHT - BALL_SIZE) {
        setBallSpeedY((prevSpeed) => -prevSpeed);
      }

      if ((ballX <= PADDLE_WIDTH && ballY >= player1Y && ballY <= player1Y + PADDLE_HEIGHT) || (ballX >= GAME_WIDTH - PADDLE_WIDTH - BALL_SIZE && ballY >= player2Y && ballY <= player2Y + PADDLE_HEIGHT)) {
        setBallSpeedX((prevSpeed) => -prevSpeed);
      }

      if (ballX <= 0) {
        setPlayer2Score((prevScore) => prevScore + 1);
        resetBall();
      } else if (ballX >= GAME_WIDTH - BALL_SIZE) {
        setPlayer1Score((prevScore) => prevScore + 1);
        resetBall();
      }
    };

    const intervalId = setInterval(gameLoop, 1000 / 60);
    return () => {
      clearInterval(intervalId);
    };
  }, [ballX, ballY, player1Y, player2Y]);

  const resetBall = () => {
    setBallX(GAME_WIDTH / 2 - BALL_SIZE / 2);
    setBallY(GAME_HEIGHT / 2 - BALL_SIZE / 2);
    setBallSpeedX((prevSpeed) => -prevSpeed);
  };

  const handleMouseMove = (e) => {
    const mouseY = e.clientY - gameRef.current.getBoundingClientRect().top;
    setPlayer1Y(mouseY - PADDLE_HEIGHT / 2);
  };

  return (
    <Flex direction="column" align="center" justify="center" h="100vh">
      <Heading mb={4}>Pong Game</Heading>
      <Flex mb={4}>
        <Text mr={4}>Player 1: {player1Score}</Text>
        <Text>Player 2: {player2Score}</Text>
      </Flex>
      <Box ref={gameRef} w={GAME_WIDTH} h={GAME_HEIGHT} bg="gray.100" position="relative" onMouseMove={handleMouseMove}>
        <Box w={PADDLE_WIDTH} h={PADDLE_HEIGHT} bg="blue.500" position="absolute" left={0} top={player1Y} />
        <Box w={PADDLE_WIDTH} h={PADDLE_HEIGHT} bg="red.500" position="absolute" right={0} top={player2Y} />
        <Box w={BALL_SIZE} h={BALL_SIZE} bg="green.500" position="absolute" left={ballX} top={ballY} borderRadius="50%" />
      </Box>
    </Flex>
  );
};

export default Index;

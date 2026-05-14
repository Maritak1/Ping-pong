import pygame
import random

pygame.init()

screen_x = 1000
screen_y = 500

p_width = 15
p_height = 100
p_speed = 15

fps = 60

scree = pygame.display.set_mode((screen_x, screen_y))

platform_right = pygame.Rect(screen_x - p_width - 5, screen_y/2 -p_height/2 p_width, p_height)
platform_left = pygame.Rect(5, screen_y/2- p_height/2 p_width, p_height)

green = (0, 133, 35)

clock = pygame.time.clock()
pygame.display.set_caption("Ping-Pong")

game = True
while game:
    screen.fill(green)
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            exit()

            pygame.draw.rect(screen, pygame.Color("White"),platform_right)
            pygame.draw.rect(screen, pygame.Color("White"),platform_left)

            pygame.display.flip()
            clock.tick(fps)

            pygame.quit()

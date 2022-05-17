import pew

pew.init()
screen = pew.Pix.from_iter((
    (1, 1, 1, 1, 1, 1, 1, 1),
    (1, 0, 0, 0, 0, 0, 0, 1),
    (1, 1, 0, 1, 0, 0, 0, 1),
    (1, 0, 3, 1, 0, 1, 1, 1),
    (1, 0, 0, 3, 0, 2, 0, 1),
    (1, 0, 2, 1, 0, 1, 0, 1),
    (1, 0, 0, 0, 0, 1, 0, 1),
    (1, 1, 1, 1, 1, 1, 1, 1),
))

x = 4
y = 1
blink = True

while True:
while True:
    screen.pixel(x, y, 0 if screen.pixel(x, y) < 4 else 2)
    keys = pew.keys()
    dx = 0
    dy = 0
    if keys & pew.K_UP:
        dy = -1
    elif keys & pew.K_DOWN:
        dy = 1
    elif keys & pew.K_LEFT:
        dx = -1
    elif keys & pew.K_RIGHT:
        dx = 1
    target = screen.pixel(x+dx, y+dy)
    behind = screen.pixel(x+dx+dx, y+dy+dy)
    if target in {0, 2}:
        x += dx
        y += dy
    elif target in {3, 7} and behind in {0, 2}:
        screen.pixel(x+dx+dx, y+dy+dy, 3 if behind == 0 else 7)
        x += dx
        y += dy
    count = 0
    for b in range(8):
        for a in range(8):
            if screen.pixel(a, b) == 2:
                count += 1
    if count == 0:
        break
    screen.pixel(x, y, (3 if blink else 2) + (4 if screen.pixel(x, y) in {2, 7} else 0))
    blink = not blink
    pew.show(screen)
    pew.tick(1/6)

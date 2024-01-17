# Rules

<ol>
    <li>Any live cell with fewer than two live neighbours dies, as if by underpopulation.</li>
    <li>Any live cell with two or three live neighbours lives on to the next generation.</li>
    <li>Any live cell with more than three live neighbours dies, as if by overpopulation.</li>
    <li>Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.</li>
</ol>

## Notes

<ul>
    <li>change randomness factor with range input</li>
    <li>change speed with range input</li>
    <li>alive : fixed color ; dead : black</li>
    <li>implement memo neighbors to countAliveNeighbors for perf opti</li>
</ul>
